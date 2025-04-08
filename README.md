# Pixil 📸

![pixil-banner](./frontend/src/assets/banner.png)

Pixil is an open-source, self-hosted photo and video gallery built for privacy, performance, and ease of use. Whether you're backing up family memories or organizing a massive media archive, Pixil keeps your content safe and accessible—on your own terms.

---

## ✨ Features

- 🔐 **Secure & Private** — Your data stays with you. No third-party access.
- 🌐 **Web-Based Interface** — Intuitive UI built with modern web technologies.
- 🖼️ **Media Management** — Browse, search, and organize photos and videos easily.
- 🧠 **AI Recognition (WIP)** — Smart tagging using the [YOLO v11 model](https://docs.ultralytics.com/models/yolo11/).
- 🔄 **Sync & Upload** — Efficient uploads with optional deduplication and metadata extraction.
- 🗃️ **Albums** — Organize your media into custom collections.

---

## 🧰 Tech Stack

| Layer     | Tech Used                       |
|-----------|---------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS |
| Backend   | Golang (REST API)               |
| Image Recognition| Python (YOLO interface)         |
| Infrastructure   | Docker, Docker Compose, Nginx   |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TofuWaffles/pixil.git
cd pixil
```

### 2. Set up environment

Copy the example `.env` file and fill in your own secrets/config:

```bash
cp .env.example .env
```

Make sure to fill the variables in the .env config.

Note: For the DOMAIN_URL variable, be sure to include only the root domain and top level domain.\
e.g. example.com (NOT https://example.com or www.example.com)

### 3. Build and run with Docker

For the development build
```bash
docker compose --profile dev up --build
```

For the production build
```bash
docker compose --profile prod up --build
```

> You’ll now be able to access Pixil from `http://localhost:3000` on the development build or your domain url on the production build.
