# React + Vite Project

Этот проект создан с помощью [Vite](https://vitejs.dev/) и [React](https://reactjs.org/).
В этом README вы найдёте все необходимые команды и инструкции, чтобы быстро клонировать репозиторий и запустить приложение локально.

---

## 📋 Содержание

- Первое задание
- [Требования](#-требования)
- [Установка](#-установка)

---
## Первое задание
Для запуска первого задания нужно подгрузить файлы ojf_dict2.csv и fias_dict.csv в папку /src/data
и запустить файл server_prepairing.py
Там будет полный прогон модели, так что для этого требуются вычислительные мощности, так что файл matches.csv содержит уже прогон сопоставлений
```bash
python server_prepaiting.py
```

## 🛠 Требования

- Node.js v16 или выше
- npm (рекомендуется v8+) или Yarn
- Python 3.13
- pip v24 и выше

Проверить версии можно командами:

```bash
python --version
pip --version
node -v
npm -v  # или yarn -v
```

---

## ⚙️ Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/maloveroyatno/IAC_repo_addresse.git
cd IAC_repo_addresse
```
Для перехода к установке зависимостей:
```
cd /src
```

2. Установите зависимости:

```bash
npm install
```
```bash
python -m venv .venv
pip install --upgrade pip      # обновить pip (рекомендуется)
pip install -r requirements.txt
```

3. Скачайте исходники данных:
Яндекс.Диска скачайте и перенесите все файлы в /src/data
https://disk.yandex.ru/d/HQY2IuG_Wom5RQ

## 🚀 Запуск в режиме разработки

Выполните команду для запуска клиентской части:

```bash
npm run dev
```

Для запуска сервера выполните:

```bash
node server.js
```

## Первое задание

