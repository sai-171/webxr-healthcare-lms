# WebXR Healthcare LMS with AI Diagnostics

A comprehensive Learning Management System (LMS) for healthcare education leveraging **WebXR (Augmented Reality)** for 3D anatomy visualization and **Artificial Intelligence** for medical image diagnostics (Chest X-Ray analysis).

## 🚀 Project Overview

This application bridges the gap between theoretical medical study and practical visualization. It provides an immersive AR learning environment alongside a powerful diagnostic backend powered by PyTorch and FastAPI.



### Key Features

* **🔍 AI Diagnostics:** Upload medical images (Chest X-Rays) to receive real-time predictions and heatmaps (GradCAM) highlighting regions of interest.
* **🫀 Interactive AR:** View and manipulate 3D anatomical models (e.g., Heart) in Augmented Reality directly from the browser.
* **📊 Student Dashboard:** Track learning progress, achievements, and course schedules.
* **🐳 Fully Containerized:** Runs entirely via Docker without needing local Python or Node.js installations.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript, TailwindCSS, Three.js / React-Three-Fiber (WebXR).
* **Backend:** Python (FastAPI), PyTorch (Machine Learning), OpenCV.
* **Infrastructure:** Docker, Docker Compose, Nginx.
* **AI Models:** Custom MobileNetV2 & Hybrid Vision Transformer trained on medical datasets.

---

## 📋 Prerequisites

* **Docker Desktop** (Running and installed).
* *That's it! No Python, Node.js, or other libraries are required on your host machine.*

---

## ⚡ How to Run (One-Step)

1.  **Clone or Download** this repository.
2.  **Navigate** to the project root directory in your terminal:
    ```bash
    cd webxr-healthcare-lms
    ```
3.  **Launch the Application** using Docker Compose:
    ```bash
    docker compose up --build
    ```

> **Note:** The first launch may take a few minutes as it downloads the necessary AI libraries (PyTorch) and builds the frontend.

---

## 🖥️ Accessing the App

Once the terminal shows the containers are running:

* **Frontend (LMS & AR):** [http://localhost:3000](http://localhost:3000)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## ⚠️ Important Note on WebXR (AR/VR)

**Augmented Reality features require a Secure Context (HTTPS) or Localhost.**

* **Testing on Computer:** AR will work perfectly on `localhost:3000`.
* **Testing on Mobile:** You cannot simply access `http://YOUR_PC_IP:3000` from your phone to test AR.
    * **Solution:** Connect your phone via USB and use **Chrome Remote Debugging (Port Forwarding)** to map your phone's `localhost:3000` to your computer's `localhost:3000`.

---

## 📂 Project Structure

```text
webxr-healthcare-lms/
├── backend/                 # FastAPI Application
│   ├── app/                 # Source code (API, Services)
│   ├── trained_models/      # PyTorch .pth models
│   └── Dockerfile           # Python Environment
├── frontend/                # React Application
│   ├── src/                 # Components, AR Logic, Pages
│   ├── public/models/       # 3D GLB Assets
│   └── Dockerfile           # Node build + Nginx server
└── docker-compose.yml       # Orchestration
