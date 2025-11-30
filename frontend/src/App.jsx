import React, { useState, useEffect, useCallback, useRef } from 'react';
import CircuitBuilder from './components/CircuitBuilder';
import BlochSphere from './components/BlochSphere';
import './styles/App.css';

function App() {
    const [numQubits, setNumQubits] = useState(2);
    const [circuitGates, setCircuitGates] = useState([]);
    const [simulationResults, setSimulationResults] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [wsMessages, setWsMessages] = useState([]);
    const wsRef = useRef(null);

    // WebSocket接続 (127.0.0.1 を使用)
    useEffect(() => {
        const connectWebSocket = () => {
            // ここで 127.0.0.1 を指定
            const ws = new WebSocket("ws://127.0.0.1:8000/ws");
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected.");
                setIsConnected(true);
                setWsMessages(prev => [...prev, "SYSTEM ONLINE. CONNECTED TO QUANTUM CORE."]); // メッセージもレトロに
                // 接続時に現在の状態を送信
                sendCircuitToBackend(numQubits, circuitGates);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.error) {
                        console.error("Backend error:", data.error);
                        setWsMessages(prev => [...prev, `ERROR: ${data.error}`]);
                    } else {
                        setSimulationResults(data);
                    }
                } catch (e) {
                    console.error("Parse error:", e);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected.");
                setIsConnected(false);
                setWsMessages(prev => [...prev, "CONNECTION LOST."]);
                // 再接続試行（必要なら）
                // setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws.close();
            };
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // データ送信関数
    const sendCircuitToBackend = useCallback((currentNumQubits, currentGates) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // バックエンドが期待する形式に変換
            const operations = currentGates.map(g => {
                const op = { type: g.type };
                
                if (g.type === 'CNOT') {
                    op.control = g.qubitIndex;
                    op.target = (g.qubitIndex + 1) % currentNumQubits; 
                } else {
                    op.target = g.qubitIndex;
                }
                
                if (g.type.startsWith('R')) {
                    op.angle = Math.PI / 2;
                }
                
                return op;
            });

            const message = {
                numQubits: currentNumQubits,
                operations: operations
            };
            
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    // 回路や量子ビット数が変わったら送信
    useEffect(() => {
        if (isConnected) {
            sendCircuitToBackend(numQubits, circuitGates);
        }
    }, [numQubits, circuitGates, isConnected, sendCircuitToBackend]);

    // ゲート更新用ハンドラ
    const updateCircuitGate = (newGate) => {
        setCircuitGates(prev => {
            // 同じ場所にゲートがあれば上書き、なければ追加
            const exists = prev.findIndex(g => g.qubitIndex === newGate.qubitIndex && g.timeStep === newGate.timeStep);
            if (exists >= 0) {
                const next = [...prev];
                next[exists] = newGate;
                return next;
            }
            return [...prev, newGate];
        });
    };

    const removeCircuitGate = (qubitIndex, timeStep) => {
        setCircuitGates(prev => prev.filter(g => !(g.qubitIndex === qubitIndex && g.timeStep === timeStep)));
    };

    // ↓↓↓ 追加: RESET機能 ↓↓↓
    const handleReset = () => {
        setNumQubits(2); // Qubitsを初期値(2)に戻す
        setCircuitGates([]); // 回路を空にする
        setSimulationResults(null); // 結果をクリア
        setWsMessages(prev => [...prev, "CIRCUIT CLEARED."]);
        
        // バックエンドに空の回路を送信し、状態をクリアさせる
        if (isConnected) {
            sendCircuitToBackend(2, []);
        }
    };
    // ↑↑↑ ここまで追加 ↑↑↑


    // JSXの構造を変更
    return (
        <div className="App">
            {/* ヘッダー */}
            <header className="App-header">
                <h1>QUANTUM SIMULATOR</h1>
                <div className="status-indicator" style={{ color: isConnected ? 'var(--retro-crt-green)' : 'var(--retro-accent-red)' }}>
                    [{isConnected ? "ONLINE" : "OFFLINE"}]
                </div>
            </header>

            {/* メインコンテンツ（2カラム） */}
            <div className="main-content">
                {/* 左カラム：操作盤 */}
                <div className="editor-section retro-panel">
                     <div className="controls-panel">
                        <div className="qubit-config">
                            <label>QUBITS: </label>
                            <input 
                                type="number" 
                                min="1" max="5" 
                                value={numQubits} 
                                onChange={(e) => setNumQubits(parseInt(e.target.value))}
                            />
                        </div>
                         {/* ↓↓↓ RESETボタンの配置 ↓↓↓ */}
                        <button 
                            onClick={handleReset} 
                            style={{
                                padding: '10px 15px',
                                backgroundColor: 'var(--retro-accent-red)',
                                color: 'var(--retro-text)',
                                border: '4px outset var(--retro-accent-red)',
                                fontFamily: 'inherit',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            RESET
                        </button>
                        {/* ↑↑↑ RESETボタンの配置 ↑↑↑ */}
                    </div>
                    <CircuitBuilder 
                        numQubits={numQubits}
                        maxTimeSteps={8}
                        circuitGates={circuitGates}
                        updateCircuitGate={updateCircuitGate}
                        removeCircuitGate={removeCircuitGate}
                    />
                </div>

                {/* 右カラム：モニター */}
                <div className="visualization-section retro-panel">
                    {/* ブロッホ球表示 */}
                    <div className="bloch-container">
                        {Array.from({ length: numQubits }).map((_, i) => (
                            <BlochSphere 
                                key={i}
                                qubitIndex={i}
                                blochVector={simulationResults?.blochVectors?.[i] || [0, 0, 1]}
                            />
                        ))}
                    </div>
                    
                    {/* 確率分布表示 */}
                    <div className="probabilities">
                        <h3>PROBABILITIES</h3>
                        {simulationResults?.probabilities && Object.entries(simulationResults.probabilities).map(([state, prob]) => (
                            <div key={state} className="prob-bar-wrapper">
                                <span>|{state}⟩</span>
                                <div className="prob-bar-container">
                                    <div 
                                        className="prob-bar" 
                                        style={{ width: `${prob * 100}%` }}
                                    ></div>
                                </div>
                                <span>{(prob * 100).toFixed(0)}%</span> {/* パーセントは整数で表示 */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* フッター：ログウィンドウ */}
            <div className="logs">
                > {wsMessages[wsMessages.length - 1] || "INITIALIZING..."}
            </div>
        </div>
    );
}

export default App;