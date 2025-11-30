⚛️ QuantaSim-RT Real-time Quantum Circuit Simulator & 3D Visualizer

A real-time quantum circuit simulator and 3D visualization tool that runs directly in your browser.
Experience the principles of quantum mechanics through interactive, real-time visualization.
<img width="2969" height="1413" alt="image" src="https://github.com/user-attachments/assets/23b53499-0cd1-4a7d-8bcd-663e1ae63be6" />
<img width="2975" height="1479" alt="image" src="https://github.com/user-attachments/assets/1c76c2c7-e643-4c61-86b0-766a50650137" />
## 🤖 Development Story

This project was built by my proprietary 
**AI Development Orchestration System**.

**How it works:**
- Human instruction 
- Powered by Gemini 2.5 Flash (free tier)
- **Result: Production-ready full-stack app in 1 hour**

The system itself remains private for now,
but this quantum simulator proves what it can do.

> **Interested in the tech or potential collaboration? Reach out: [tarocha1019@icloud.com]**


---

## 📖 About The Project

QuantaSim-RT is a web application that allows users to build and simulate small-scale quantum circuits interactively.

This project utilizes a robust Python backend powered by **Qiskit Aer** to perform physically accurate quantum state calculations. Notably, it handles the complexity of mixed states resulting from entanglement by calculating **reduced density matrices**.

The calculation results are instantly streamed via WebSockets to a modern React frontend, where they are visualized on interactive 3D Bloch spheres using **Three.js**.

---

## Key Features ✨

* **Instant Feedback**: Circuit changes are calculated and visualized in real-time, facilitated by WebSocket communication.
* **Physically Accurate**: Correctly handles quantum entanglement and calculates reduced density matrices for an accurate Bloch sphere representation of mixed states.
* **3D Visualization**: Interactive 3D Bloch spheres powered by **Three.js** (@react-three/fiber).
* **Modern Stack**: Built with FastAPI (Python) and Vite + React (TypeScript/JavaScript).

---

## 🤖 Development Insights: Leveraging AI in Development

This project was developed as an example of **modern, LLM-assisted software engineering**.

It was conceived as a rapid prototyping experiment to explore the question: "How quickly can a single engineer prototype a complex scientific tool by effectively utilizing cutting-edge Large Language Models (LLMs)?"

The development process was highly collaborative, combining human direction with AI execution:

* **Architecture & Prompt Engineering:** Human-Led
* **Core Logic Generation:** AI-Assisted

By leveraging AI for heavy-lifting tasks like initial coding and immediate debugging, the project was completed **with remarkable speed for a solo development effort**.
---

## ⚙️ Built With

**Backend:**

* Python
* FastAPI (Web Framework & WebSockets)
* Uvicorn (ASGI Server)
* Qiskit & Qiskit Aer (Quantum Computing SDK)
* NumPy

**Frontend:**

* React
* Vite (Build Tool)
* Three.js & @react-three/fiber (3D Graphics)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites**

* Python 3.10 or higher
* Node.js (LTS version recommended)

**Installation**

1.  Clone the repository
    ```bash
    git clone [https://github.com/EMMA019/Quantum-Simulator/.git](https://github.com/EMMA019/Quantum-Simulator/.git)
    cd Quantum-Simulator
    ```
2.  Setup Backend (Python)
    ```bash
    cd backend
    (Optional) Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate # On Windows use venv\Scripts\activate
    pip install -r requirements.txt
    Start the server at [http://127.0.0.1:8000](http://127.0.0.1:8000)
    uvicorn app:app --reload --reload-exclude "node_modules"
    ```
3.  Setup Frontend (React)
    Open a new terminal window.
    ```bash
    cd frontend
    npm install
    Start the development server (usually http://localhost:3000 or 3001)
    npm run dev
    ```
4.  Enjoy! Open your browser and navigate to the address shown in the frontend terminal (e.g., http://localhost:3000).

---

## 📄 License

Distributed under the MIT License. See LICENSE for more information.

---

## 🙌 Acknowledgments

* Thanks to the amazing capabilities of modern Large Language Models for making this rapid development possible.
* The Qiskit community for providing robust tools for quantum computing.
* The React Three Fiber team for making 3D in React accessible.
