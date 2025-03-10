// Function to show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.calc-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Universal function to calculate and auto-fill missing values
function autoCalculateRod(type, isSquare = false, hasBendFactor = false) {
    let size = parseFloat(document.getElementById(`${type}Diameter`)?.value) / 1000; // Convert mm to meters
    let length = parseFloat(document.getElementById(`${type}Length`)?.value);
    let weight = parseFloat(document.getElementById(`${type}Weight`)?.value);
    let density = 7850; // Density of steel in kg/m³

    let area = isSquare ? (size * size) : (Math.PI * Math.pow(size, 2) / 4);

    // Apply bend factor for ring rods
    if (hasBendFactor) {
        let bendFactor = parseFloat(document.getElementById("bendFactor").value) || 1.06;
        length *= bendFactor;
    }

    // Auto-calculate missing value
    if (!isNaN(size) && !isNaN(length) && isNaN(weight)) {
        weight = density * area * length;
        document.getElementById(`${type}Weight`).value = weight.toFixed(2);
    } else if (!isNaN(weight) && !isNaN(length) && isNaN(size)) {
        size = Math.sqrt(weight / (density * length));
        document.getElementById(`${type}Diameter`).value = (size * 1000).toFixed(2);
    } else if (!isNaN(weight) && !isNaN(size) && isNaN(length)) {
        length = weight / (density * area);
        document.getElementById(`${type}Length`).value = length.toFixed(2);
    }
}

// Function for different rod types
function calculatePlainRod() { autoCalculateRod('plain'); }
function calculateRingRod() { autoCalculateRod('ring', false, true); }
function calculateSquareRod() { autoCalculateRod('square', true); }

// Function for GI Sheet calculations
function autoCalculateGISheet() {
    let thickness = parseFloat(document.getElementById("sheetThickness").value) / 1000; // Convert mm to meters
    let width = parseFloat(document.getElementById("sheetWidth").value);
    let length = parseFloat(document.getElementById("sheetLength").value);
    let weight = parseFloat(document.getElementById("sheetWeight").value);
    let density = 7850; // Density of steel in kg/m³

    if (!isNaN(thickness) && !isNaN(width) && !isNaN(length) && isNaN(weight)) {
        weight = density * thickness * width * length;
        document.getElementById("sheetWeight").value = weight.toFixed(2);
    } else if (!isNaN(weight) && !isNaN(width) && !isNaN(length) && isNaN(thickness)) {
        thickness = weight / (density * width * length);
        document.getElementById("sheetThickness").value = (thickness * 1000).toFixed(2);
    }
}

// Attach event listeners to input fields for real-time calculations
document.addEventListener("DOMContentLoaded", function() {
    ["plain", "ring", "square"].forEach(type => {
        ["Diameter", "Length", "Weight"].forEach(input => {
            let inputField = document.getElementById(`${type}${input}`);
            if (inputField) {
                inputField.addEventListener("input", () => autoCalculateRod(type, type === 'square', type === 'ring'));
            }
        });
    });

    ["sheetThickness", "sheetWidth", "sheetLength", "sheetWeight"].forEach(input => {
        let inputField = document.getElementById(input);
        if (inputField) {
            inputField.addEventListener("input", autoCalculateGISheet);
        }
    });
});
