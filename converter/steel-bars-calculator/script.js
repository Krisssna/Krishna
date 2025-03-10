const DEFAULT_DENSITY = 7850; // kg/m³ default

// Button switching logic
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const type = this.getAttribute('data-type');
        document.querySelectorAll('.calc-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(type).classList.remove('hidden');

        updateMethod(type);
        setupInputs(type);
    });
});

// Setup input listeners
function setupInputs(type) {
    const inputs = document.querySelectorAll(`#${type} input`);
    inputs.forEach(input => {
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                calculate(type);
            }
        };
        input.oninput = () => {
            if (input.value === '' && input.id === `${type}-weight`) {
                clearCalculatedField(type, input.id);
            }
        };
    });
}

// Clear calculated field without affecting inputs
function clearCalculatedField(type, activeId) {
    const inputs = document.querySelectorAll(`#${type} input`);
    inputs.forEach(input => {
        if (input.id !== activeId && input.id !== `${type}-density`) {
            if (input.value && !input.dataset.userEntered) {
                input.value = '';
            }
        }
    });
}

// Mark user-entered fields
function markUserEntered(type) {
    const inputs = document.querySelectorAll(`#${type} input`);
    inputs.forEach(input => {
        if (input.value && input.id !== `${type}-density`) {
            input.dataset.userEntered = 'true';
        } else if (!input.value) {
            delete input.dataset.userEntered;
        }
    });
}

// Calculation logic
function calculate(type) {
    const density = parseFloat(document.getElementById(`${type}-density`).value) || DEFAULT_DENSITY;

    if (type === 'plain' || type === 'tmt') {
        const weight = parseFloat(document.getElementById(`${type}-weight`).value) || NaN;
        const diameter = parseFloat(document.getElementById(`${type}-diameter`).value) / 1000 || NaN;
        const length = parseFloat(document.getElementById(`${type}-length`).value) || NaN;

        if (!isNaN(diameter) && !isNaN(length)) {
            const calcWeight = density * Math.PI * (diameter / 2) ** 2 * length;
            document.getElementById(`${type}-weight`).value = calcWeight.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(length)) {
            const area = weight / (density * length);
            const calcDiameter = Math.sqrt((4 * area) / Math.PI) * 1000;
            document.getElementById(`${type}-diameter`).value = calcDiameter.toFixed(2);
        } else if (!isNaN(weight) && !isNaN(diameter)) {
            const calcLength = weight / (density * Math.PI * (diameter / 2) ** 2);
            document.getElementById(`${type}-length`).value = calcLength.toFixed(3);
        }
    } else if (type === 'square') {
        const weight = parseFloat(document.getElementById('square-weight').value) || NaN;
        const side = parseFloat(document.getElementById('square-side').value) / 1000 || NaN;
        const length = parseFloat(document.getElementById('square-length').value) || NaN;

        if (!isNaN(side) && !isNaN(length)) {
            const calcWeight = density * side ** 2 * length;
            document.getElementById('square-weight').value = calcWeight.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(length)) {
            const calcSide = Math.sqrt(weight / (density * length)) * 1000;
            document.getElementById('square-side').value = calcSide.toFixed(2);
        } else if (!isNaN(weight) && !isNaN(side)) {
            const calcLength = weight / (density * side ** 2);
            document.getElementById('square-length').value = calcLength.toFixed(3);
        }
    } else if (type === 'gi-sheet') {
        const weight = parseFloat(document.getElementById('gi-sheet-weight').value) || NaN;
        const length = parseFloat(document.getElementById('gi-sheet-length').value) || NaN;
        const width = parseFloat(document.getElementById('gi-sheet-width').value) || NaN;
        const thickness = parseFloat(document.getElementById('gi-sheet-thickness').value) / 1000 || NaN;

        if (!isNaN(length) && !isNaN(width) && !isNaN(thickness)) {
            const calcWeight = density * length * width * thickness;
            document.getElementById('gi-sheet-weight').value = calcWeight.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(width) && !isNaN(thickness)) {
            const calcLength = weight / (density * width * thickness);
            document.getElementById('gi-sheet-length').value = calcLength.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(thickness)) {
            const calcWidth = weight / (density * length * thickness);
            document.getElementById('gi-sheet-width').value = calcWidth.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(width)) {
            const calcThickness = weight / (density * length * width) * 1000;
            document.getElementById('gi-sheet-thickness').value = calcThickness.toFixed(3);
        }
    } else if (type === 'gi-rect-pipe-1' || type === 'gi-rect-pipe-2' || type === 'iron-rect-pipe-1' || type === 'iron-rect-pipe-2') {
        const weight = parseFloat(document.getElementById(`${type}-weight`).value) || NaN;
        const length = parseFloat(document.getElementById(`${type}-length`).value) || NaN;
        const width = parseFloat(document.getElementById(`${type}-width`).value) / 1000 || NaN;
        const height = parseFloat(document.getElementById(`${type}-height`).value) / 1000 || NaN;
        const thickness = parseFloat(document.getElementById(`${type}-thickness`).value) / 1000 || NaN;

        const area = 2 * (width + height) * thickness - 4 * thickness ** 2;
        if (!isNaN(length) && !isNaN(width) && !isNaN(height) && !isNaN(thickness)) {
            const calcWeight = density * length * area;
            document.getElementById(`${type}-weight`).value = calcWeight.toFixed(3);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(height) && !isNaN(thickness)) {
            const calcWidth = (weight / (density * length * thickness) + 4 * thickness - 2 * height) / 2 * 1000;
            document.getElementById(`${type}-width`).value = calcWidth.toFixed(2);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(width) && !isNaN(thickness)) {
            const calcHeight = (weight / (density * length * thickness) + 4 * thickness - 2 * width) / 2 * 1000;
            document.getElementById(`${type}-height`).value = calcHeight.toFixed(2);
        }
    }
    markUserEntered(type);
}

