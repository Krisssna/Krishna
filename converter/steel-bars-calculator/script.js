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
        const unitSpan = input.nextElementSibling;
        
        // Update unit position on input
        input.oninput = () => {
            updateUnitPosition(input, unitSpan);
            if (input.value === '' && input.id === `${type}-weight`) {
                clearCalculatedField(type, input.id);
            }
        };

        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                calculate(type);
            }
        };

        // Initial position update
        updateUnitPosition(input, unitSpan);
    });
}

// Update unit position dynamically
function updateUnitPosition(input, unitSpan) {
    if (input.value === '') {
        unitSpan.style.display = 'none'; // Hide unit when input is empty
    } else {
        unitSpan.style.display = 'inline'; // Show unit when value is present
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = getComputedStyle(input).font; // Match input font
        const textWidth = context.measureText(input.value).width;
        unitSpan.style.left = `${textWidth + 15}px`; // Position after value
    }
}

// Clear calculated field without affecting inputs
function clearCalculatedField(type, activeId) {
    const inputs = document.querySelectorAll(`#${type} input`);
    inputs.forEach(input => {
        if (input.id !== activeId && input.id !== `${type}-density`) {
            if (input.value && !input.dataset.userEntered) {
                input.value = '';
                updateUnitPosition(input, input.nextElementSibling);
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
        updateUnitPosition(input, input.nextElementSibling);
    });
}

// Calculation logic
function calculate(type) {
    const densityInput = document.getElementById(`${type}-density`);
    const density = parseFloat(densityInput.value) || DEFAULT_DENSITY;

    if (type === 'plain' || type === 'tmt') {
        const weightInput = document.getElementById(`${type}-weight`);
        const diameterInput = document.getElementById(`${type}-diameter`);
        const lengthInput = document.getElementById(`${type}-length`);

        const weight = parseFloat(weightInput.value) || NaN;
        const diameter = parseFloat(diameterInput.value) / 1000 || NaN;
        const length = parseFloat(lengthInput.value) || NaN;

        if (!isNaN(diameter) && !isNaN(length)) {
            const calcWeight = density * Math.PI * (diameter / 2) ** 2 * length;
            weightInput.value = calcWeight.toFixed(3);
            updateUnitPosition(weightInput, weightInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length)) {
            const area = weight / (density * length);
            const calcDiameter = Math.sqrt((4 * area) / Math.PI) * 1000;
            diameterInput.value = calcDiameter.toFixed(2);
            updateUnitPosition(diameterInput, diameterInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(diameter)) {
            const calcLength = weight / (density * Math.PI * (diameter / 2) ** 2);
            lengthInput.value = calcLength.toFixed(3);
            updateUnitPosition(lengthInput, lengthInput.nextElementSibling);
        }
    } else if (type === 'square') {
        const weightInput = document.getElementById('square-weight');
        const sideInput = document.getElementById('square-side');
        const lengthInput = document.getElementById('square-length');

        const weight = parseFloat(weightInput.value) || NaN;
        const side = parseFloat(sideInput.value) / 1000 || NaN;
        const length = parseFloat(lengthInput.value) || NaN;

        if (!isNaN(side) && !isNaN(length)) {
            const calcWeight = density * side ** 2 * length;
            weightInput.value = calcWeight.toFixed(3);
            updateUnitPosition(weightInput, weightInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length)) {
            const calcSide = Math.sqrt(weight / (density * length)) * 1000;
            sideInput.value = calcSide.toFixed(2);
            updateUnitPosition(sideInput, sideInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(side)) {
            const calcLength = weight / (density * side ** 2);
            lengthInput.value = calcLength.toFixed(3);
            updateUnitPosition(lengthInput, lengthInput.nextElementSibling);
        }
    } else if (type === 'gi-sheet') {
        const weightInput = document.getElementById('gi-sheet-weight');
        const lengthInput = document.getElementById('gi-sheet-length');
        const widthInput = document.getElementById('gi-sheet-width');
        const thicknessInput = document.getElementById('gi-sheet-thickness');

        const weight = parseFloat(weightInput.value) || NaN;
        const length = parseFloat(lengthInput.value) || NaN;
        const width = parseFloat(widthInput.value) || NaN;
        const thickness = parseFloat(thicknessInput.value) / 1000 || NaN;

        if (!isNaN(length) && !isNaN(width) && !isNaN(thickness)) {
            const calcWeight = density * length * width * thickness;
            weightInput.value = calcWeight.toFixed(3);
            updateUnitPosition(weightInput, weightInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(width) && !isNaN(thickness)) {
            const calcLength = weight / (density * width * thickness);
            lengthInput.value = calcLength.toFixed(3);
            updateUnitPosition(lengthInput, lengthInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(thickness)) {
            const calcWidth = weight / (density * length * thickness);
            widthInput.value = calcWidth.toFixed(3);
            updateUnitPosition(widthInput, widthInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(width)) {
            const calcThickness = weight / (density * length * width) * 1000;
            thicknessInput.value = calcThickness.toFixed(3);
            updateUnitPosition(thicknessInput, thicknessInput.nextElementSibling);
        }
    } else if (type === 'gi-rect-pipe' || type === 'iron-rect-pipe') {
        const weightInput = document.getElementById(`${type}-weight`);
        const lengthInput = document.getElementById(`${type}-length`);
        const widthInput = document.getElementById(`${type}-width`);
        const heightInput = document.getElementById(`${type}-height`);
        const thicknessInput = document.getElementById(`${type}-thickness`);

        const weight = parseFloat(weightInput.value) || NaN;
        const length = parseFloat(lengthInput.value) || NaN;
        const width = parseFloat(widthInput.value) / 1000 || NaN;
        const height = parseFloat(heightInput.value) / 1000 || NaN;
        const thickness = parseFloat(thicknessInput.value) / 1000 || NaN;

        const area = 2 * (width + height) * thickness - 4 * thickness ** 2;
        if (!isNaN(length) && !isNaN(width) && !isNaN(height) && !isNaN(thickness)) {
            const calcWeight = density * length * area;
            weightInput.value = calcWeight.toFixed(3);
            updateUnitPosition(weightInput, weightInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(height) && !isNaN(thickness)) {
            const calcWidth = (weight / (density * length * thickness) + 4 * thickness - 2 * height) / 2 * 1000;
            widthInput.value = calcWidth.toFixed(2);
            updateUnitPosition(widthInput, widthInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length) && !isNaN(width) && !isNaN(thickness)) {
            const calcHeight = (weight / (density * length * thickness) + 4 * thickness - 2 * width) / 2 * 1000;
            heightInput.value = calcHeight.toFixed(2);
            updateUnitPosition(heightInput, heightInput.nextElementSibling);
        }
    } else if (type === 'gi-round-pipe' || type === 'iron-round-pipe') {
        const weightInput = document.getElementById(`${type}-weight`);
        const lengthInput = document.getElementById(`${type}-length`);
        const outerDiameterInput = document.getElementById(`${type}-outer-diameter`);
        const thicknessInput = document.getElementById(`${type}-thickness`);

        const weight = parseFloat(weightInput.value) || NaN;
        const length = parseFloat(lengthInput.value) || NaN;
        const outerDiameter = parseFloat(outerDiameterInput.value) / 1000 || NaN;
        const thickness = parseFloat(thicknessInput.value) / 1000 || NaN;

        const innerDiameter = outerDiameter - 2 * thickness;
        const area = Math.PI * (outerDiameter ** 2 - innerDiameter ** 2) / 4;

        if (!isNaN(length) && !isNaN(outerDiameter)) {
            const calcWeight = density * length * area;
            weightInput.value = calcWeight.toFixed(3);
            updateUnitPosition(weightInput, weightInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(length)) {
            const calcOuterDiameter = Math.sqrt((4 * weight) / (density * length * Math.PI) + innerDiameter ** 2) * 1000;
            outerDiameterInput.value = calcOuterDiameter.toFixed(2);
            updateUnitPosition(outerDiameterInput, outerDiameterInput.nextElementSibling);
        } else if (!isNaN(weight) && !isNaN(outerDiameter)) {
            const calcLength = weight / (density * area);
            lengthInput.value = calcLength.toFixed(3);
            updateUnitPosition(lengthInput, lengthInput.nextElementSibling);
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
    } else if (type === 'gi-rect-pipe' || type === 'iron-rect-pipe') {
        methodText.innerHTML = 'Weight = Density × Length × [2 × (Width + Height) × Thickness - 4 × Thickness²]<br>' +
            'Width = [Weight / (Density × Length × Thickness) + 4 × Thickness - 2 × Height] / 2 × 1000<br>' +
            'Height = [Weight / (Density × Length × Thickness) + 4 × Thickness - 2 × Width] / 2 × 1000<br>' +
            'Density = User-defined or 7850 kg/m³';
    } else if (type === 'gi-round-pipe' || type === 'iron-round-pipe') {
        methodText.innerHTML = 'Weight = Density × Length × [π × (Outer Diameter² - Inner Diameter²) / 4]<br>' +
            'Outer Diameter = √[(4 × Weight) / (Density × Length × π) + Inner Diameter²] × 1000<br>' +
            'Length = Weight / (Density × [π × (Outer Diameter² - Inner Diameter²) / 4])<br>' +
            'Inner Diameter = Outer Diameter - 2 × Thickness<br>' +
            'Density = User-defined or 7850 kg/m³';
    }
}

// Initialize
setupInputs('plain');
updateMethod('plain');

// Add Calculate button listeners
document.querySelectorAll('.calculate-btn').forEach(button => {
    button.addEventListener('click', function () {
        const type = this.closest('.calc-section').id;
        calculate(type);
    });
});
