



if (typeof playerDaimyoId === 'undefined') {
    window.playerDaimyoId = "oda"; 
}

function initCoordinates() {
    
    initDaimyoArmies();

    castles.forEach(castle => {
        const pt = convertLatLngToXY(castle.lat, castle.lng, canvas.width, canvas.height);
        castle.x = pt.x;
        castle.y = pt.y;
        
        const initialOwner = getCastleOwnerInfo(castle.id);
        castle.owner = initialOwner.id;
    });
    
    
    initStartDaimyoSelect();
    
    
    const initialFocus = castles.find(c => c.id === 49); 
    if (initialFocus) {
        camera.x = canvas.width / 2 - initialFocus.x;
        camera.y = canvas.height / 2 - initialFocus.y;
    }
    document.getElementById('total-castles-count').innerText = castles.length;
}


function initStartDaimyoSelect() {
    const selectEl = document.getElementById('player-select-daimyo');
    if (!selectEl) return;
    selectEl.innerHTML = '';

    if (typeof generalsData !== 'undefined' && Array.isArray(generalsData)) {
        generalsData.forEach(g => {
            if (g.id !== 'ronin') { 
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = g.name;
                if (g.id === 'oda') opt.selected = true; 
                selectEl.appendChild(opt);
            }
        });
    }
}


function startGameWithSelectedDaimyo() {
    const selectEl = document.getElementById('player-select-daimyo');
    if (!selectEl) return;

    playerDaimyoId = selectEl.value; 
    const playerDaimyo = getDaimyoInfo(playerDaimyoId);
    const daimyoName = playerDaimyo ? playerDaimyo.name : '自勢力';

    
    if (playerDaimyo && playerDaimyo.ownedCastles && playerDaimyo.ownedCastles.length > 0) {
        const homeCastle = castles.find(c => c.id === playerDaimyo.ownedCastles[0]);
        if (homeCastle) {
            camera.x = canvas.width / 2 - homeCastle.x;
            camera.y = canvas.height / 2 - homeCastle.y;
        }
    }

    
    document.getElementById('start-modal-overlay').style.display = 'none';
    addLog(`${daimyoName}家を率いて日ノ本の覇権を掴みましょう！`);
    addLog(`=== ターン 1 開始 ===`);
    updateSidebar();
    drawMap();
}


canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragDistance = 0;
    startDragOffset.x = e.clientX - camera.x * camera.zoom;
    startDragOffset.y = e.clientY - camera.y * camera.zoom;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDistance++;
    camera.x = (e.clientX - startDragOffset.x) / camera.zoom;
    camera.y = (e.clientY - startDragOffset.y) / camera.zoom;
    drawMap();
});

window.addEventListener('mouseup', () => { 
    isDragging = false; 
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.15;
    const mousePosBefore = getMapSpaceCoordinates(e.clientX, e.clientY);

    if (e.deltaY < 0) {
        camera.zoom = Math.min(camera.maxZoom, camera.zoom * zoomFactor);
    } else {
        camera.zoom = Math.max(camera.minZoom, camera.zoom / zoomFactor);
    }

    const mousePosAfter = getMapSpaceCoordinates(e.clientX, e.clientY);
    camera.x += (mousePosAfter.x - mousePosBefore.x);
    camera.y += (mousePosAfter.y - mousePosBefore.y);

    drawMap();
}, { passive: false });

canvas.addEventListener('mouseup', (e) => {
    if (dragDistance > 5) return; 

    const mapPos = getMapSpaceCoordinates(e.clientX, e.clientY);
    let clickedCastle = null;
    
    castles.forEach(castle => {
        const dist = Math.hypot(castle.x - mapPos.x, castle.y - mapPos.y);
        const activeRadius = 20 / camera.zoom; 
        if (dist < activeRadius) {
            clickedCastle = castle;
        }
    });

    if (clickedCastle) {
        
        if (selectedCastle && selectedCastle.owner === playerDaimyoId && selectedCastle.id !== clickedCastle.id) {
            
            handleDynamicDestinationSelect(clickedCastle.id);
        } else {
            
            selectedCastle = clickedCastle;
            updateSidebar();
        }
        drawMap();
    }
});





/**
 * プレイヤー（大名軍）の行動指示を確定・ロックする共通関数
 * 各種ボタンのクリックイベント（出陣、駐留など）から呼び出します。
 * @param {string} actionType - "attack" (出陣) または "defend" (駐留防衛)
 * @param {Object} details - { from: 城ID, target: 城ID } または { castleId: 城ID }
 */
function commandAndLockAction(actionType, details) {
    
    const g = generalsData.find(gen => gen.id === playerDaimyoId);
    if (!g) return;

    
    if (g.isLocked) {
        console.warn(`${g.name}軍は既に行動を確定しています。`);
        return;
    }

    
    g.armyAction = actionType;
    g.isLocked = true; 

    if (actionType === "attack") {
        g.fromCastleId = details.from;
        g.targetCastleId = details.target;
        g.defendingCastleId = null;
        addLog(`【軍令】${g.name}軍が攻撃指示を受け、出陣しました。（変更不可）`);
    } else if (actionType === "defend") {
        g.defendingCastleId = details.castleId;
        g.fromCastleId = null;
        g.targetCastleId = null;
        addLog(`【軍令】${g.name}軍が拠点の防衛に就きました。（変更不可）`);
    }

    
    updateSidebar();
    drawMap();
}

/**
 * 「戦略を終え、時を進める」ボタンが押された際のメイン処理
 * ※現在HTML側のボタンに割り当てられている関数、または新設する処理です。
 */
function handleProceedTurn() {
    const g = generalsData.find(gen => gen.id === playerDaimyoId);
    
    
    

    
    addLog(`【次ターン】時が進み、新たな軍略フェーズに移行しました。`);

    
    generalsData.forEach(gen => {
        gen.isLocked = false;
    });

    
    updateSidebar();
    drawMap();
}


document.addEventListener('DOMContentLoaded', () => {
    const proceedBtn = document.getElementById('proceed-turn-btn'); 
    if (proceedBtn) {
        proceedBtn.addEventListener('click', handleProceedTurn);
    }
});



initCoordinates();
drawMap();
updateSidebar();