// Update calculation method
function updateMethod(type) {
    const methodText = document.getElementById('method-text');
    if (type === 'plain' || type === 'tmt') {
        methodText.innerHTML = 'Weight = Density × π × (Diameter/2)² × Length<br>' +
            'Diameter = √(4 × Weight / (Density × π × Length)) × 1000<br>' +
            'Length = Weight / (Density × π × (Diameter/2)²)<br>' +
            'Density = User-defined or 7850 kg/m³';
    } else if (type === 'square') {
        methodText.innerHTML = 'Weight = Density × Side² × Length<br>' +
            'Side = √(Weight / (Density × Length)) × 1000<br>' +
            'Length = Weight / (Density × Side²)<br>' +
            'Density = User-defined or 7850 kg/m³';
    } else if (type === 'gi-sheet') {
        methodText.innerHTML = 'Weight = Density × Length × Width × Thickness<br>' +
            'Thickness = Weight / (Density × Length × Width) × 1000<br>' +
            'Width = Weight / (Density × Length × Thickness)<br>' +
            'Length = Weight / (Density × Width × Thickness)<br>' +
            'Density = User-defined or 7850 kg/m³';
    } else if (type === 'gi-rect-pipe-1' || type === 'gi-rect-pipe-2' || type === 'iron-rect-pipe-1' || type === 'iron-rect-pipe-2') {
        methodText.innerHTML = 'Weight = Density × Length × [2 × (Width + Height) × Thickness - 4 × Thickness²]<br>' +
            'Width = [Weight / (Density × Length × Thickness) + 4 × Thickness - 2 × Height] / 2 × 1000<br>' +
            'Height = [Weight / (Density × Length × Thickness) + 4 × Thickness - 2 × Width] / 2 × 1000<br>' +
            'Density = User-defined or 7850 kg/m³';
    }
}

// Initialize
setupInputs('plain');
updateMethod('plain');
