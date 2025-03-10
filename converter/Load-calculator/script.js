const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const columns = [];
const beams = [];
const slabs = [];

let drawingMode = null; // 'column', 'beam', 'slab'
let selectedPoints = [];

document.getElementById('createColumnBtn').addEventListener('click', () => {
    drawingMode = 'column';
});
document.getElementById('createBeamBtn').addEventListener('click', () => {
    drawingMode = 'beam';
    selectedPoints = [];
});
document.getElementById('createSlabBtn').addEventListener('click', () => {
    drawingMode = 'slab';
    selectedPoints = [];
});

// Drawing logic
canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    if (drawingMode === 'column') {
        createColumn(x, y);
    } else if (drawingMode === 'beam') {
        selectPointForBeam(x, y);
    } else if (drawingMode === 'slab') {
        selectPointForSlab(x, y);
    }

    redrawCanvas();
});

// Create Column
function createColumn(x, y) {
    const columnName = `C${columns.length + 1}`;
    columns.push({ x, y, name: columnName });
}

// Select Points for Beam
function selectPointForBeam(x, y) {
    const nearestColumn = findNearestColumn(x, y);

    if (nearestColumn) {
        selectedPoints.push(nearestColumn);

        if (selectedPoints.length === 2) {
            const beamName = `B${beams.length + 1}`;
            beams.push({ start: selectedPoints[0], end: selectedPoints[1], name: beamName });
            selectedPoints = [];
        }
    }
}

// Select Points for Slab
function selectPointForSlab(x, y) {
    const nearestColumn = findNearestColumn(x, y);

    if (nearestColumn) {
        selectedPoints.push(nearestColumn);

        if (selectedPoints.length === 4) {
            const slabName = `S${slabs.length + 1}`;
            slabs.push({ points: [...selectedPoints], name: slabName });
            selectedPoints = [];
        }
    }
}

// Find Nearest Column
function findNearestColumn(x, y) {
    const threshold = 15;
    return columns.find(col => 
        Math.abs(col.x - x) < threshold && Math.abs(col.y - y) < threshold
    );
}

// Redraw Canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Columns
    columns.forEach(col => {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(col.x - 5, col.y - 5, 10, 10);
        ctx.fillStyle = '#000';
        ctx.fillText(col.name, col.x + 8, col.y - 8);
    });

    // Draw Beams
    beams.forEach(beam => {
        ctx.beginPath();
        ctx.moveTo(beam.start.x, beam.start.y);
        ctx.lineTo(beam.end.x, beam.end.y);
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillText(beam.name, (beam.start.x + beam.end.x) / 2, (beam.start.y + beam.end.y) / 2);
    });

    // Draw Slabs
    slabs.forEach(slab => {
        ctx.beginPath();
        ctx.moveTo(slab.points[0].x, slab.points[0].y);
        slab.points.forEach((point, index) => {
            if (index > 0) ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(slab.name, slab.points[0].x + 10, slab.points[0].y + 10);
    });
}
