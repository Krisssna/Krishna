function showConverter(type) {
    document.querySelectorAll('.converter').forEach(converter => {
        converter.classList.add('hidden');
    });
    document.getElementById(`${type}-converter`).classList.remove('hidden');
}

function convertLength() {
    const value = parseFloat(document.getElementById("lengthValue").value);
    const unit = document.getElementById("lengthUnit").value;
    const conversionRates = {
        km: 1000,
        m: 1,
        cm: 0.01,
        mm: 0.001,
        ft: 0.3048,
        in: 0.0254,
        mi: 1609.34,
        ya: 0.9144,
        nm: 1852
    };
    
    let results = "";
    for (let key in conversionRates) {
        if (key !== unit) {
            results += `${(value * conversionRates[unit] / conversionRates[key]).toFixed(4)} ${key} <br>`;
        }
    }
    document.getElementById("lengthResults").innerHTML = results;
}

function convertArea() {
    const value = parseFloat(document.getElementById("areaValue").value);
    const unit = document.getElementById("areaUnit").value;
    const conversionRates = {
        sqm: 1,
        sqkm: 1e6,
        sqft: 0.092903,
        sqin: 0.00064516,
        acre: 4046.86,
        hectare: 10000
    };
    
    let results = "";
    for (let key in conversionRates) {
        if (key !== unit) {
            results += `${(value * conversionRates[unit] / conversionRates[key]).toFixed(4)} ${key} <br>`;
        }
    }
    document.getElementById("areaResults").innerHTML = results;
}

function convertVolume() {
    const value = parseFloat(document.getElementById("volumeValue").value);
    const unit = document.getElementById("volumeUnit").value;
    const conversionRates = {
        m3: 1,
        liter: 0.001,
        gallon: 0.00378541,
        cft: 0.0283168,
        cyd: 0.764555
    };
    
    let results = "";
    for (let key in conversionRates) {
        if (key !== unit) {
            results += `${(value * conversionRates[unit] / conversionRates[key]).toFixed(4)} ${key} <br>`;
        }
    }
    document.getElementById("volumeResults").innerHTML = results;
}

function convertVolumeToWeight() {
    const value = parseFloat(document.getElementById("volumeWeightValue").value);
    const unit = document.getElementById("volumeWeightUnit").value;
    const conversionRates = {
        m10: 2200,
        m15: 2400,
        asphalt: 2320,
        aggregate: 1600,
        sand: 1450,
        stoneDust: 1750,
        cement: 1440
    };
    
    const weight = (value * conversionRates[unit]).toFixed(2);
    document.getElementById("volumeWeightResults").innerHTML = `${weight} kg`;
}
