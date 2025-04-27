#!/usr/bin/env python3
import sys, os, json, traceback
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer

def search_address(user_input):
    print(f"[DEBUG] Received input: {user_input}", file=sys.stderr)

    # Отладка размера файла индекса
    idx_path = './data/faiss_index.index'
    try:
        size = os.path.getsize(idx_path)
        print(f"[DEBUG] Index file size: {size:,} bytes", file=sys.stderr)
    except Exception as e:
        print(f"[WARN] Could not stat index file: {e}", file=sys.stderr)

    # Попытка загрузки CSV и индекса
    try:
        df = pd.read_csv('./data/fias_dict.csv')
        print(f"[DEBUG] Loaded DataFrame: {df.shape[0]} rows, {df.memory_usage(deep=True).sum():,} bytes", file=sys.stderr)
        records = df.to_dict(orient='records')
    except Exception as e:
        print(f"[ERROR] Failed to load CSV: {type(e).__name__}: {e}", file=sys.stderr)
        raise

    try:
        index = faiss.read_index(idx_path)
    except MemoryError as e:
        print(f"[ERROR] MemoryError loading FAISS index ({size:,} bytes): {e}", file=sys.stderr)
        raise
    except Exception as e:
        print(f"[ERROR] Failed to read FAISS index: {type(e).__name__}: {e}", file=sys.stderr)
        raise

    model = SentenceTransformer("intfloat/multilingual-e5-small", device='cpu')
    query = model.encode([f"query: {user_input}"], normalize_embeddings=True).astype("float32")
    print(f"[DEBUG] Query emb shape: {query.shape}", file=sys.stderr)

    scores, indices = index.search(query, k=3)
    print(f"[DEBUG] Raw scores: {scores}, indices: {indices}", file=sys.stderr)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        rec = records[idx]
        results.append({
            "matched_id": rec.get("id"),
            "matched_address": rec.get("address"),
            "score": float(score)
        })

    print(f"[DEBUG] Formatted results: {results}", file=sys.stderr)
    return results

def main():
    try:
        if len(sys.argv) != 2:
            raise ValueError("Expected one argument: address")
        suggestions = search_address(sys.argv[1])
        print(json.dumps(suggestions, ensure_ascii=False))
    except Exception:
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
