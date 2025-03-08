<script>
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

    document.getElementById('calculateConcrete').addEventListener('click', function() {
        const strength = document.getElementById('concreteStrength').value;
        const volume = parseFloat(document.getElementById('concreteVolume').value);

        if (isNaN(volume) || volume <= 0) {
            alert('Please enter a valid volume.');
            return;
        }

        const mixRatio = concreteMixRatios[strength];
        const totalParts = mixRatio.cement + mixRatio.sand + mixRatio.aggregate;

        const cementVolume = (mixRatio.cement / totalParts) * volume;
        const sandVolume = (mixRatio.sand / totalParts) * volume;
        const aggregateVolume = (mixRatio.aggregate / totalParts) * volume;

        const cementWeight = cementVolume * 1440; // Cement density in kg/m³
        const cementBags = cementWeight / 50;     // 1 cement bag = 50 kg

        const resultHTML = `
            <h4>Results for ${strength} Concrete:</h4>
            <p><strong>Cement Required:</strong> ${cementWeight.toFixed(2)} kg (${cementBags.toFixed(1)} bags)</p>
            <p><strong>Sand Required:</strong> ${sandVolume.toFixed(2)} m³</p>
            <p><strong>Aggregate Required:</strong> ${aggregateVolume.toFixed(2)} m³</p>

            <h4>Calculation Details:</h4>
            <p>Cement Volume = ( ${mixRatio.cement} / ${totalParts} ) × ${volume} = ${cementVolume.toFixed(2)} m³</p>
            <p>Sand Volume = ( ${mixRatio.sand} / ${totalParts} ) × ${volume} = ${sandVolume.toFixed(2)} m³</p>
            <p>Aggregate Volume = ( ${mixRatio.aggregate} / ${totalParts} ) × ${volume} = ${aggregateVolume.toFixed(2)} m³</p>
            <p>Cement Weight = ${cementVolume.toFixed(2)} m³ × 1440 = ${cementWeight.toFixed(2)} kg</p>
        `;

        document.getElementById('concreteResult').innerHTML = resultHTML;
    });

    // Cement Mortar Estimate Logic
    const mortarMixRatios = {
        "1:4": { cement: 1, sand: 4 },
        "1:5": { cement: 1, sand: 5 },
        "1:6": { cement: 1, sand: 6 },
        "1:8": { cement: 1, sand: 8 }
    };

    document.getElementById('calculateMortar').addEventListener('click', function() {
        const ratio = document.getElementById('mortarRatio').value;
        const volume = parseFloat(document.getElementById('mortarVolume').value);

        if (isNaN(volume) || volume <= 0) {
            alert('Please enter a valid volume.');
            return;
        }

        const mixRatio = mortarMixRatios[ratio];
        const totalParts = mixRatio.cement + mixRatio.sand;

        const cementVolume = (mixRatio.cement / totalParts) * volume;
        const sandVolume = (mixRatio.sand / totalParts) * volume;

        const cementWeight = cementVolume * 1440; // Cement density in kg/m³
        const cementBags = cementWeight / 50;     // 1 cement bag = 50 kg

        const resultHTML = `
            <h4>Results for Cement Mortar (${ratio}):</h4>
            <p><strong>Cement Required:</strong> ${cementWeight.toFixed(2)} kg (${cementBags.toFixed(1)} bags)</p>
            <p><strong>Sand Required:</strong> ${sandVolume.toFixed(2)} m³</p>

            <h4>Calculation Details:</h4>
            <p>Cement Volume = ( ${mixRatio.cement} / ${totalParts} ) × ${volume} = ${cementVolume.toFixed(2)} m³</p>
            <p>Sand Volume = ( ${mixRatio.sand} / ${totalParts} ) × ${volume} = ${sandVolume.toFixed(2)} m³</p>
            <p>Cement Weight = ${cementVolume.toFixed(2)} m³ × 1440 = ${cementWeight.toFixed(2)} kg</p>
        `;

        document.getElementById('mortarResult').innerHTML = resultHTML;
    });
</script>
