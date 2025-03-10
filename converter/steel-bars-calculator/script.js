// Function to show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.calc-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to enable or disable input fields based on selection
function toggleInputs(type) {
    let selected = document.getElementById(`${type}Select`).value;
    let inputs = ['Diameter', 'Length', 'Weight'];

    // For square rod, the term "Diameter" is replaced with "Side"
    if (type === 'square') inputs[0] = 'Side';

    // Enable or disable fields based on selected option
    inputs.forEach((input) => {
        let inputField = document.getElementById(`${type}${input}`);
        inputField.disabled = !selected.includes(input.toLowerCase());
        if (inputField.disabled) inputField.value = ""; // Clear value if disabled
    });
}

// Universal function to calculate weight, length, or diameter/side for rods
function calculateRod(type, isSquare = false, hasBendFactor = false) {
    let size = parseFloat(document.getElementById(`${type}Diameter`)?.value) / 1000; // Convert mm to meters
    let length = parseFloat(document.getElementById(`${type}Length`)?.value);
    let weight = parseFloat(document.getElementById(`${type}Weight`)?.value);
    let density = 7850; // Steel density in kg/m³

    // Area calculation
    let area = isSquare ? (size * size) : (Math.PI * Math.pow(size, 2) / 4);

    // Apply bend factor for ring rods
    if (hasBendFactor) {
        let bendFactor = parseFloat(document.getElementById("bendFactor").value) || 1.06;
        length *= bendFactor;
    }

    // Calculate missing value
    if (!isNaN(size) && !isNaN(length)) {
        weight = density * area * length;
    } else if (!isNaN(weight) && !isNaN(length)) {
        size = Math.sqrt(weight / (density * length));
    } else if (!isNaN(weight) && !isNaN(size)) {
        length = weight / (density * area);
    }

    // Display results
    document.getElementById(`${type}Result`).innerHTML = 
        `Weight: ${weight.toFixed(2)} kg<br>
         Side/Diameter: ${(size * 1000).toFixed(2)} mm<br>
         Length: ${length.toFixed(2)} m`;
}

// Individual functions for different rod types
function calculatePlainRod() { calculateRod('plain'); }
function calculateRingRod() { calculateRod('ring', false, true); }
function calculateSquareRod() { calculateRod('square', true); }

// Function to calculate GI Sheet weight
function calculateGISheet() {
    let thickness = parseFloat(document.getElementById("sheetThickness").value) / 1000; // Convert mm to meters
    let width = parseFloat(document.getElementById("sheetWidth").value);
    let length = parseFloat(document.getElementById("sheetLength").value);

    if (isNaN(thickness) || isNaN(width) || isNaN(length) || thickness <= 0 || width <= 0 || length <= 0) {
        document.getElementById("giResult").innerHTML = "Please enter valid values.";
        return;
    }

    let density = 7850; // Density of steel in kg/m³
    let weight = density * thickness * width * length;

    document.getElementById("giResult").innerHTML = 
        `Weight: ${weight.toFixed(2)} kg<br>
         Formula: W = (T × W × L) × 7850`;
}
