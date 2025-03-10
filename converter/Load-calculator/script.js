document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    const canvas = document.getElementById('canvas');
    const crosshairX = document.getElementById('crosshair-x');
    const crosshairY = document.getElementById('crosshair-y');
    const dynamicLabel = document.getElementById('dynamic-label');
    const scale = 100; // 100 pixels per meter
    let mode = 'none';
    let startPoint = null;
    let elements = [];

    // Verify elements exist
    const drawColumnBtn = document.getElementById('drawColumn');
    const drawBeamBtn = document.getElementById('drawBeam');
    const drawSlabBtn = document.getElementById('drawSlab');
    if (!drawColumnBtn || !drawBeamBtn || !drawSlabBtn || !canvas) {
        console.error('One or more DOM elements not found');
        return;
    }

    // Toolbar buttons
    drawColumnBtn.addEventListener('click', () => {
        console.log('Column button clicked');
        mode = 'column';
        updateToolbar();
    });

    drawBeamBtn.addEventListener('click', () => {
        console.log('Beam button clicked');
        mode = 'beam';
        updateToolbar();
    });

    drawSlabBtn.addEventListener('click', () => {
        console.log('Slab button clicked');
        mode = 'slab';
        updateToolbar();
    });

    // Update toolbar button states
    function updateToolbar() {
        console.log('Updating toolbar, mode:', mode);
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        if (mode === 'column') drawColumnBtn.classList.add('active');
        else if (mode === 'beam') drawBeamBtn.classList.add('active');
        else if (mode === 'slab') drawSlabBtn.classList.add('active');
    }

    // Crosshair movement
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        crosshairX.style.top = y + 'px';
        crosshairY.style.left = x + 'px';

        if (startPoint && (mode === 'beam' || mode === 'slab')) {
            const dx = x - startPoint.x;
            const dy = y - startPoint.y;
            const length = Math.abs(dx) / scale;
            const width = mode === 'slab' ? Math.abs(dy) / scale : 0;
            dynamicLabel.style.left = (x + 10) + 'px';
            dynamicLabel.style.top = (y + 10) + 'px';
            dynamicLabel.textContent = mode === 'beam' ? `Length: ${length.toFixed(2)}m` : `L: ${length.toFixed(2)}m, W: ${width.toFixed(2)}m`;
            dynamicLabel.style.display = 'block';
        } else {
            dynamicLabel.style.display = 'none';
        }
    });

    // Drawing logic
    canvas.addEventListener('mousedown', (e) => {
        console.log('Mouse down, mode:', mode);
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === 'column') {
            addColumn(x, y);
            mode = 'none';
            updateToolbar();
        } else if (mode === 'beam' || mode === 'slab') {
            startPoint = { x, y };
            console.log('Start point set:', startPoint);
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!startPoint || (mode !== 'beam' && mode !== 'slab')) return;

        console.log('Mouse up, mode:', mode);
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === 'beam') {
            addBeam(startPoint.x, startPoint.y, x, y);
        } else if (mode === 'slab') {
            addSlab(startPoint.x, startPoint.y, x, y);
        }

        startPoint = null;
        dynamicLabel.style.display = 'none';
        mode = 'none';
        updateToolbar();
    });

    // Add elements
    function addColumn(x, y) {
        console.log('Adding column at:', x, y);
        const column = document.createElement('div');
        column.className = 'column';
        column.style.left = (x - 5) + 'px';
        column.style.top = (y - 5) + 'px';
        canvas.appendChild(column);
        elements.push({ type: 'column', element: column });

        const width = prompt('Enter column width (m)', '0.3');
        const depth = prompt('Enter column depth (m)', '0.3');
        const height = prompt('Enter column height (m)', '3');
        if (width && depth && height) {
            column.dataset.width = parseFloat(width);
            column.dataset.depth = parseFloat(depth);
            column.dataset.height = parseFloat(height);
        }
    }

    function addBeam(x1, y1, x2, y2) {
        console.log('Adding beam from:', x1, y1, 'to:', x2, y2);
        const beam = document.createElement('div');
        beam.className = 'beam';
        const left = Math.min(x1, x2);
        const top = y1;
        const width = Math.abs(x2 - x1);
        beam.style.left = left + 'px';
        beam.style.top = top + 'px';
        beam.style.width = width + 'px';
        beam.style.height = '10px';
        canvas.appendChild(beam);
        elements.push({ type: 'beam', element: beam });

        const length = width / scale;
        const widthPrompt = prompt(`Enter beam width (m) (Length: ${length.toFixed(2)}m)`, '0.3');
        const depth = prompt('Enter beam depth (m)', '0.4');
        if (widthPrompt && depth) {
            beam.dataset.width = parseFloat(widthPrompt);
            beam.dataset.depth = parseFloat(depth);
            beam.dataset.length = length;
        }
    }

    function addSlab(x1, y1, x2, y2) {
        console.log('Adding slab from:', x1, y1, 'to:', x2, y2);
        const slab = document.createElement('div');
        slab.className = 'slab';
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        slab.style.left = left + 'px';
        slab.style.top = top + 'px';
        slab.style.width = width + 'px';
        slab.style.height = height + 'px';
        canvas.appendChild(slab);
        elements.push({ type: 'slab', element: slab });

        const length = width / scale;
        const widthSlab = height / scale;
        const thickness = prompt(`Enter slab thickness (m) (Length: ${length.toFixed(2)}m, Width: ${widthSlab.toFixed(2)}m)`, '0.15');
        if (thickness) {
            slab.dataset.thickness = parseFloat(thickness);
            slab.dataset.length = length;
            slab.dataset.width = widthSlab;
        }
    }
});
