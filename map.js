
const castles = castlesData;
const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

const mapBounds = {
    minLng: 129.2, maxLng: 141.6,
    minLat: 31.2, maxLat: 41.6
};

const japanTopology = {
honshu: [
        
        {lat: 41.5, lng: 141.4}, {lat: 40.5, lng: 141.9}, {lat: 39.5, lng: 142.0},
        {lat: 38.2, lng: 141.6}, {lat: 37.5, lng: 141.0}, {lat: 36.5, lng: 140.7},
        {lat: 35.5, lng: 140.8}, {lat: 34.9, lng: 139.8}, {lat: 34.6, lng: 138.8},
        
        {lat: 34.5, lng: 137.5}, {lat: 34.2, lng: 136.8}, {lat: 33.5, lng: 135.8},
        {lat: 33.9, lng: 135.0}, {lat: 34.3, lng: 135.0}, {lat: 34.6, lng: 134.0},
        
        {lat: 34.0, lng: 132.5}, {lat: 34.0, lng: 130.9}, {lat: 34.5, lng: 131.2},
        {lat: 35.2, lng: 132.0}, {lat: 35.5, lng: 133.0}, {lat: 35.7, lng: 134.5},
        
        {lat: 36.3, lng: 136.0}, {lat: 37.0, lng: 136.7}, {lat: 37.5, lng: 137.2},
        {lat: 37.8, lng: 139.0}, {lat: 39.0, lng: 139.8}, {lat: 40.2, lng: 140.0},
        {lat: 41.0, lng: 140.3}, {lat: 41.4, lng: 140.9}, {lat: 41.5, lng: 141.4}
    ],
shikoku: [
        {lat: 34.3, lng: 134.4}, 
        {lat: 34.1, lng: 134.6}, 
        {lat: 33.8, lng: 134.6}, 
        {lat: 33.2, lng: 134.1}, 
        {lat: 33.4, lng: 133.5}, 
        {lat: 32.7, lng: 132.8}, 
        {lat: 33.0, lng: 132.4}, 
        {lat: 33.5, lng: 132.3}, 
        {lat: 33.8, lng: 132.6}, 
        {lat: 34.4, lng: 133.8}  
    ],
    kyushu: [
        {lat: 33.9, lng: 130.9}, 
        {lat: 33.2, lng: 131.8}, 
        {lat: 32.6, lng: 131.8}, 
        {lat: 31.5, lng: 131.5}, 
        {lat: 31.0, lng: 130.6}, 
        {lat: 31.3, lng: 130.2}, 
        {lat: 32.0, lng: 130.6}, 
        {lat: 32.9, lng: 130.1}, 
        {lat: 33.3, lng: 129.4}, 
        {lat: 33.9, lng: 130.0}, 
        {lat: 33.9, lng: 130.5}  
    ]
};

let camera = {
    x: 0, y: 0,
    zoom: 1.0, minZoom: 0.6, maxZoom: 15.0 
};

let isDragging = false;
let startDragOffset = { x: 0, y: 0 };
let dragDistance = 0;

function convertLatLngToXY(lat, lng, width, height) {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
    const y = (1 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat))) * height;
    return { x, y };
}

function getScreenXY(mapX, mapY) {
    const screenX = (mapX - canvas.width / 2 + camera.x) * camera.zoom + canvas.width / 2;
    const screenY = (mapY - canvas.height / 2 + camera.y) * camera.zoom + canvas.height / 2;
    return { x: screenX, y: screenY };
}

function getMapSpaceCoordinates(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const screenX = (clientX - rect.left) * scaleX;
    const screenY = (clientY - rect.top) * scaleY;
    const mapX = (screenX - canvas.width / 2) / camera.zoom + canvas.width / 2 - camera.x;
    const mapY = (screenY - canvas.height / 2) / camera.zoom + canvas.height / 2 - camera.y;
    return { x: mapX, y: mapY };
}

