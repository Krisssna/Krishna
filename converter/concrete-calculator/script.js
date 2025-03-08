// Show/Hide Sections
document.getElementById('btnConcreteMaterial').addEventListener('click', function() {
    document.getElementById('concreteMaterialSection').style.display = 'block';
    document.getElementById('cementMortarSection').style.display = 'none';
});

document.getElementById('btnCementMortar').addEventListener('click', function() {
    document.getElementById('cementMortarSection').style.display = 'block';
    document.getElementById('concreteMaterialSection').style.display = 'none';
});

// Concrete Material Estimate Logic
const concreteMixRatios = {
    M10: { cement: 1, sand: 3, aggregate: 6 },
    M15: { cement: 1, sand: 2, aggregate: 4 },
    M20: { cement: 1, sand: 1.5, aggregate: 3 },
    M25: { cement: 1, sand: 1, aggregate: 2 }
};

// Function to convert dry volume to wet volume for concrete
function convertDryToWetVolumeConcrete(dryVolume) {
    return dryVolume * 1.54; // 54% increase for concrete
}

document.getElementById('calculateConcrete').addEventListener('click', function() {
    const strength = document.getElementById('concreteStrength').value;
    const dryVolume = parseFloat(document.getElementById('concreteVolume').value);

    if (isNaN(dryVolume) || dryVolume <= 0) {
        alert('Please enter a valid volume.');
        return;
    }

    // Convert dry volume to wet volume
    const wetVolume = convertDryToWetVolumeConcrete(dryVolume);

    const mixRatio = concreteMixRatios[strength];
    const totalParts = mixRatio.cement + mixRatio.sand + mixRatio.aggregate;

    const cementVolume = (mixRatio.cement / totalParts) * wetVolume;
    const sandVolume = (mixRatio.sand / totalParts) * wetVolume;
    const aggregateVolume = (mixRatio.aggregate / totalParts) * wetVolume;

    const cementWeight = cementVolume * 1440; // Cement density in kg/m³
    const cementBags = cementWeight / 50;     // 1 cement bag = 50 kg

    const resultHTML = `
        <h4>Results for ${strength} Concrete:</h4>
        <p><strong>Cement Required:</strong> ${cementWeight.toFixed(2)} kg (${cementBags.toFixed(1)} bags)</p>
        <p><strong>Sand Required:</strong> ${sandVolume.toFixed(2)} m³</p>
        <p><strong>Aggregate Required:</strong> ${aggregateVolume.toFixed(2)} m³</p>

        <h4>Calculation Details:</h4>
        <p><strong>Dry Volume:</strong> ${dryVolume.toFixed(2)} m³</p>
        <p><strong>Wet Volume:</strong> ${wetVolume.toFixed(2)} m³ (Dry Volume × 1.54)</p>
        <p>Cement Volume = ( ${mixRatio.cement} / ${totalParts} ) × ${wetVolume.toFixed(2)} = ${cementVolume.toFixed(2)} m³</p>
        <p>Sand Volume = ( ${mixRatio.sand} / ${totalParts} ) × ${wetVolume.toFixed(2)} = ${sandVolume.toFixed(2)} m³</p>
        <p>Aggregate Volume = ( ${mixRatio.aggregate} / ${totalParts} ) × ${wetVolume.toFixed(2)} = ${aggregateVolume.toFixed(2)} m³</p>
        <p>Cement Weight = ${cementVolume.toFixed(2)} m³ × 1440 = ${cementWeight.toFixed(2)} kg</p>
    `;

    document.getElementById('concreteResult').innerHTML = resultHTML;
});

// Show/Hide Sections for Cement Mortar
document.getElementById('btnCementMortar').addEventListener('click', function() {
    document.getElementById('cementMortarSection').style.display = 'block';
    document.getElementById('concreteMaterialSection').style.display = 'none';
});

// Toggle Input Fields Based on Calculation Type
document.getElementById('calculationType').addEventListener('change', function() {
    const calculationType = this.value;
    if (calculationType === 'mortarVolume') {
        document.getElementById('mortarVolumeInput').style.display = 'block';
        document.getElementById('totalVolumeInput').style.display = 'none';
    } else if (calculationType === 'totalVolume') {
        document.getElementById('mortarVolumeInput').style.display = 'none';
        document.getElementById('totalVolumeInput').style.display = 'block';
    }
});

// Cement Mortar Estimate Logic
const mortarMixRatios = {
    "1:4": { cement: 1, sand: 4 },
    "1:5": { cement: 1, sand: 5 },
    "1:6": { cement: 1, sand: 6 },
    "1:8": { cement: 1, sand: 8 }
};

// Function to convert dry volume to wet volume for cement mortar
function convertDryToWetVolumeMortar(dryVolume) {
    return dryVolume * 1.33; // 33% increase for cement mortar
}

