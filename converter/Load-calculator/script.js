const canvas = document.getElementById('canvas');
const scale = 100; // 100 pixels per meter
let elements = { columns: [], beams: [], slabs: [] };
let selectedElement = null;
let mode = 'none';
let unit = 'm';
const density = 24; // kN/m³ for concrete

// Conversion factors to meters
const unitConversions = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    in: 0.0254
};

// Event listeners for toolbar
document.getElementById('addColumn').addEventListener('click', () => mode = 'addingColumn');
document.getElementById('addBeam').addEventListener('click', () => { mode = 'addingBeam'; window.selectedColumns = []; });
document.getElementById('addSlab').addEventListener('click', () => { mode = 'addingSlab'; window.slabPoints = []; });
document.getElementById('deleteElement').addEventListener('click', () => mode = 'deleting');
document.getElementById('calculateLoads').addEventListener('click', calculateLoads);
document.getElementById('units').addEventListener('change', (e) => unit = e.target.value);

// Canvas click handler
canvas.addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (mode === 'addingColumn') {
        addColumn(x, y);
        mode = 'none';
    } else if (mode === 'addingBeam') {
        const column = getColumnAtPosition(x, y);
        if (column) {
            window.selectedColumns.push(column);
            if (window.selectedColumns.length === 2) {
                addBeam(window.selectedColumns[0], window.selectedColumns[1]);
                window.selectedColumns = [];
                mode = 'none';
            }
        }
    } else if (mode === 'addingSlab') {
        window.slabPoints.push({ x, y });
        if (window.slabPoints.length === 2) {
            addSlab(window.slabPoints[0], window.slabPoints[1]);
            window.slabPoints = [];
            mode = 'none';
        }
    } else if (mode === 'deleting') {
        const element = getElementAtPosition(x, y);
        if (element) deleteElement(element);
        mode = 'none';
    }
});

// Helper functions
function getElementAtPosition(x, y) {
    for (let type in elements) {
        for (let el of elements[type]) {
            const rect = el.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const elX = rect.left - canvasRect.left;
            const elY = rect.top - canvasRect.top;
            const elW = rect.width;
            const elH = rect.height;
            if (x >= elX && x <= elX + elW && y >= elY && y <= elY + elH) return el;
        }
    }
    return null;
}

function getColumnAtPosition(x, y) {
    for (let column of elements.columns) {
        const rect = column.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const elX = rect.left - canvasRect.left + 5;
        const elY = rect.top - canvasRect.top + 5;
        if (Math.hypot(x - elX, y - elY) < 15) return column;
    }
    return null;
}

// Add elements
function addColumn(x, y) {
    const column = document.createElement('div');
    column.className = 'column';
    column.style.left = (x - 5) + 'px';
    column.style.top = (y - 5) + 'px';
    canvas.appendChild(column);
    elements.columns.push(column);
    makeDraggable(column);
    const width = prompt(`Enter column width (${unit})`, '0.3');
    const depth = prompt(`Enter column depth (${unit})`, '0.3');
    const height = prompt(`Enter column height (${unit})`, '3');
    if (width && depth && height) {
        column.dataset.width = parseFloat(width) * unitConversions[unit];
        column.dataset.depth = parseFloat(depth) * unitConversions[unit];
        column.dataset.height = parseFloat(height) * unitConversions[unit];
    }
}

function addBeam(column1, column2) {
    const beam = document.createElement('div');
    beam.className = 'beam';
    beam.dataset.column1 = elements.columns.indexOf(column1);
    beam.dataset.column2 = elements.columns.indexOf(column2);
    updateBeamPosition(beam);
    canvas.appendChild(beam);
    elements.beams.push(beam);
    const width = prompt(`Enter beam width (${unit})`, '0.3');
    const depth = prompt(`Enter beam depth (${unit})`, '0.4');
    if (width && depth) {
        beam.dataset.width = parseFloat(width) * unitConversions[unit];
        beam.dataset.depth = parseFloat(depth) * unitConversions[unit];
        const c1x = parseFloat(column1.style.left) + 5;
        const c1y = parseFloat(column1.style.top) + 5;
        const c2x = parseFloat(column2.style.left) + 5;
        const c2y = parseFloat(column2.style.top) + 5;
        beam.dataset.length = Math.hypot((c2x - c1x) / scale, (c2y - c1y) / scale);
    }
}

function updateBeamPosition(beam) {
    const c1 = elements.columns[beam.dataset.column1];
    const c2 = elements.columns[beam.dataset.column2];
    const c1x = parseFloat(c1.style.left) + 5;
    const c1y = parseFloat(c1.style.top) + 5;
    const c2x = parseFloat(c2.style.left) + 5;
    const c2y = parseFloat(c2.style.top) + 5;
    const lengthPx = Math.hypot(c2x - c1x, c2y - c1y);
    const angle = Math.atan2(c2y - c1y, c2x - c1x) * 180 / Math.PI;
    beam.style.left = c1x + 'px';
    beam.style.top = c1y + 'px';
    beam.style.width = lengthPx + 'px';
    beam.style.height = '10px';
    beam.style.transform = `rotate(${angle}deg)`;
    beam.style.transformOrigin = '0 0';
}

