import React, { useState, useCallback } from 'react';

// スタイル定義（SFC風）
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    palette: {
        display: 'flex',
        gap: '10px',
        padding: '10px',
        border: '4px solid var(--retro-border)',
        backgroundColor: '#000', // パレットは黒背景
        flexWrap: 'wrap',
    },
    gateButton: (type) => {
        // ゲートタイプによって色を変える（SFCボタンカラー）
        let bgColor = 'var(--retro-border)';
        let textColor = '#000';
        if (['H', 'X', 'Y', 'Z'].includes(type)) bgColor = 'var(--retro-accent-blue)';
        if (type === 'CNOT') bgColor = 'var(--retro-accent-red)';
        if (type.startsWith('R')) bgColor = 'var(--retro-accent-yellow)';

        return {
            padding: '5px 10px',
            backgroundColor: bgColor,
            color: textColor,
            border: '4px outset ' + bgColor, // 立体的なドット絵ボタン風
            cursor: 'grab',
            fontFamily: 'inherit',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textShadow: '1px 1px rgba(255,255,255,0.3)',
            active: {
                border: '4px inset ' + bgColor,
            }
        };
    },
    circuitArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '10px',
        border: '4px solid var(--retro-border)',
        backgroundColor: '#000', // 回路エリアも黒背景
        overflowX: 'auto',
    },
    qubitLine: {
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        borderBottom: '2px dashed var(--retro-border)', // 点線で配線を表現
    },
    qubitLabel: {
        width: '50px',
        fontWeight: 'bold',
        color: 'var(--retro-crt-green)',
    },
    dropZone: {
        width: '40px',
        height: '40px',
        border: '2px dotted var(--retro-border)',
        margin: '0 2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    placedGate: (type) => {
        const baseStyle = styles.gateButton(type);
        return {
            ...baseStyle,
            padding: '2px 5px',
            fontSize: '0.7rem',
            border: '2px solid #000', // 配置後は平面的なドット絵風
            boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            cursor: 'pointer',
        }
    }
};

// ゲートの種類定義
const gateTypes = ['H', 'X', 'Y', 'Z', 'CNOT', 'Rx', 'Ry', 'Rz'];

const CircuitBuilder = ({ numQubits, maxTimeSteps, circuitGates, updateCircuitGate, removeCircuitGate }) => {
    const [draggedGate, setDraggedGate] = useState(null);

    // ドラッグ開始
    const handleDragStart = (gateType) => {
        setDraggedGate(gateType);
    };

    // ドロップ（配置）
    const handleDrop = (qubitIndex, timeStep) => {
        if (draggedGate) {
            updateCircuitGate({ type: draggedGate, qubitIndex, timeStep });
            setDraggedGate(null);
        }
    };

    // ゲートクリック（削除）
    const handleGateClick = (qubitIndex, timeStep) => {
        removeCircuitGate(qubitIndex, timeStep);
    };

    return (
        <div style={styles.container}>
            {/* ゲートパレット */}
            <div style={styles.palette}>
                {gateTypes.map(gate => (
                    <div
                        key={gate}
                        draggable
                        onDragStart={() => handleDragStart(gate)}
                        style={styles.gateButton(gate)}
                    >
                        {gate}
                    </div>
                ))}
            </div>

            {/* 回路エリア */}
            <div style={styles.circuitArea}>
                {Array.from({ length: numQubits }).map((_, qubitIndex) => (
                    <div key={qubitIndex} style={styles.qubitLine}>
                        <div style={styles.qubitLabel}>Q{qubitIndex}</div>
                        {Array.from({ length: maxTimeSteps }).map((_, timeStep) => {
                            // この位置にあるゲートを探す
                            const gate = circuitGates.find(g => g.qubitIndex === qubitIndex && g.timeStep === timeStep);
                            return (
                                <div
                                    key={timeStep}
                                    onDragOver={(e) => e.preventDefault()} // ドロップ許可
                                    onDrop={() => handleDrop(qubitIndex, timeStep)}
                                    style={styles.dropZone}
                                >
                                    {gate && (
                                        <div 
                                            onClick={() => handleGateClick(qubitIndex, timeStep)}
                                            style={styles.placedGate(gate.type)}
                                        >
                                            {gate.type}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CircuitBuilder;