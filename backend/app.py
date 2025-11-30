from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import numpy as np
from quantum_simulator import QuantumSimulator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Numpy型をJSONで送れる型に変換するヘルパー関数
def convert_to_serializable(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, complex):
        return [float(obj.real), float(obj.imag)]
    return obj

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    simulator = None
    print(f"WebSocket connected: {websocket.client.host}")

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            num_qubits = message.get("numQubits", 2)
            operations = message.get("operations", [])

            if simulator is None or simulator.num_qubits != num_qubits:
                simulator = QuantumSimulator(num_qubits)
                print(f"Initialized QuantumSimulator with {num_qubits} qubits.")

            # 計算実行
            circuit = simulator.build_circuit(operations)
            state_vector = simulator.simulate(circuit)
            probabilities = simulator.get_probabilities(state_vector)

            # ブロッホ球座標の計算と型変換
            bloch_vectors = []
            for i in range(num_qubits):
                raw_vector = simulator.get_bloch_sphere_coordinates(state_vector, i)
                # NumpyのfloatをPythonのfloatに変換
                bloch_vectors.append([float(x) for x in raw_vector])
            
            # 状態ベクトルの型変換 (複素数対策)
            state_list = []
            state_data = state_vector.data if hasattr(state_vector, 'data') else state_vector
            for val in state_data:
                state_list.append([float(val.real), float(val.imag)])

            # 確率分布のキーや値も念のため変換確認（通常はtolistで大丈夫だが念のため）
            clean_probabilities = {k: float(v) for k, v in probabilities.items()}

            response_data = {
                "probabilities": clean_probabilities,
                "blochVectors": bloch_vectors,
                "numQubits": num_qubits,
                "stateVector": state_list 
            }
            
            await websocket.send_json(response_data)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {websocket.client.host}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        # エラーメッセージ送信
        await websocket.send_json({"error": str(e)})