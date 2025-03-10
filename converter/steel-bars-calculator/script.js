const densitySteel = 7850; // kg/m³
const densityGI = 7850; // kg/m³ (assuming galvanized iron similar to steel)

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const type = button.getAttribute('data-type');
        document.querySelectorAll('.calc-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(type).classList.remove('hidden');

        updateMethod(type);
        setupInputs(type);
    });
});

function setupInputs(type) {
    const inputs = document.querySelectorAll(`#${type} input`);
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculate(type);
            }
        });
        input.addEventListener('input', () => clearOtherInputs(type, input.id));
    });
}

function clearOtherInputs(type, activeId) {
    const inputs = document.querySelectorAll(`#${type} input`);
    let filledCount = 0;
    inputs.forEach(input => {
        if (input.value && input.id !== activeId) filledCount++;
    });
    if (filledCount >= 2) {
        inputs.forEach(input => {
            if (input.id !== activeId && !input.value) input.value = '';
        });
    }
}

function calculate(type) {
    if (type === 'plain' || type === 'tmt') {
        const weight = parseFloat(document.getElementById(`${type}-weight`).value);
        const diameter = parseFloat(document.getElementById(`${type}-diameter`).value) / 1000; // mm to m
        const length = parseFloat(document.getElementById(`${type}-length`).value);

        if (weight && diameter) {
            const calcLength = weight / (densitySteel * Math.PI * Math.pow(diameter / 2, 2));
            document.getElementById(`${type}-length`).value = calcLength.toFixed(3);
        } else if (weight && length) {
            const area = weight / (densitySteel * length);
            const calcDiameter = Math.sqrt((4 * area) / Math.PI) * 1000; // m to mm
            document.getElementById(`${type}-diameter`).value = calcDiameter.toFixed(2);
        } else if (diameter && length) {
            const calcWeight = densitySteel * Math.PI * Math.pow(diameter / 2, 2) * length;
            document.getElementById(`${type}-weight`).value = calcWeight.toFixed(3);
        }
    } else if (type === 'square') {
        const weight = parseFloat(document.getElementById('square-weight').value);
        const side = parseFloat(document.getElementById('square-side').value) / 1000; // mm to m
        const length = parseFloat(document.getElementById('square-length').value);

        if (weight && side) {
            const calcLength = weight / (densitySteel * Math.pow(side, 2));
            document.getElementById('square-length').value = calcLength.toFixed(3);
        } else if (weight && length) {
            const area = weight / (densitySteel * length);
            const calcSide = Math.sqrt(area) * 1000; // m to mm
            document.getElementById('square-side`).value = calcSide.toFixed(2);
        } else if (side && length) {
            const calcWeight = densitySteel * Math.pow(side, 2) * length;
            document.getElementById('square-weight').value = calcWeight.toFixed(3);
        }
    } else if (type === 'gi') {
        const weight = parseFloat(document.getElementById('gi-weight').value);
        const length = parseFloat(document.getElementById('gi-length').value);
        const width = parseFloat(document.getElementById('gi-width').value);

        if (weight && length) {
            const calcWidth = weight / (densitySteel * length * 0.001); // assuming 1mm thickness
            document.getElementById('gi-width').value = calcWidth.toFixed(3);
        } else if (weight && width) {
            const calcLength = weight / (densitySteel * width * 0.001);
            document.getElementById('gi-length').value = calcLength.toFixed(3);
        } else if (length && width) {
            const calcWeight = densitySteel * length * width * 0.001; // 1mm thickness
            document.getElementById('gi-weight').value = calcWeight.toFixed(3);
        }
    }
}

function updateMethod(type) {
    const methodText = document.getElementById('method-text');
    if (type === 'plain' || type === 'tmt') {
        methodText.innerHTML = `
            Weight = Density × π × (Diameter/2)² × Length<br>
            Diameter = √(4 × Weight / (Density × π × Length)) × 1000<br>
            Length = Weight / (Density × π × (Diameter/2)²)<br>
            Density = 7850 kg/m³
        `;
    } else if (type === 'square') {
        methodText.innerHTML = `
            Weight = Density × Side² × Length<br>
            Side = √(Weight / (Density × Length)) × 1000<br>
            Length = Weight / (Density × Side²)<br>
            Density = 7850 kg/m³
        `;
    } else if (type === 'gi') {
        methodText.innerHTML = `
            Weight = Density × Length × Width × Thickness<br>
            Length = Weight / (Density × Width × Thickness)<br>
            Width = Weight / (Density × Length × Thickness)<br>
            Thickness assumed as 1mm, Density = 7850 kg/m³
        `;
    }
}

// Initialize with Plain Bar
setupInputs('plain');
