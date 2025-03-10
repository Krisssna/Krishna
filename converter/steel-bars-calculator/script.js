function showSection(sectionId) {
    document.querySelectorAll('.calc-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Plain Rod Calculation
function calculatePlainRod() {
    let diameter = parseFloat(document.getElementById("plainDiameter").value);
    let length = parseFloat(document.getElementById("plainLength").value);
    
    if (isNaN(diameter) || isNaN(length) || diameter <= 0 || length <= 0) {
        document.getElementById("plainResult").innerHTML = "Please enter valid values.";
        return;
    }

    let density = 7850; // kg/m³ (Density of steel)
    let area = Math.PI * Math.pow(diameter / 1000, 2) / 4;
    let weight = density * area * length;

    document.getElementById("plainResult").innerHTML = 
        `Weight: ${weight.toFixed(2)} kg<br>
         Formula: W = (π × D² / 4) × L × 7850`;
}

// Ring Rod Calculation
function calculateRingRod() {
    let diameter = parseFloat(document.getElementById("ringDiameter").value);
    let length = parseFloat(document.getElementById("ringLength").value);
    let bendFactor = parseFloat(document.getElementById("bendFactor").value);

    if (isNaN(diameter) || isNaN(length) || isNaN(bendFactor) || diameter <= 0 || length <= 0 || bendFactor <= 0) {
        document.getElementById("ringResult").innerHTML = "Please enter valid values.";
        return;
    }

    let density = 7850;
    let actualLength = length * bendFactor;
    let area = Math.PI * Math.pow(diameter / 1000, 2) / 4;
    let weight = density * area * actualLength;

    document.getElementById("ringResult").innerHTML = 
        `Weight: ${weight.toFixed(2)} kg<br>
         Formula: W = (π × D² / 4) × (L × Bend Factor) × 7850`;
}

// GI Sheet Calculation
function calculateGISheet() {
    let thickness = parseFloat(document.getElementById("sheetThickness").value);
    let width = parseFloat(document.getElementById("sheetWidth").value);
    let length = parseFloat(document.getElementById("sheetLength").value);

    if (isNaN(thickness) || isNaN(width) || isNaN(length) || thickness <= 0 || width <= 0 || length <= 0) {
        document.getElementById("giResult").innerHTML = "Please enter valid values.";
        return;
    }

    let density = 7850; // kg/m³ (for mild steel/GI sheets)
    let volume = thickness / 1000 * width * length;
    let weight = density * volume;

    document.getElementById("giResult").innerHTML = 
        `Weight: ${weight.toFixed(2)} kg<br>
         Formula: W = (T × W × L) × 7850`;
}
