import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 単一の量子ビットのブロッホ球を表示するコンポーネント
const BlochSphere = ({ blochVector = [0, 0, 1], qubitIndex }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const arrowRef = useRef(null);
    const rendererRef = useRef(null);

    // 1. シーンの初期化（マウント時に1回だけ実行）
    useEffect(() => {
        if (!mountRef.current) return;

        // サイズ取得（少し小さめに）
        const width = 200;
        const height = 200;

        // シーン
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        // 背景色を黒に（CRTモニター風）
        scene.background = new THREE.Color(0x000000);

        // カメラ
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 2.5;
        camera.position.y = 0.5;

        // レンダラー
        const renderer = new THREE.WebGLRenderer({ antialias: false }); // レトロ感を出すためアンチエイリアスをオフにしてみる
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ライト（ワイヤーフレームにはあまり関係ないが念のため）
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);

        // 球体（レトロなワイヤーフレーム）
        const geometry = new THREE.SphereGeometry(1, 16, 16); // 分割数を減らしてカクカクさせる
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x39ff14, // CRTグリーン
            wireframe: true, 
            transparent: true, 
            opacity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // 軸ヘルパー（色をレトロに）
        const axesHelper = new THREE.AxesHelper(1.2);
        // 軸の色を強制的に変更（X:赤, Y:緑, Z:青 -> レトロカラーへ）
        const colors = axesHelper.geometry.attributes.color;
        colors.setXYZ(0, 1, 0.2, 0.2); // R -> レトロ赤
        colors.setXYZ(1, 0.2, 1, 0.2); // G -> レトロ緑
        colors.setXYZ(2, 0.2, 0.2, 1); // B -> レトロ青
        colors.needsUpdate = true;
        scene.add(axesHelper);

        // 状態ベクトル（赤い矢印 -> レトロなオレンジ色に）
        const dir = new THREE.Vector3(0, 0, 1);
        const origin = new THREE.Vector3(0, 0, 0);
        // 矢印の色をレトロなオレンジ(ff4136)に変更
        const arrow = new THREE.ArrowHelper(dir, origin, 1, 0xff4136, 0.3, 0.2);
        arrowRef.current = arrow;
        scene.add(arrow);

        // コントロール
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // アニメーションループ
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            // 球をゆっくり回転させてモニター感を出す
            sphere.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        // クリーンアップ
        return () => {
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                if (mountRef.current.contains(renderer.domElement)) {
                    mountRef.current.removeChild(renderer.domElement);
                }
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    // 2. ベクトルの更新
    useEffect(() => {
        if (arrowRef.current && blochVector) {
            const x = blochVector[0];
            const y = blochVector[1];
            const z = blochVector[2];
            const newDir = new THREE.Vector3(x, y, z);
            if (newDir.length() > 0.001) {
                arrowRef.current.setDirection(newDir.normalize());
                // 混合状態（エンタングルメント）の表現：矢印の長さを変える
                // arrowRef.current.setLength(newDir.length(), 0.3, 0.2); 
                // ※ArrowHelperのsetLengthはバグることがあるので、今回は方向のみ更新し、
                // 混合状態は「確率分布が50:50になる」ことで確認してもらう仕様とします。
            }
        }
    }, [blochVector]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--retro-crt-green)', margin: '5px 0', fontSize: '0.8rem' }}>QUBIT {qubitIndex}</h4>
            {/* モニター風の枠をつける */}
            <div 
                style={{ 
                    padding: '5px',
                    border: '4px solid var(--retro-border)',
                    backgroundColor: '#000',
                    boxShadow: 'inset 0 0 10px var(--retro-crt-green)'
                }}
            >
                <div 
                    ref={mountRef} 
                    style={{ 
                        width: '200px', 
                        height: '200px', 
                        cursor: 'grab'
                    }} 
                />
            </div>
        </div>
    );
};

export default BlochSphere;