function drawIsland(points) {
    if(points.length === 0) return;
    const startPt = convertLatLngToXY(points[0].lat, points[0].lng, canvas.width, canvas.height);
    ctx.moveTo(startPt.x, startPt.y);
    for(let i = 1; i < points.length; i++) {
        const pt = convertLatLngToXY(points[i].lat, points[i].lng, canvas.width, canvas.height);
        ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
}

function drawMap() {
    ctx.fillStyle = '#1a222d'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.translate(camera.x, camera.y);

    
    ctx.fillStyle = '#2c3a4a'; 
    ctx.strokeStyle = '#3d5166'; 
    ctx.lineWidth = 1.5 / camera.zoom; 
    
    ctx.beginPath();
    drawIsland(japanTopology.honshu);
    drawIsland(japanTopology.shikoku);
    drawIsland(japanTopology.kyushu);
    ctx.fill();
    ctx.stroke();

    
    ctx.strokeStyle = 'rgba(50, 68, 86, 0.4)';
    ctx.lineWidth = 1 / camera.zoom;
    for (let l = 130; l <= 141; l += 1) {
        const pt1 = convertLatLngToXY(mapBounds.minLat, l, canvas.width, canvas.height);
        const pt2 = convertLatLngToXY(mapBounds.maxLat, l, canvas.width, canvas.height);
        ctx.beginPath(); ctx.moveTo(pt1.x, pt1.y); ctx.lineTo(pt2.x, pt2.y); ctx.stroke();
    }

    
    ctx.strokeStyle = 'rgba(241, 196, 15, 0.75)'; 
    ctx.lineWidth = 3.5 / camera.zoom; 
    ctx.lineCap = 'round';
    ctx.beginPath();
    castles.forEach(castle => {
        if (castle.neighbors && Array.isArray(castle.neighbors)) {
            castle.neighbors.forEach(neighborId => {
                if (neighborId > castle.id) {
                    const neighbor = castles.find(c => c.id === neighborId);
                    if (neighbor && (castle.owner !== neighbor.owner || castle.owner === 'ronin' || neighbor.owner === 'ronin')) {
                        ctx.moveTo(castle.x, castle.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                    }
                }
            });
        }
    });
    ctx.stroke();

    
    castles.forEach(castle => {
        if (!castle.neighbors || castle.owner === 'ronin') return;
        
        castle.neighbors.forEach(neighborId => {
            if (neighborId > castle.id) {
                const neighbor = castles.find(c => c.id === neighborId);
                if (neighbor && castle.owner === neighbor.owner) {
                    const ownerInfo = getCastleOwnerInfo(castle.id);
                    if (ownerInfo && ownerInfo.color) {
                        ctx.beginPath();
                        ctx.moveTo(castle.x, castle.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.strokeStyle = ownerInfo.color; 
                        ctx.lineWidth = 3.5 / camera.zoom; 
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    }
                }
            }
        });
    });

    ctx.restore();

    
    let fontSize = 0;
    let armyFontSize = 0;       
    let armyNumberFontSize = 0; 
    let showText = true;

    if (camera.zoom < 1.5) { 
        showText = false; 
    } else if (camera.zoom < 4.0) { 
        fontSize = 12; 
        armyFontSize = 12;       
        armyNumberFontSize = 0; 
    } else { 
        fontSize = 16; 
        armyFontSize = 16;       
        armyNumberFontSize = 16; 
    }

    
    castles.forEach(castle => {
        const sPt = getScreenXY(castle.x, castle.y);
        if (sPt.x < -100 || sPt.x > canvas.width + 100 || sPt.y < -100 || sPt.y > canvas.height + 100) return;

        
        if (selectedCastle && selectedCastle.id === castle.id) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(sPt.x, sPt.y, 12, 0, Math.PI * 2);
            ctx.stroke();
        }

        
        const currentOwnerInfo = getCastleOwnerInfo(castle.id);
        ctx.fillStyle = currentOwnerInfo ? currentOwnerInfo.color : '#7f8c8d'; 
        
        ctx.beginPath();
        ctx.arc(sPt.x, sPt.y, 7, 0, Math.PI * 2);
        ctx.fill();

        
        if (showText) {
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            const textWidth = ctx.measureText(castle.name).width + 8;
            const rectHeight = fontSize + 4;
            
            ctx.fillStyle = 'rgba(15, 20, 26, 0.9)'; 
            const offset = 28; 
            ctx.fillRect(sPt.x - textWidth / 2, sPt.y - offset, textWidth, rectHeight);

            ctx.fillStyle = '#ffffff';
            ctx.fillText(castle.name, sPt.x, sPt.y - (offset - fontSize + 2));
        }
    });
}


canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startDragOffset = { x: e.clientX - camera.x, y: e.clientY - camera.y };
    dragDistance = 0;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    camera.x = e.clientX - startDragOffset.x;
    camera.y = e.clientY - startDragOffset.y;
    dragDistance += Math.hypot(e.movementX, e.movementY);
    drawMap();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
        camera.zoom = Math.min(camera.maxZoom, camera.zoom * zoomFactor);
    } else {
        camera.zoom = Math.max(camera.minZoom, camera.zoom / zoomFactor);
    }
    drawMap();
}, { passive: false });



canvas.addEventListener('click', (e) => {
    
    if (dragDistance > 5) return;

    const mPt = getMapSpaceCoordinates(e.clientX, e.clientY);
    let clickedCastle = null;
    let minDist = 15; 

    castles.forEach(castle => {
        const dist = Math.hypot(mPt.x - castle.x, mPt.y - castle.y);
        if (dist < minDist) {
            minDist = dist;
            clickedCastle = castle;
        }
    });

    if (clickedCastle) {
        
        if (selectedCastle && selectedCastle.owner === playerDaimyoId && selectedCastle.id !== clickedCastle.id) {
            handleDynamicDestinationSelect(clickedCastle.id);
            drawMap();
            return; 
        }

        
        selectedCastle = clickedCastle;
        updateSidebar();
        drawMap();
    }
});