function addSlab(point1, point2) {
    const slab = document.createElement('div');
    slab.className = 'slab';
    const left = Math.min(point1.x, point2.x);
    const top = Math.min(point1.y, point2.y);
    const widthPx = Math.abs(point1.x - point2.x);
    const heightPx = Math.abs(point1.y - point2.y);
    slab.style.left = left + 'px';
    slab.style.top = top + 'px';
    slab.style.width = widthPx + 'px';
    slab.style.height = heightPx + 'px';
    canvas.appendChild(slab);
    elements.slabs.push(slab);
    makeDraggable(slab);
    slab.dataset.width = widthPx / scale;
    slab.dataset.length = heightPx / scale;
    const thickness = prompt(`Enter slab thickness (${unit})`, '0.15');
    if (thickness) slab.dataset.thickness = parseFloat(thickness) * unitConversions[unit];
}

// Dragging functionality
function makeDraggable(element) {
    element.onmousedown = (e) => {
        selectedElement = element;
        const offsetX = e.clientX - parseInt(element.style.left);
        const offsetY = e.clientY - parseInt(element.style.top);
        document.onmousemove = (e) => {
            if (selectedElement) {
                selectedElement.style.left = (e.clientX - offsetX) + 'px';
                selectedElement.style.top = (e.clientY - offsetY) + 'px';
                if (selectedElement.className === 'column') updateBeams();
            }
        };
        document.onmouseup = () => {
            selectedElement = null;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

function updateBeams() {
    elements.beams.forEach(updateBeamPosition);
}

// Delete element
function deleteElement(element) {
    if (element.className === 'column') {
        const index = elements.columns.indexOf(element);
        elements.beams = elements.beams.filter(beam => {
            if (beam.dataset.column1 == index || beam.dataset.column2 == index) {
                canvas.removeChild(beam);
                return false;
            }
            return true;
        });
        elements.columns = elements.columns.filter(col => col !== element);
    } else if (element.className === 'beam') {
        elements.beams = elements.beams.filter(b => b !== element);
    } else if (element.className === 'slab') {
        elements.slabs = elements.slabs.filter(s => s !== element);
    }
    canvas.removeChild(element);
}

// Load calculations
function calculateLoads() {
    // Self-weights
    elements.columns.forEach(c => {
        c.selfWeight = c.dataset.width * c.dataset.depth * c.dataset.height * density;
    });
    elements.beams.forEach(b => {
        b.selfWeight = b.dataset.width * b.dataset.depth * b.dataset.length * density;
    });
    elements.slabs.forEach(s => {
        s.selfWeight = s.dataset.width * s.dataset.length * s.dataset.thickness * density;
    });

    // Slab loads to beams (assuming horizontal beams)
    elements.slabs.forEach(slab => {
        const slabRect = {
            left: parseFloat(slab.style.left),
            top: parseFloat(slab.style.top),
            right: parseFloat(slab.style.left) + parseFloat(slab.style.width),
            bottom: parseFloat(slab.style.top) + parseFloat(slab.style.height)
        };
        const supportingBeams = elements.beams.filter(b => {
            const c1 = elements.columns[b.dataset.column1];
            const c2 = elements.columns[b.dataset.column2];
            const c1x = parseFloat(c1.style.left) + 5;
            const c1y = parseFloat(c1.style.top) + 5;
            const c2x = parseFloat(c2.style.left) + 5;
            const c2y = parseFloat(c2.style.top) + 5;
            if (c1y === c2y) { // Horizontal beam
                const beamY = c1y;
                if (beamY > slabRect.top && beamY < slabRect.bottom) {
                    const beamLeft = Math.min(c1x, c2x);
                    const beamRight = Math.max(c1x, c2x);
                    if (beamRight > slabRect.left && beamLeft < slabRect.right) return true;
                }
            }
            return false;
        });
        if (supportingBeams.length > 0) {
            const loadPerBeam = slab.selfWeight / supportingBeams.length;
            supportingBeams.forEach(b => {
                b.slabLoad = (b.slabLoad || 0) + loadPerBeam;
            });
        }
    });

    // Total beam loads
    elements.beams.forEach(b => {
        b.totalLoad = b.selfWeight + (b.slabLoad || 0);
    });

    // Beam loads to columns
    elements.columns.forEach(c => c.beamLoad = 0);
    elements.beams.forEach(b => {
        const c1 = elements.columns[b.dataset.column1];
        const c2 = elements.columns[b.dataset.column2];
        const loadPerColumn = b.totalLoad / 2;
        c1.beamLoad += loadPerColumn;
        c2.beamLoad += loadPerColumn;
    });

    // Total column loads
    elements.columns.forEach(c => {
        c.totalLoad = c.selfWeight + c.beamLoad;
    });

    // Display results
    let html = '<h2>Load Calculations</h2>';
    elements.beams.forEach((b, i) => html += `<p>Beam b${i}: ${b.totalLoad.toFixed(2)} kN</p>`);
    elements.columns.forEach((c, i) => html += `<p>Column c${i}: ${c.totalLoad.toFixed(2)} kN</p>`);
    document.getElementById('results').innerHTML = html;
}
