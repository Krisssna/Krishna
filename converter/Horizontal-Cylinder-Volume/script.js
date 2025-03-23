function calculateVolume() {
    const length = parseFloat(document.getElementById('length').value);
    const diameter = parseFloat(document.getElementById('diameter').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const unit = document.getElementById('unit').value;

    if (isNaN(length) || isNaN(diameter) || isNaN(depth) || length <= 0 || diameter <= 0 || depth <= 0) {
        alert('Please enter valid positive numbers for all fields.');
        return;
    }

    if (depth > diameter) {
        alert('Water depth cannot be greater than the diameter.');
        return;
    }

    
    let lengthInMeters = length;
    let diameterInMeters = diameter;
    let depthInMeters = depth;

    if (unit === 'centimeters') {
        lengthInMeters = length / 100;
        diameterInMeters = diameter / 100;
        depthInMeters = depth / 100;
    }

    
    const radius = diameterInMeters / 2;

    // Calculate the cross-sectional area of the water (circular segment)
    const rMinusH = radius - depthInMeters;
    const cosTerm = rMinusH / radius;
    const theta = Math.acos(cosTerm);
    const area = (radius * radius * theta) - (rMinusH * Math.sqrt(2 * radius * depthInMeters - depthInMeters * depthInMeters));

    
    const volume = area * lengthInMeters;

    
    const resultElement = document.getElementById('result');
    const volumeResultElement = document.getElementById('volume-result').querySelector('span');
    volumeResultElement.textContent = volume.toFixed(2);
    resultElement.style.display = 'block';
}