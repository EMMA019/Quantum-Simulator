⚛️ QuantaSim-RT
Real-time Quantum Circuit Simulator & 3D Visualizer

Experience the strange world of quantum mechanics directly in your browser, visualized in real-time.
<img width="2969" height="1413" alt="image" src="https://github.com/user-attachments/assets/23b53499-0cd1-4a7d-8bcd-663e1ae63be6" />
<img width="2975" height="1479" alt="image" src="https://github.com/user-attachments/assets/1c76c2c7-e643-4c61-86b0-766a50650137" />

📖 About The Project
QuantaSim-RT is a full-stack web application that allows users to build and simulate small-scale quantum circuits interactively.

Unlike simple simulators, this project uses a robust Python backend powered by Qiskit Aer to perform physically accurate quantum state calculations, including the handling of mixed states resulting from entanglement (using reduced density matrices). The results are streamed instantly via WebSockets to a modern React frontend, where they are visualized on interactive 3D Bloch spheres using Three.js.

Key Features
✨ Instant Feedback: Circuit changes are calculated and visualized in real-time thanks to WebSocket communication.

🧠 Physically Accurate: Correctly handles quantum entanglement and calculates reduced density matrices for accurate Bloch sphere representation of mixed states.

🧊 3D Visualization: Interactive 3D Bloch spheres powered by Three.js (@react-three/fiber).

🛠️ Modern Stack: Built with FastAPI (Python) and Vite + React (TypeScript/JavaScript).

<br />

🤖 The "AI-Powered" Development Story
This project is a showcase of modern AI-assisted software engineering.

It was conceived as a rapid prototyping experiment to answer the question: "How complex of a scientific tool can a single engineer build in one hour by effectively orchestrating cutting-edge LLMs?"

The development process was a highly collaborative effort between human direction and AI execution:

Architecture & Prompt Engineering: Human Lead

Core Logic Generation: AI Assistant (Grok model)

Refactoring, Debugging & Integration: AI Assistant (Gemini model)

By leveraging AI for heavy lifting in coding and immediate debugging, we achieved a development speed estimated to be 20-30x faster than traditional solo development for a project of this complexity.

<br />

⚙️ Built With
Backend:

Python

FastAPI (Web Framework & WebSockets)

Uvicorn (ASGI Server)

Qiskit & Qiskit Aer (Quantum Computing SDK)

NumPy

Frontend:

React

Vite (Build Tool)

Three.js & @react-three/fiber (3D Graphics)

<br />

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Python 3.10 or higher

Node.js (LTS version recommended)

Installation
Clone the repository

Bash

git clone https://github.com/EMMA019/Quantum-Simulator/.git
cd Quantum-Simulator
Setup Backend (Python)

Bash

cd backend
# (Optional) Create and activate a virtual environment
# python -m venv venv
# source venv/bin/activate  # On Windows use `venv\Scripts\activate`

pip install -r requirements.txt
# Start the server at http://127.0.0.1:8000
uvicorn app:app --reload --reload-exclude "node_modules"
Setup Frontend (React) Open a new terminal window.

Bash

cd frontend
npm install
# Start the development server (usually http://localhost:3000 or 3001)
npm run dev
Enjoy! Open your browser and navigate to the address shown in the frontend terminal (e.g., http://localhost:3000).

<br />

📄 License
Distributed under the MIT License. See LICENSE for more information.

<br />

🙌 Acknowledgments
Thanks to the amazing capabilities of modern Large Language Models for making this rapid development possible.

The Qiskit community for providing robust tools for quantum computing.

The React Three Fiber team for making 3D in React accessible.
