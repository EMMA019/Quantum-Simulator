import numpy as np
import qiskit
from qiskit_aer import Aer
from qiskit.quantum_info import Statevector, partial_trace
from qiskit.quantum_info.operators import Pauli
import math

class QuantumSimulator:
    def __init__(self, num_qubits):
        if not (1 <= num_qubits <= 8):
            raise ValueError("Number of qubits must be between 1 and 8.")
        self.num_qubits = num_qubits
        # Qiskit Aerのシミュレータを使用
        self.simulator = Aer.get_backend('statevector_simulator') 
        self.circuit = None

    def build_circuit(self, operations):
        """
        Builds the Qiskit circuit based on a list of operations.
        Supported gates: H, X, Y, Z, CNOT, RX, RY, RZ
        """
        circuit = qiskit.QuantumCircuit(self.num_qubits) 
        
        for op in operations:
            op_type = op.get('type')
            target = op.get('target')
            control = op.get('control')
            angle = op.get('angle', 0) 

            if op_type == 'H':
                if target is not None: circuit.h(target)
            elif op_type == 'X':
                if target is not None: circuit.x(target)
            # --- ↓↓↓ 追加: YゲートとZゲートのサポート ↓↓↓ ---
            elif op_type == 'Y':
                if target is not None: circuit.y(target)
            elif op_type == 'Z':
                if target is not None: circuit.z(target)
            # --- ↑↑↑ ここまで ↑↑↑ ---
            elif op_type == 'CNOT':
                if control is not None and target is not None: circuit.cx(control, target)
            elif op_type == 'RX': 
                if target is not None: circuit.rx(angle, target)
            elif op_type.startswith('Rx'): 
                 if target is not None: circuit.rx(angle, target)
            elif op_type == 'RY':
                if target is not None: circuit.ry(angle, target)
            elif op_type.startswith('Ry'):
                 if target is not None: circuit.ry(angle, target)
            elif op_type == 'RZ':
                if target is not None: circuit.rz(angle, target)
            elif op_type.startswith('Rz'):
                 if target is not None: circuit.rz(angle, target)
                
        self.circuit = circuit
        return self.circuit

    def simulate(self, circuit):
        """
        Simulates the given Qiskit circuit and returns the state vector.
        """
        from qiskit import transpile
        new_circuit = transpile(circuit, self.simulator)
        job = self.simulator.run(new_circuit)
        
        result = job.result()
        state_vector = result.get_statevector(circuit)
        return state_vector

    def get_probabilities(self, state_vector):
        """
        Calculates measurement probabilities.
        Reverses the bit string labels to match the frontend UI order (Q0 on left).
        """
        probabilities = np.abs(state_vector.data)**2
        num_states = 2**self.num_qubits
        
        # UIの並び順(Q0...Qn)に合わせてビット列を反転([::-1])
        labels = [format(i, '0' + str(self.num_qubits) + 'b')[::-1] for i in range(num_states)]
        
        return {label: prob for label, prob in zip(labels, probabilities.tolist())}

    def _get_bloch_vector_from_density_matrix(self, density_matrix_data):
        sx = Pauli('X').to_matrix()
        sy = Pauli('Y').to_matrix()
        sz = Pauli('Z').to_matrix()
        dm = np.array(density_matrix_data)
        x = np.trace(np.dot(dm, sx)).real
        y = np.trace(np.dot(dm, sy)).real
        z = np.trace(np.dot(dm, sz)).real
        return [x, y, z]

    def get_bloch_sphere_coordinates(self, state_vector, qubit_index):
        if self.num_qubits == 1:
            dm = state_vector.to_density_matrix()
        else:
            trace_out_qubits = [i for i in range(self.num_qubits) if i != qubit_index]
            dm = partial_trace(state_vector, trace_out_qubits)
        return self._get_bloch_vector_from_density_matrix(dm.data)