// Function to calculate mortar volume and number of bricks from total volume, brick size, and mortar thickness
function calculateMortarAndBricks(totalVolume, brickLength, brickWidth, brickThickness, mortarThickness) {
    // Convert dimensions from mm to meters
    const brickLengthM = brickLength / 1000;
    const brickWidthM = brickWidth / 1000;
    const brickThicknessM = brickThickness / 1000;
    const mortarThicknessM = mortarThickness / 1000;

    // Calculate brick volume (including mortar)
    const brickVolumeWithMortar = (brickLengthM + mortarThicknessM) * (brickWidthM + mortarThicknessM) * (brickThicknessM + mortarThicknessM);

    // Calculate brick volume (without mortar)
    const brickVolumeWithoutMortar = brickLengthM * brickWidthM * brickThicknessM;

    // Calculate mortar volume per brick
    const mortarVolumePerBrick = brickVolumeWithMortar - brickVolumeWithoutMortar;

    // Calculate number of bricks in total volume
    const numberOfBricks = totalVolume / brickVolumeWithMortar;

    // Calculate total mortar volume
    const totalMortarVolume = mortarVolumePerBrick * numberOfBricks;

    return {
        numberOfBricks: numberOfBricks,
        totalMortarVolume: totalMortarVolume
    };
}

document.getElementById('calculateMortar').addEventListener('click', function() {
    const ratio = document.getElementById('mortarRatio').value;
    const calculationType = document.getElementById('calculationType').value;

    let mortarVolume;
    let numberOfBricks = 0; // Initialize number of bricks

    if (calculationType === 'mortarVolume') {
        // Use direct mortar volume input
        mortarVolume = parseFloat(document.getElementById('mortarVolume').value);
    } else if (calculationType === 'totalVolume') {
        // Calculate mortar volume and number of bricks from total volume, brick size, and mortar thickness
        const totalVolume = parseFloat(document.getElementById('totalVolume').value);
        const brickLength = parseFloat(document.getElementById('brickLength').value);
        const brickWidth = parseFloat(document.getElementById('brickWidth').value);
        const brickThickness = parseFloat(document.getElementById('brickThickness').value);
        const mortarThickness = parseFloat(document.getElementById('mortarThickness').value);

        if (isNaN(totalVolume) || totalVolume <= 0 || isNaN(brickLength) || brickLength <= 0 || isNaN(brickWidth) || brickWidth <= 0 || isNaN(brickThickness) || brickThickness <= 0 || isNaN(mortarThickness) || mortarThickness <= 0) {
            alert('Please enter valid values for total volume, brick size, and mortar thickness.');
            return;
        }

        const result = calculateMortarAndBricks(totalVolume, brickLength, brickWidth, brickThickness, mortarThickness);
        mortarVolume = result.totalMortarVolume;
        numberOfBricks = result.numberOfBricks;
    }

    if (isNaN(mortarVolume) || mortarVolume <= 0) {
        alert('Please enter a valid volume.');
        return;
    }

    // Convert dry volume to wet volume
    const wetVolume = convertDryToWetVolumeMortar(mortarVolume);

    const mixRatio = mortarMixRatios[ratio];
    const totalParts = mixRatio.cement + mixRatio.sand;

    const cementVolume = (mixRatio.cement / totalParts) * wetVolume;
    const sandVolume = (mixRatio.sand / totalParts) * wetVolume;

    const cementWeight = cementVolume * 1440; // Cement density in kg/m³
    const cementBags = cementWeight / 50;     // 1 cement bag = 50 kg

    // Prepare result HTML
    let resultHTML = `
        <h4>Results for Cement Mortar (${ratio}):</h4>
        <p><strong>Cement Required:</strong> ${cementWeight.toFixed(2)} kg (${cementBags.toFixed(1)} bags)</p>
        <p><strong>Sand Required:</strong> ${sandVolume.toFixed(2)} m³</p>
    `;

    if (calculationType === 'totalVolume') {
        resultHTML += `
            <p><strong>Number of Bricks Required:</strong> ${Math.ceil(numberOfBricks)}</p>
        `;
    }

    resultHTML += `
        <h4>Calculation Details:</h4>
        <p><strong>Mortar Volume:</strong> ${mortarVolume.toFixed(2)} m³</p>
        <p><strong>Wet Volume:</strong> ${wetVolume.toFixed(2)} m³ (Mortar Volume × 1.33)</p>
        <p>Cement Volume = ( ${mixRatio.cement} / ${totalParts} ) × ${wetVolume.toFixed(2)} = ${cementVolume.toFixed(2)} m³</p>
        <p>Sand Volume = ( ${mixRatio.sand} / ${totalParts} ) × ${wetVolume.toFixed(2)} = ${sandVolume.toFixed(2)} m³</p>
        <p>Cement Weight = ${cementVolume.toFixed(2)} m³ × 1440 = ${cementWeight.toFixed(2)} kg</p>
    `;

    document.getElementById('mortarResult').innerHTML = resultHTML;
});
