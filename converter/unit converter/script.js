function showConverter(converterId) {
    document.querySelectorAll('.converter').forEach(div => div.classList.add('hidden'));
    document.getElementById(converterId + '-converter').classList.remove('hidden');
}

// Conversion functions
function convertLength() {
    const value = parseFloat(document.getElementById('lengthValue').value);
    const unit = document.getElementById('lengthUnit').value;
    const conversions = {
        km: value,
        m: value * 1000,
        cm: value * 100000,
        mm: value * 1000000,
        ft: value * 3280.84,
        in: value * 39370.1,
        mi: value * 0.621371,
        ya: value * 1093.6132983377,
        nm: value * 0.539957
    };

    displayResults('lengthResults', conversions);
}

function convertArea() {
    const value = parseFloat(document.getElementById('areaValue').value);
    const conversions = {
        sqm: value,
        sqft: value * 10.7639,
        sqin: value * 1550,
        acre: value * 0.000247105,
        hectare: value * 0.0001
    };

    displayResults('areaResults', conversions);
}

function convertVolume() {
    const value = parseFloat(document.getElementById('volumeValue').value);
    const conversions = {
        m3: value,
        liter: value * 1000,
        gallon: value * 264.172,
        cft: value * 35.3147,
        cyd: value * 1.30795
    };

    displayResults('volumeResults', conversions);
}

function convertVolumeToWeight() {
    const value = parseFloat(document.getElementById('volumeWeightValue').value);
    const unit = document.getElementById('volumeWeightUnit').value;
    const conversionRates = {
        m10: 2400,
        m15: 2500,
        asphalt: 2300,
        aggregate: 1500,
        sand: 1600,
        stoneDust: 1700,
        cement: 1440,
    };

    const result = value * conversionRates[unit];
    document.getElementById('volumeWeightResults').innerHTML = `${result.toFixed(2)} kg`;
}

// Display Results Function
function displayResults(elementId, conversions) {
    const resultBox = document.getElementById(elementId);
    resultBox.innerHTML = '';
    for (const [unit, value] of Object.entries(conversions)) {
        resultBox.innerHTML += `<div>${value.toFixed(2)} ${unit}</div>`;
    }
}
