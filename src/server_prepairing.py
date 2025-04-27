# match_addresses.py
import os
import re
import numpy as np
import pandas as pd
import faiss
import torch
from sentence_transformers import SentenceTransformer

# Настройка устройства
def get_device():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Устройство для вычисений: {device}")
    return device

# Инициализация модели
def load_model(device):
    return SentenceTransformer("intfloat/multilingual-e5-small", device=device)

# Нормализация текста адреса
def normalize_address(text):
    text = str(text).lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# Генерация эмбеддингов
def get_embeddings(addresses, model, cache_path=None, batch_size=128):
    if cache_path and os.path.exists(cache_path):
        print(f"Загрузка эмбеддингов из кэша: {cache_path}")
        return np.load(cache_path)

    texts = [f"query: {normalize_address(addr['address'])}" for addr in addresses]
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch_embeddings = model.encode(batch, normalize_embeddings=True, convert_to_numpy=True)
        embeddings.append(batch_embeddings)
    embeddings = np.vstack(embeddings).astype("float32")

    if cache_path:
        np.save(cache_path, embeddings)
        print(f"Эмбеддинги сохранены в кэш: {cache_path}")
    return embeddings

# Создание или загрузка FAISS индекса
def build_or_load_faiss_index(embeddings, index_path="./data/faiss_index.index", nlist=4096, batch_size=10000):
    if os.path.exists(index_path):
        print("Загрузка существующего FAISS индекса...")
        index = faiss.read_index(index_path)
    else:
        print("Создание нового FAISS индекса...")
        d = embeddings.shape[1]
        quantizer = faiss.IndexFlatL2(d)
        index = faiss.IndexIVFFlat(quantizer, d, nlist)
        index.train(embeddings)
        for i in range(0, len(embeddings), batch_size):
            index.add(embeddings[i:i+batch_size])
        faiss.write_index(index, index_path)
        print("Индекс сохранён.")
    index.nprobe = 8
    return index

# Массовый поиск
def batch_search(index, list1, list2, emb2, batch_size=10000, top_k=1):
    all_matches = []
    for i in range(0, len(emb2), batch_size):
        print(f"Батч {i}...")
        batch_emb = emb2[i:i + batch_size]
        scores, indices = index.search(batch_emb, k=top_k)
        batch = list2[i:i + batch_size]
        data = {
            "list2_id": [r["id"] for r in batch],
            "list2_address": [r["address"] for r in batch],
            "matched_list1_id": [list1[idx[0]]["id"] for idx in indices],
            "matched_list1_address": [list1[idx[0]]["address"] for idx in indices],
            "score": scores[:,0].astype(float)
        }
        all_matches.append(pd.DataFrame(data))
    return pd.concat(all_matches, ignore_index=True)

# Основная логика
def main():
    out = "./data/matches.csv"
    if os.path.exists(out):
        print(f"{out} уже есть, выхожу.")
        return
    dev = get_device()
    model = load_model(dev)

    # Файлы
    p1, p2 = "./data/fias_dict.csv", "./data/ojf_dict2.csv"
    c1, c2 = "./data/emb1.npy", "./data/emb2.npy"
    idx = "./data/faiss_index.index"

    d1 = pd.read_csv(p1).to_dict(orient="records")
    d2 = pd.read_csv(p2).to_dict(orient="records")

    print("Эмбеддинги 1...")
    e1 = get_embeddings(d1, model, cache_path=c1)
    print("Эмбеддинги 2...")
    e2 = get_embeddings(d2, model, cache_path=c2)

    ix = build_or_load_faiss_index(e1, index_path=idx)
    df = batch_search(ix, d1, d2, e2)

    os.makedirs(os.path.dirname(out), exist_ok=True)
    df.to_csv(out, index=False)
    print("Сохранено matches.csv")

if __name__ == "__main__":
    main()
