// Referencias a elementos del DOM
const canvas = document.getElementById('geometryCanvas');
const ctx = canvas.getContext('2d');
const shapeSelect = document.getElementById('shapeSelect');
const inputsContainer = document.getElementById('inputsContainer');
const resultValue = document.getElementById('resultValue');

let currentShape = 'sphere';

// 1. Escuchadores de eventos
shapeSelect.addEventListener('change', updateForm);

// Cambia los campos de entrada según la figura seleccionada
function updateForm() {
    currentShape = shapeSelect.value;
    inputsContainer.innerHTML = '';

    if (currentShape === 'sphere') {
        inputsContainer.innerHTML = `
            <div class="form-group">
                <label for="radio">Radio (r):</label>
                <input type="number" id="radio" value="5" min="0" step="any" oninput="calculateVolume()">
            </div>
        `;
    } else if (currentShape === 'cylinder' || currentShape === 'cone') {
        inputsContainer.innerHTML = `
            <div class="form-group">
                <label for="radio">Radio (r):</label>
                <input type="number" id="radio" value="5" min="0" step="any" oninput="calculateVolume()">
            </div>
            <div class="form-group">
                <label for="height">Altura (h):</label>
                <input type="number" id="height" value="10" min="0" step="any" oninput="calculateVolume()">
            </div>
        `;
    } else if (currentShape === 'cube') {
        inputsContainer.innerHTML = `
            <div class="form-group">
                <label for="side">Lado / Arista (a):</label>
                <input type="number" id="side" value="5" min="0" step="any" oninput="calculateVolume()">
            </div>
        `;
    }
    
    calculateVolume();
}

// 2. Cálculo del Volumen
function calculateVolume() {
    let volume = 0;

    if (currentShape === 'sphere') {
        const r = parseFloat(document.getElementById('radio')?.value) || 0;
        volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    } else if (currentShape === 'cylinder') {
        const r = parseFloat(document.getElementById('radio')?.value) || 0;
        const h = parseFloat(document.getElementById('height')?.value) || 0;
        volume = Math.PI * Math.pow(r, 2) * h;
    } else if (currentShape === 'cone') {
        const r = parseFloat(document.getElementById('radio')?.value) || 0;
        const h = parseFloat(document.getElementById('height')?.value) || 0;
        volume = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
    } else if (currentShape === 'cube') {
        const a = parseFloat(document.getElementById('side')?.value) || 0;
        volume = Math.pow(a, 3);
    }

    resultValue.innerText = `${volume.toFixed(2)} u³`;
    draw(); // Redibuja el gráfico al cambiar los datos
}

// 3. Renderizado de Gráficos 2D/3D en Canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.strokeStyle = '#E1BEE7'; // Lila claro
    ctx.fillStyle = '#5C1369';   // Violeta
    ctx.lineWidth = 2;

    if (currentShape === 'sphere') {
        // Esfera
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Ecuador en perspectiva
        ctx.beginPath();
        ctx.ellipse(cx, cy, 70, 25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#A155B9'; // Lila
        ctx.stroke();

    } else if (currentShape === 'cylinder') {
        // Cilindro
        const w = 100, h = 120;
        ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
        ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);

        // Tapas superior e inferior
        ctx.beginPath();
        ctx.ellipse(cx, cy - h / 2, w / 2, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#A155B9';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx, cy + h / 2, w / 2, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

    } else if (currentShape === 'cube') {
        // Cubo isométrica simple
        const size = 80;
        ctx.save();
        ctx.translate(cx, cy);

        // Cara frontal
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.strokeRect(-size / 2, -size / 2, size, size);

        // Cara trasera
        ctx.fillStyle = '#A155B9';
        ctx.strokeRect(-size / 4, -size / 4 - 20, size, size);

        // Conectores
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(-size / 4, -size / 4 - 20);
        ctx.moveTo(size / 2, -size / 2); ctx.lineTo(size / 4, -size / 4 - 20);
        ctx.moveTo(-size / 2, size / 2); ctx.lineTo(-size / 4, size / 4 - 20);
        ctx.moveTo(size / 2, size / 2); ctx.lineTo(size / 4, size / 4 - 20);
        ctx.stroke();

        ctx.restore();

    } else if (currentShape === 'cone') {
        // Cono
        const w = 120, h = 130;
        ctx.beginPath();
        ctx.moveTo(cx, cy - h / 2);
        ctx.lineTo(cx - w / 2, cy + h / 2);
        ctx.lineTo(cx + w / 2, cy + h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Base del cono
        ctx.beginPath();
        ctx.ellipse(cx, cy + h / 2, w / 2, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#A155B9';
        ctx.fill();
        ctx.stroke();
    }
}

// Inicialización por defecto al cargar el script
updateForm();