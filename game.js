
let currentTurn = 1;
let selectedCastle = null;
let playerDaimyoId = '';
let playerCommandPoints = 0; 


function calculateMaxCommandPoints(daimyoId) {
    const daimyo = getDaimyoInfo(daimyoId);
    if (!daimyo || !daimyo.ownedCastles) return 1;
    return Math.ceil(daimyo.ownedCastles.length / 10) + 1;
}


function initDaimyoArmies() {
    if (typeof generalsData !== 'undefined') {
        generalsData.forEach(g => {
            g.campaigns = []; 

            if (g.officers && g.ownedCastles && g.ownedCastles.length > 0) {
                g.officers.forEach((o, index) => {
                    o.isDaimyo = (index === 0); 
                });

                g.officers.forEach((officer, index) => {
                    
                    const castleIndex = index % g.ownedCastles.length;
                    officer.currentCastleId = g.ownedCastles[castleIndex];
                    officer.isActioned = false; 
                    
                    
                    
                    
                    if (officer.maxSoldiers === undefined) {
                        officer.maxSoldiers = 2000;
                    }
                    
                    if (officer.currentSoldiers === undefined) {
                        officer.currentSoldiers = Math.min(1000, officer.maxSoldiers);
                    }
                });
            }
        });
    }
}


function getOfficersAtCastle(castleId) {
    let list = [];
    generalsData.forEach(g => {
        if (g.officers) {
            g.officers.forEach(o => {
                if (o.currentCastleId === castleId) {
                    list.push({ ...o, daimyoId: g.id });
                }
            });
        }
    });
    return list;
}

function getDaimyoInfo(daimyoId) {
    return generalsData.find(g => g.id === daimyoId) || null;
}

function getCastleOwnerInfo(castleId) {
    const daimyo = generalsData.find(g => g.ownedCastles && g.ownedCastles.includes(castleId));
    return daimyo || { id: "ronin", name: "中立・国人衆", color: "#7f8c8d", officers: [] };
}

function isAdjacentToPlayer(castle) {
    if (!playerDaimyoId || castle.owner === playerDaimyoId) return false;
    if (!castle.neighbors) return false;
    return castle.neighbors.some(nId => {
        const n = castles.find(c => c.id === nId);
        return n && n.owner === playerDaimyoId;
    });
}

function addLog(msg) {
    const logBox = document.getElementById('log');
    if (!logBox) return;

    
    const newEntry = document.createElement('div');
    newEntry.innerHTML = `${msg}`;
    
    
    logBox.appendChild(newEntry);

    
    while (logBox.children.length > 100) {
        logBox.removeChild(logBox.firstChild);
    }

}


function updateSidebar() {
    if (!playerDaimyoId) return;

    const playerInfo = getDaimyoInfo(playerDaimyoId);
    if (!playerInfo) return;

    const playerCastles = castles.filter(c => c.owner === playerDaimyoId);
    const totalSoldiers = playerCastles.reduce((sum, c) => sum + c.currentSoldiers, 0);

    
    const elPlayerCastles = document.getElementById('player-castles');
    if (elPlayerCastles) elPlayerCastles.innerText = playerCastles.length;

    const elPlayerArmy = document.getElementById('player-army');
    if (elPlayerArmy) elPlayerArmy.innerText = totalSoldiers;

    const elCurrentTurn = document.getElementById('current-turn-display');
    if (elCurrentTurn) elCurrentTurn.innerText = `${currentTurn}`;

    
    const warningBox = document.getElementById('warning-box');
    const warningText = document.getElementById('warning-text');
    let warnings = [];
    generalsData.forEach(g => {
        if (g.id !== playerDaimyoId && g.campaigns) {
            g.campaigns.forEach(cp => {
                const tgt = castles.find(c => c.id === cp.targetCastleId);
                if (tgt && tgt.owner === playerDaimyoId) {
                    warnings.push(`⚠️ 敵軍 <strong>${cp.officerName}</strong> 隊（${cp.leadSoldiers.toLocaleString()}人）が <strong>${tgt.name}</strong> を包囲中！`);
                }
            });
        }
    });
    if (warningBox && warningText) {
        if (warnings.length > 0) {
            warningBox.style.display = "block";
            warningText.innerHTML = warnings.join("<br>");
        } else {
            warningBox.style.display = "none";
        }
    }

    const detailBox = document.getElementById('castle-detail');
    if (!selectedCastle) {
        if(detailBox) detailBox.innerHTML = `<p style="color: #bdc3c7;">マップ上の城を選択してください。</p>`;
        
        if (typeof updateRankingDisplay === 'function') {
            updateRankingDisplay();
        }
        return;
    }

    const isPlayerOwned = selectedCastle.owner === playerDaimyoId;
    const ownerInfo = getCastleOwnerInfo(selectedCastle.id);
    const officersHere = getOfficersAtCastle(selectedCastle.id);
    let myCampaignsHere = playerInfo.campaigns ? playerInfo.campaigns.filter(cp => cp.targetCastleId === selectedCastle.id) : [];

    let officersHtml = "";
    if (isPlayerOwned) {
        if (officersHere.length > 0) {
            officersHtml += `
                <div style="margin-bottom: 6px; display: flex; gap: 4px;">
                    <button class="btn" style="background: #34495e; padding: 4px 6px; font-size: 11px; margin: 0; width: auto; flex: 1; height: auto;" onclick="toggleAllOfficerCheckboxes(true)">全選択</button>
                    <button class="btn" style="background: #34495e; padding: 4px 6px; font-size: 11px; margin: 0; width: auto; flex: 1; height: auto;" onclick="toggleAllOfficerCheckboxes(false)">全解除</button>
                </div>
            `;

            officersHtml += officersHere.map(o => {
                const isCurrentlyCampaigning = playerInfo.campaigns && playerInfo.campaigns.some(cp => cp.officerName === o.name);
                const isDisabled = (o.daimyoId !== playerDaimyoId || o.isActioned || isCurrentlyCampaigning);
                const disabledAttr = isDisabled ? 'disabled' : '';
                
                let statusLabel = "";
                if (isCurrentlyCampaigning) {
                    statusLabel = " <span style='color:#e67e22;'>(遠征包囲中)</span>";
                } else if (o.isActioned) {
                    statusLabel = " <span style='color:#e74c3c;'>(行動済)</span>";
                }

                return `
                    <div style="margin:4px 0; display:flex; align-items:center;">
                        <input type="checkbox" class="officer-chk" value="${o.name}" ${disabledAttr} style="margin-right:6px; cursor:pointer;" onchange="handleSidebarCheckboxChange()">
                        <span style="font-size:12px;"><strong>${o.name}</strong> (武勇:${o.combat}/兵力:${o.currentSoldiers.toLocaleString()}人)${statusLabel}</span>
                    </div>
                `;
            }).join("");
        } else {
            officersHtml = "<div style='font-size:12px; color:#95a5a6;'>駐留武将なし</div>";
        }
    } else {
        if (myCampaignsHere.length > 0) {
            officersHtml = myCampaignsHere.map(cp => {
                const srcCastle = castles.find(c => c.id === cp.sourceCastleId);
                const srcName = srcCastle ? ` (${srcCastle.name}発)` : "";
                return `
                    <div style="margin:4px 0; font-size:12px; color:#ff7675;">
                        ⚔️ <strong>${cp.officerName}</strong> 隊${srcName} <br>
                        <span style="padding-left:14px; color:#bdc3c7;">(兵力: ${cp.leadSoldiers.toLocaleString()}人 / 武勇: ${cp.combat})</span>
                    </div>
                `;
            }).join("");
        } else {
            if (officersHere.length > 0) {
                officersHtml = officersHere.map(o => `
                    <div style="margin:4px 0; font-size:12px; color:#95a5a6;">
                        🛡️ <strong>${o.name}</strong> (武勇: ${o.combat} / 兵力:${o.currentSoldiers.toLocaleString()}人)
                    </div>
                `).join("");
            } else {
                officersHtml = "<div style='font-size:12px; color:#95a5a6;'>駐留武将なし</div>";
            }
        }
    }

    let actionButtons = "";
    if (isPlayerOwned) {
        actionButtons = `
            <div style="margin-top:8px; background:rgba(44, 62, 80, 0.6); padding:8px; border-radius:4px; border:1px solid #34495e; text-align:center;">
                <span style="font-size:11px; color:#bdc3c7; display:block; margin-bottom:4px;">💡 武将にチェックを入れ、マップ上の他の城を選択してください。</span>
                <div id="dynamic-action-container" style="margin-top:6px;"></div>
            </div>
        `;
    } else {
        if (myCampaignsHere.length > 0) {
            const isPreparing = myCampaignsHere.some(cp => cp.startTurn === currentTurn);
            if (isPreparing) {
                actionButtons = `
                    <button class="btn" style="background:#7f8c8d; cursor:not-allowed;" disabled>⏳ 部隊が包囲行軍中（次ターンより決戦可能）</button>
                    <button class="btn" style="background:#e74c3c; margin-top:4px;" onclick="cancelAttack退却(${selectedCastle.id})">包囲を解いて一斉退却</button>
                `;
            } else {
                actionButtons = `
                    <button class="btn" style="background:#d63031;" onclick="executeAttack決戦(${selectedCastle.id})">⚔️ 突撃決戦を開始！</button>
                    <button class="btn" style="background:#7f8c8d; margin-top:4px;" onclick="cancelAttack退却(${selectedCastle.id})">包囲を解いて一斉退却</button>
                `;
            }
        } else {
            actionButtons = `<button class="btn" style="background:#555;" disabled>包囲していません</button>`;
        }
    }

    if(detailBox) {
        
        const castleOwnerId = selectedCastle.owner; 
        
        const officersHere = getOfficersAtCastle(selectedCastle.id).filter(o => o.daimyoId === castleOwnerId);
        const totalCastleSoldiers = officersHere.reduce((sum, o) => sum + o.currentSoldiers, 0);

        detailBox.innerHTML = `
            <h3 style="color:#f1c40f; margin:0 0 4px 0; font-size:16px;">${selectedCastle.name}</h3>
            <p style="font-size:11px; color:#bdc3c7; margin:2px 0;">${selectedCastle.info}</p>
            <p style="margin:4px 0; font-size:12px;">支配勢力: <strong style="color:${ownerInfo.color};">${ownerInfo.name}</strong></p>
            <p style="margin:4px 0; font-size:12px;">駐留兵力: <span class="highlight" style="color: #55efc4; font-weight: bold;">${totalCastleSoldiers.toLocaleString()}</span> 人 (防衛力: ${selectedCastle.defense})</p>
            <div style="margin-top:8px; border-top:1px solid #34495e; padding-top:6px;">
                <span style="font-size:12px; color:#3498db; font-weight:bold;">🏯 ${isPlayerOwned ? '駐留中の所属武将一覧:' : '包囲部隊 / 敵守備武将:'}</span><br>
                <div style="margin-top:4px; padding:4px; background:rgba(0,0,0,0.2); border-radius:3px; max-height:120px; overflow-y:auto;">
                    ${officersHtml}
                </div>
            </div>
            ${actionButtons}
        `;
    }

    if (typeof updateRankingDisplay === 'function') {
        updateRankingDisplay();
    }
}




function updateRankingDisplay() {
    const rankingListEl = document.getElementById('ranking-list');
    if (!rankingListEl || typeof generalsData === 'undefined' || typeof castles === 'undefined') return;

    const daimyoPowerList = generalsData
        .filter(g => g.id !== 'ronin') 
        .map(g => {
            const castleSoldiers = castles
                .filter(c => c.owner === g.id)
                .reduce((sum, c) => sum + (c.currentSoldiers || 0), 0);

            const totalPower = g.officers ? g.officers.reduce((sum, o) => sum + (o.currentSoldiers || 0), 0) : 0;

            const isDefeated = (totalPower === 0);

            return {
                name: g.name,
                power: totalPower,
                isPlayer: g.id === playerDaimyoId,
                isDefeated: isDefeated
            };
        })
        .filter(d => !d.isDefeated);

    daimyoPowerList.sort((a, b) => b.power - a.power);

    const displayCount = Math.min(5, daimyoPowerList.length);
    const topDaimyos = daimyoPowerList.slice(0, displayCount);

    rankingListEl.innerHTML = topDaimyos.map((d, index) => {
        const style = d.isPlayer ? "color: #2ecc71; font-weight: bold;" : "color: #bdc3c7;";
        const prefix = d.isPlayer ? "▶ " : "";
        return `
            <div class="ranking-item" style="${style}">
                <span>${prefix}${d.name}家</span>
                <span>${d.power.toLocaleString()}人</span>
            </div>
        `;
    }).join("");
}




function toggleAllOfficerCheckboxes(checkAll) {
    
    const checkboxes = document.querySelectorAll('.officer-chk:not([disabled])');
    
    checkboxes.forEach(chk => {
        chk.checked = checkAll;
    });

    
    if (typeof handleSidebarCheckboxChange === 'function') {
        handleSidebarCheckboxChange();
    }
}

window.toggleAllOfficerCheckboxes = toggleAllOfficerCheckboxes;

function handleSidebarCheckboxChange() {
    if (!selectedCastle) return;
    const checkedBoxes = document.querySelectorAll('.officer-chk:checked');
    const container = document.getElementById('dynamic-action-container');
    if (container && checkedBoxes.length === 0) {
        container.innerHTML = '';
    }
}

function handleDynamicDestinationSelect(destCastleId) {
    const destCastle = castles.find(c => c.id === destCastleId);
    if (!destCastle) return;

    const checkedBoxes = document.querySelectorAll('.officer-chk:checked');
    
    if (checkedBoxes.length === 0 || !selectedCastle || selectedCastle.owner !== playerDaimyoId) {
        selectedCastle = destCastle;
        updateSidebar();
        if (typeof drawMap === 'function') drawMap();
        return;
    }

    const container = document.getElementById('dynamic-action-container');
    if (!container) return;

    if (destCastle.owner === playerDaimyoId) {
        container.innerHTML = `
            <button class="btn" style="background:#27ae60; padding:6px;" onclick="moveSelectedOfficers(${destCastleId})">
                🚀 チェックした武将を「${destCastle.name}」へ移動
            </button>
        `;
    } else {
        if (selectedCastle.neighbors && selectedCastle.neighbors.includes(destCastleId)) {
            container.innerHTML = `
                <button class="btn" style="background:#e67e22; padding:6px;" onclick="planAttack進軍(${selectedCastle.id}, ${destCastleId})">
                    ⚔️ チェックした武将を「${destCastle.name}」へ進軍（包囲）
                </button>
            `;
        } else {
            container.innerHTML = `<span style="color:#95a5a6; font-size:11px;">「${destCastle.name}」は隣接していないため進軍できません。</span>`;
        }
    }
}

window.handleDynamicDestinationSelect = handleDynamicDestinationSelect;

function createCPDisplayElement() {
    const statusEl = document.getElementById('player-army-status');
    if (!statusEl) return document.createElement('div');
    const parent = statusEl.parentNode;
    const div = document.createElement('div');
    div.id = 'player-command-points';
    div.style.margin = "6px 0";
    div.style.padding = "4px 8px";
    div.style.background = "#2c3e50";
    div.style.borderRadius = "4px";
    div.style.fontSize = "12px";
    parent.insertBefore(div, statusEl);
    return div;
}


function moveSelectedOfficers(targetCastleId) {
    const checkedBoxes = document.querySelectorAll('.officer-chk:checked');
    if (checkedBoxes.length === 0) return;

    const targetCastle = castles.find(c => c.id === targetCastleId);
    const playerInfo = getDaimyoInfo(playerDaimyoId);

    checkedBoxes.forEach(box => {
        const officer = playerInfo.officers.find(o => o.name === box.value);
        
        
        const isCurrentlyCampaigning = playerInfo.campaigns && playerInfo.campaigns.some(cp => cp.officerName === box.value);

        if (officer && !officer.isActioned && !isCurrentlyCampaigning) {
            officer.currentCastleId = targetCastleId;
            officer.isActioned = true; 
            addLog(`<strong>${officer.name}</strong>が${targetCastle.name}へ移動しました。`);
        }
    });

    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function planAttack進軍(srcCastleId, targetCastleId) {
    const checkedBoxes = document.querySelectorAll('.officer-chk:checked');
    if (checkedBoxes.length === 0) return;

    const targetCastle = castles.find(c => c.id === targetCastleId);
    const playerInfo = getDaimyoInfo(playerDaimyoId);

    checkedBoxes.forEach(box => {
        const officer = playerInfo.officers.find(o => o.name === box.value);
        
        
        const isCurrentlyCampaigning = playerInfo.campaigns && playerInfo.campaigns.some(cp => cp.officerName === box.value);
        if (!officer || officer.isActioned || isCurrentlyCampaigning) return;

        const lead = officer.currentSoldiers;
        if (lead <= 0) {
            addLog(`${officer.name}は出陣できません。`);
            return;
        }

        officer.isActioned = true; 

        playerInfo.campaigns.push({
            officerName: officer.name,
            combat: officer.combat,
            leadSoldiers: lead, 
            sourceCastleId: srcCastleId,
            targetCastleId: targetCastleId,
            startTurn: currentTurn
        });

        addLog(`<strong>${officer.name}</strong>が${targetCastle.name}を包囲！`);
    });

    selectedCastle = targetCastle;
    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function cancelAttack退却(targetCastleId) {
    const playerInfo = getDaimyoInfo(playerDaimyoId);
    if (!playerInfo || !playerInfo.campaigns) return;

    const myCampaigns = playerInfo.campaigns.filter(cp => cp.targetCastleId === targetCastleId);
    myCampaigns.forEach(cp => {
        const officer = playerInfo.officers.find(o => o.name === cp.officerName);
        if (officer) {
            officer.currentSoldiers = cp.leadSoldiers;
        }
        addLog(`<strong>${cp.officerName}</strong>隊が包囲を解き、元の城へ帰還しました。`);
    });

    playerInfo.campaigns = playerInfo.campaigns.filter(cp => cp.targetCastleId !== targetCastleId);
    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function calculateBattleDamageByTotalPower(atkTotalPower, defTotalPower, totalAtkSoldiers, totalDefSoldiers) {
    
    const powerRatio = atkTotalPower / Math.max(1, defTotalPower);

    
    let atkLossRatio = 0.4 * (1 / powerRatio);
    let defLossRatio = 0.4 * powerRatio;

    
    atkLossRatio = Math.max(0, atkLossRatio);
    defLossRatio = Math.max(0, defLossRatio);

    
    let atkLoss = Math.floor(totalAtkSoldiers * atkLossRatio * (0.8 + Math.random() * 0.4));
    let defLoss = Math.floor(totalDefSoldiers * defLossRatio * (0.8 + Math.random() * 0.4));

    return {
        atkLoss: Math.min(totalAtkSoldiers, Math.max(10, atkLoss)),
        defLoss: Math.min(totalDefSoldiers, Math.max(10, defLoss))
    };
}


function handleDefendingOfficersOnFall(castle, attackerDaimyoId) {
    const defenderDaimyo = getCastleOwnerInfo(castle.id);
    if (defenderDaimyo.id === 'ronin' || !defenderDaimyo.officers) return;

    const defOfficers = defenderDaimyo.officers.filter(o => o.currentCastleId === castle.id);
    if (defOfficers.length === 0) return;

    let safeCastleId = null;
    if (castle.neighbors && defenderDaimyo.ownedCastles) {
        const safeCastle = castle.neighbors.find(nId => defenderDaimyo.ownedCastles.includes(nId));
        if (safeCastle) safeCastleId = safeCastle;
    }

    if (safeCastleId) {
        const safeCastleObj = castles.find(c => c.id === safeCastleId);
        defOfficers.forEach(o => {
            o.currentCastleId = safeCastleId;
            o.isActioned = true; 
        });
    } else {
        const attackerDaimyo = getDaimyoInfo(attackerDaimyoId);
        defOfficers.forEach(o => {
            defenderDaimyo.officers = defenderDaimyo.officers.filter(oldO => oldO.name !== o.name);
            o.currentCastleId = castle.id;
            o.isActioned = true;
            o.currentSoldiers = Math.min(o.maxSoldiers, 2000); 
            if (attackerDaimyo) {
                attackerDaimyo.officers.push(o);
                addLog(`<strong>${o.name}</strong>は、<strong>${attackerDaimyo.name}</strong>家の配下に加わりました！`);
            }
        });
    }
}


function executeAttack決戦(targetCastleId) {
    const playerInfo = getDaimyoInfo(playerDaimyoId);
    if (!playerInfo || !playerInfo.campaigns) return;

    const target = castles.find(c => c.id === targetCastleId);
    const enemyDaimyo = getCastleOwnerInfo(target.id);
    
    const myCampaigns = playerInfo.campaigns.filter(cp => cp.targetCastleId === targetCastleId);
    if (myCampaigns.length === 0) return;

    
    if (myCampaigns.some(cp => cp.startTurn === currentTurn)) {
        addLog("包囲したばかりのターンには決戦を行えません。");
        return;
    }

    
    let atkTotalPower = myCampaigns.reduce((sum, cp) => sum + (cp.combat * cp.leadSoldiers), 0);
    let totalAtkSoldiers = myCampaigns.reduce((sum, cp) => sum + cp.leadSoldiers, 0);

    
    const enemyOfficersAtCastle = getOfficersAtCastle(target.id).filter(o => {
        if (o.daimyoId !== enemyDaimyo.id) return false;
        const isAway = enemyDaimyo.campaigns && enemyDaimyo.campaigns.some(cp => cp.officerName === o.name);
        return !isAway;
    });

    
    let defTotalPower = enemyOfficersAtCastle.reduce((sum, o) => sum + (o.combat * o.currentSoldiers), 0);

    let totalDefSoldiers = enemyOfficersAtCastle.reduce((sum, o) => sum + o.currentSoldiers, 0);

    addLog(`${target.name}総突撃！`);
    addLog(`攻方兵力: <strong style="color:#e74c3c;">${totalAtkSoldiers.toLocaleString()}人</strong>`);
    addLog(`守方兵力: <strong style="color:#3498db;">${totalDefSoldiers.toLocaleString()}人</strong>`);

    
    
    
    const dmg = calculateBattleDamageByTotalPower(atkTotalPower, defTotalPower, totalAtkSoldiers, totalDefSoldiers);

    
    let remainingAtkArmy = 0;
    myCampaigns.forEach(cp => {
        const shareRatio = totalAtkSoldiers > 0 ? (cp.leadSoldiers / totalAtkSoldiers) : 0;
        const loss = Math.floor(dmg.atkLoss * shareRatio);
        cp.leadSoldiers = Math.max(0, cp.leadSoldiers - loss);
        remainingAtkArmy += cp.leadSoldiers;

        const officer = playerInfo.officers.find(o => o.name === cp.officerName);
        if (officer) officer.currentSoldiers = cp.leadSoldiers;
    });

    
    if (totalDefSoldiers > 0) {
        const defLossRatio = dmg.defLoss / totalDefSoldiers;
        
        const castleLoss = Math.floor(target.currentSoldiers * defLossRatio);
        target.currentSoldiers = Math.max(0, target.currentSoldiers - castleLoss);

        enemyOfficersAtCastle.forEach(o => {
            const officerLoss = Math.floor(o.currentSoldiers * defLossRatio);
            o.currentSoldiers = Math.max(0, o.currentSoldiers - officerLoss);
            
            const rawOfficer = enemyDaimyo.officers.find(ro => ro.name === o.name);
            if (rawOfficer) rawOfficer.currentSoldiers = o.currentSoldiers;
        });
    } else {
        target.currentSoldiers = Math.max(0, target.currentSoldiers - dmg.defLoss);
    }

    totalDefSoldiers = enemyOfficersAtCastle.reduce((sum, o) => sum + o.currentSoldiers, 0);

    addLog(`自軍損害: -${dmg.atkLoss.toLocaleString()}人 | 敵軍損害: -${dmg.defLoss.toLocaleString()}人`);

    
    let isDaimyoCapturedAndDefeated = false;

    const daimyoOfficer = enemyOfficersAtCastle.find(o => o.isDaimyo === true && o.daimyoId === enemyDaimyo.id);
    const realDaimyoName = daimyoOfficer ? daimyoOfficer.name : "不明";
    if (daimyoOfficer && daimyoOfficer.currentSoldiers <= 0 && enemyDaimyo.id !== 'ronin') {
        let safeCastleId = null;
        if (target.neighbors && enemyDaimyo.ownedCastles) {
            safeCastleId = target.neighbors.find(nId => enemyDaimyo.ownedCastles.includes(nId) && nId !== target.id);
        }

        if (safeCastleId) {
            const safeCastleObj = castles.find(c => c.id === safeCastleId);
            addLog(`<strong>${enemyDaimyo.name}</strong>は<strong>${safeCastleObj.name}</strong>へ逃げ延びました！`);
        } else {
            isDaimyoCapturedAndDefeated = true;
            addLog(`<strong>${enemyDaimyo.name}</strong>家当主は捕らえられました！`);
        }
    }

    if (totalDefSoldiers <= 0 || isDaimyoCapturedAndDefeated) {
        addLog(`${target.name} を制圧しました！`);

        if (!isDaimyoCapturedAndDefeated) {
            handleDefendingOfficersOnFall(target, playerDaimyoId);
        }

        if (enemyDaimyo.ownedCastles) {
            enemyDaimyo.ownedCastles = enemyDaimyo.ownedCastles.filter(id => id !== target.id);
        }
        playerInfo.ownedCastles.push(target.id);
        target.owner = playerDaimyoId;

        myCampaigns.forEach(cp => {
            const officer = playerInfo.officers.find(o => o.name === cp.officerName);
            if (officer) officer.currentCastleId = target.id;
        });
        
        target.currentSoldiers = remainingAtkArmy; 

        if (enemyDaimyo.id !== 'ronin' && (isDaimyoCapturedAndDefeated || !enemyDaimyo.ownedCastles || enemyDaimyo.ownedCastles.length === 0)) {
            addLog(`<strong>${enemyDaimyo.name}</strong>家が滅亡しました！`);
            clearDaimyoCampaigns(enemyDaimyo);
            if (enemyDaimyo.ownedCastles && enemyDaimyo.ownedCastles.length > 0) {
                enemyDaimyo.ownedCastles.forEach(castleId => {
                    const c = castles.find(castle => castle.id === castleId);
                    if (c) {
                        c.owner = playerDaimyoId;
                        playerInfo.ownedCastles.push(c.id);
                        addLog(`<strong>${c.name}</strong>が引き渡されました。`);
                    }
                });
                enemyDaimyo.ownedCastles = [];
            }

            if (enemyDaimyo.officers && enemyDaimyo.officers.length > 0) {
                enemyDaimyo.officers.forEach(o => {
                    if (o.currentCastleId === target.id || isDaimyoCapturedAndDefeated) {
                        o.currentCastleId = target.id; 
                    }
                    o.isActioned = true; 

                    if (o.maxSoldiers === undefined) {
                        o.maxSoldiers = 2000;
                    }
                    o.currentSoldiers = o.maxSoldiers * 0.5; 

                    o.isDaimyo = false; 
                    o.daimyoId = playerDaimyoId; 

                    playerInfo.officers.push(o);
                    addLog(`<strong>${o.name}</strong>が配下に加わりました！`);
                });
                enemyDaimyo.officers = [];
            }
        }
    } else {
        addLog(`敵城を崩せず、包囲部隊は帰還しました。`);
    }

    playerInfo.campaigns = playerInfo.campaigns.filter(cp => cp.targetCastleId !== targetCastleId);
    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function processNPCTurns() {
    generalsData.forEach(g => {
        if (g.id === playerDaimyoId || g.id === 'ronin') return;
        if (!g.ownedCastles || g.ownedCastles.length === 0) return;

        
        if (g.campaigns && g.campaigns.length > 0) {
            
            const activeCampaigns = [...g.campaigns];
            activeCampaigns.forEach(cp => {
                const target = castles.find(c => c.id === cp.targetCastleId);
                if (!target) return;

                const targetDaimyo = getCastleOwnerInfo(target.id);
                const defOfficersAtCastle = getOfficersAtCastle(target.id).filter(o => {
                    if (o.daimyoId !== targetDaimyo.id) return false;
                    const isAway = targetDaimyo.campaigns && targetDaimyo.campaigns.some(tcp => tcp.officerName === o.name);
                    return !isAway;
                });

                let atkTotalPower = cp.combat * cp.leadSoldiers;
                let defTotalPower = defOfficersAtCastle.reduce((sum, o) => sum + (o.combat * o.currentSoldiers), 0);
                let totalDefSoldiers = defOfficersAtCastle.reduce((sum, o) => sum + o.currentSoldiers, 0);

                addLog(`<strong>${cp.officerName}</strong>が<strong>${target.name}</strong>へ攻撃！`);

                const dmg = calculateBattleDamageByTotalPower(atkTotalPower, defTotalPower, cp.leadSoldiers, totalDefSoldiers);
                
                
                if (cp.participatingOfficers && cp.participatingOfficers.length > 0) {
                    const totalAtkInitial = cp.participatingOfficers.reduce((sum, po) => sum + po.initialSoldiers, 0);
                    cp.participatingOfficers.forEach(po => {
                        const shareRatio = totalAtkInitial > 0 ? (po.initialSoldiers / totalAtkInitial) : 0;
                        const loss = Math.floor(dmg.atkLoss * shareRatio);
                        const actualOff = g.officers.find(o => o.name === po.name);
                        if (actualOff) {
                            actualOff.currentSoldiers = Math.max(0, actualOff.currentSoldiers - loss);
                        }
                    });
                    cp.leadSoldiers = Math.max(0, cp.leadSoldiers - dmg.atkLoss);
                } else {
                    cp.leadSoldiers = Math.max(0, cp.leadSoldiers - dmg.atkLoss);
                    const off = g.officers.find(o => o.name === cp.officerName);
                    if (off) off.currentSoldiers = cp.leadSoldiers;
                }

                
                if (totalDefSoldiers > 0) {
                    const defLossRatio = dmg.defLoss / totalDefSoldiers;
                    target.currentSoldiers = Math.max(0, target.currentSoldiers - Math.floor(target.currentSoldiers * defLossRatio));
                    
                    defOfficersAtCastle.forEach(o => {
                        o.currentSoldiers = Math.max(0, o.currentSoldiers - Math.floor(o.currentSoldiers * defLossRatio));
                        const rawOfficer = targetDaimyo.officers.find(ro => ro.name === o.name);
                        if (rawOfficer) rawOfficer.currentSoldiers = o.currentSoldiers;
                    });
                } else {
                    target.currentSoldiers = Math.max(0, target.currentSoldiers - dmg.defLoss);
                }

                totalDefSoldiers = defOfficersAtCastle.reduce((sum, o) => sum + o.currentSoldiers, 0);

                
                let isDaimyoCapturedAndDefeated = false;
                const daimyoOfficer = defOfficersAtCastle.find(o => o.isDaimyo === true && o.daimyoId === targetDaimyo.id);
                if (daimyoOfficer && daimyoOfficer.currentSoldiers <= 0 && targetDaimyo.id !== 'ronin') {
                    let safeCastleId = null;
                    if (target.neighbors && targetDaimyo.ownedCastles) {
                        safeCastleId = target.neighbors.find(nId => targetDaimyo.ownedCastles.includes(nId) && nId !== target.id);
                    }

                    if (safeCastleId) {
                        const safeCastleObj = castles.find(c => c.id === safeCastleId);
                        if (target.owner === playerDaimyoId) {
                        }
                    } else {
                        isDaimyoCapturedAndDefeated = true;
                        addLog(`<strong>${targetDaimyo.name}</strong>家当主は捕らえられました！`);
                    }
                }

                
                if (totalDefSoldiers <= 0 || isDaimyoCapturedAndDefeated) {
                    if (target.owner === playerDaimyoId) {
                        addLog(`<strong>${target.name}</strong>が陥落しました…`);
                        if (!isDaimyoCapturedAndDefeated) {
                            handleDefendingOfficersOnFall(target, g.id);
                        }
                        const pDaimyo = getDaimyoInfo(playerDaimyoId);
                        pDaimyo.ownedCastles = pDaimyo.ownedCastles.filter(id => id !== target.id);
                    } else {
                        if (!isDaimyoCapturedAndDefeated) {
                            handleDefendingOfficersOnFall(target, g.id);
                        }
                        if (targetDaimyo.ownedCastles) {
                            targetDaimyo.ownedCastles = targetDaimyo.ownedCastles.filter(id => id !== target.id);
                        }
                    }

                    g.ownedCastles.push(target.id);
                    target.owner = g.id;
                    target.currentSoldiers = cp.leadSoldiers; 

                    if (cp.participatingOfficers && cp.participatingOfficers.length > 0) {
                        cp.participatingOfficers.forEach(po => {
                            const actualOff = g.officers.find(o => o.name === po.name);
                            if (actualOff && actualOff.currentSoldiers > 0) {
                                actualOff.currentCastleId = target.id;
                            }
                        });
                    } else {
                        const off = g.officers.find(o => o.name === cp.officerName);
                        if (off) off.currentCastleId = target.id;
                    }

                    
                    if (targetDaimyo.id !== 'ronin' && (isDaimyoCapturedAndDefeated || !targetDaimyo.ownedCastles || targetDaimyo.ownedCastles.length === 0)) {
                        addLog(`<strong>${targetDaimyo.name}</strong>家が滅亡しました！`);
                        clearDaimyoCampaigns(targetDaimyo);                        
                        if (targetDaimyo.ownedCastles && targetDaimyo.ownedCastles.length > 0) {
                            targetDaimyo.ownedCastles.forEach(castleId => {
                                const c = castles.find(castle => castle.id === castleId);
                                if (c) {
                                    c.owner = g.id;
                                    g.ownedCastles.push(c.id);
                                    addLog(`<strong>${c.name}</strong>が<strong>${g.name}</strong>家に引き渡されました。`);
                                }
                            });
                            targetDaimyo.ownedCastles = [];
                        }

                        if (targetDaimyo.officers && targetDaimyo.officers.length > 0) {
                            targetDaimyo.officers.forEach(o => {
                                if (o.currentCastleId === target.id || isDaimyoCapturedAndDefeated) {
                                    o.currentCastleId = target.id; 
                                }
                                o.isActioned = true; 

                                if (o.maxSoldiers === undefined) {
                                    o.maxSoldiers = 2000;
                                }
                                o.currentSoldiers = o.maxSoldiers * 0.5; 

                                o.isDaimyo = false; 
                                o.daimyoId = g.id; 

                                g.officers.push(o);
                                addLog(`<strong>${o.name}</strong>が<strong>${g.name}</strong>家の家臣となりました。`);
                            });
                            targetDaimyo.officers = [];
                        }
                    }
                } else {
                    if (target.owner === playerDaimyoId) {
                        addLog(`<strong>${target.name}</strong>の防衛に成功しました！`);
                    }
                }
            });
            g.campaigns = [];
            return;
        }

        
        function executeNPCMove(officerName, fromCastle, toCastle) {
            const rawOfficer = g.officers.find(o => o.name === officerName);
            if (!rawOfficer) return false;
            rawOfficer.currentCastleId = toCastle.id;
            rawOfficer.isActioned = true;
            return true;
        }

        let underAttackCastleIds = [];
        generalsData.forEach(otherG => {
            if (otherG.campaigns && otherG.campaigns.length > 0) {
                otherG.campaigns.forEach(oCp => {
                    if (g.ownedCastles.includes(oCp.targetCastleId)) {
                        underAttackCastleIds.push(oCp.targetCastleId);
                    }
                });
            }
        });

        if (underAttackCastleIds.length > 0) {
            for (let targetId of underAttackCastleIds) {
                let dangerCastle = castles.find(c => c.id === targetId);
                if (!dangerCastle) continue;
                for (let nId of dangerCastle.neighbors) {
                    if (g.ownedCastles.includes(nId) && !underAttackCastleIds.includes(nId)) {
                        let safeCastle = castles.find(c => c.id === nId);
                        if (!safeCastle) continue;
                        let safeOfficers = getOfficersAtCastle(safeCastle.id).filter(o => o.daimyoId === g.id && !o.isActioned);
                        if (safeOfficers.length > 0) {
                            let helper = safeOfficers[0];
                            executeNPCMove(helper.name, safeCastle, dangerCastle);
                        }
                    }
                }
            }
        }

        const myCastleIds = g.ownedCastles;
        const listA = myCastleIds.filter(id => {
            const c = castles.find(c => c.id === id);
            return c && c.neighbors.some(nId => castles.find(cc => cc.id === nId).owner !== g.id);
        });
        const listB = myCastleIds.filter(id => 
            !listA.includes(id) && 
            castles.find(c => c.id === id).neighbors.some(nId => listA.includes(nId))
        );

        
        for (let i = 0; i < g.ownedCastles.length; i++) {
            let myCastleId = g.ownedCastles[i];
            let myCastle = castles.find(c => c.id === myCastleId);
            if (!myCastle || !myCastle.neighbors) continue;
            if (underAttackCastleIds.includes(myCastleId)) continue;
            let officersHere = getOfficersAtCastle(myCastle.id).filter(o => o.daimyoId === g.id);
            if (officersHere.length === 0) continue;

            let shuffledNeighbors = myCastle.neighbors;
            if (g.officers.length > 10) {
                shuffledNeighbors = [...myCastle.neighbors].sort(() => Math.random() - 0.5);
            }
            for (let j = 0; j < myCastle.neighbors.length; j++) {
                
                let enemyTargetCastleId = shuffledNeighbors.slice(j).find(nId => {
                    let tc = castles.find(c => c.id === nId);
                    if (!tc || tc.owner === g.id) return false;

                    let enemyDaimyo = getCastleOwnerInfo(tc.id);
                    if (!enemyDaimyo || enemyDaimyo.id === 'ronin') return true;

                    const isEnemyAttackingFromThisCastle = enemyDaimyo.campaigns && enemyDaimyo.campaigns.some(cp => cp.sourceCastleId === tc.id);
                    return !isEnemyAttackingFromThisCastle;
                });

                if (enemyTargetCastleId) {
                    let validAttackers = officersHere.filter(o => !o.isActioned);
                    if (validAttackers.length > 0) {
                        let targetCastle = castles.find(c => c.id === enemyTargetCastleId);
                        let enemyDaimyo = getCastleOwnerInfo(targetCastle.id);

                        let atkTotalPower = validAttackers.reduce((sum, o) => sum + (o.combat * o.currentSoldiers), 0);
                        let totalLeadSoldiers = validAttackers.reduce((sum, o) => sum + o.currentSoldiers, 0);

                        const enemyOfficersAtCastle = getOfficersAtCastle(targetCastle.id).filter(o => {
                            if (o.daimyoId !== enemyDaimyo.id) return false;
                            return !(enemyDaimyo.campaigns && enemyDaimyo.campaigns.some(cp => cp.officerName === o.name));
                        });
                        let defTotalPower = enemyOfficersAtCastle.reduce((sum, o) => sum + (o.combat * o.currentSoldiers), 0);

                        if (atkTotalPower > defTotalPower) {
                            let leader = validAttackers.reduce((max, o) => o.combat > max.combat ? o : max, validAttackers[0]);
                        
                            if (!g.campaigns) g.campaigns = [];
                                g.campaigns.push({
                                officerName: leader.name, combat: leader.combat, leadSoldiers: totalLeadSoldiers,
                                sourceCastleId: myCastle.id, targetCastleId: enemyTargetCastleId, startTurn: currentTurn,
                                participatingOfficers: validAttackers.map(o => ({ name: o.name, initialSoldiers: o.currentSoldiers }))
                            });
                            validAttackers.forEach(o => o.isActioned = true);
                        
                        
                        }
                    }
                }
            }

            
            let idleOfficers = officersHere.filter(o => !o.isActioned);
            for (let traveler of idleOfficers) {
                let targetPool = [];
                if (myCastle.neighbors.some(nId => listA.includes(nId))) {
                    targetPool = myCastle.neighbors.filter(nId => listA.includes(nId));
                } else if (myCastle.neighbors.some(nId => listB.includes(nId))) {
                    targetPool = myCastle.neighbors.filter(nId => listB.includes(nId));
                } else {
                    targetPool = myCastle.neighbors.filter(nId => g.ownedCastles.includes(nId));
                }

                if (targetPool.length > 0) {
                    let randomTargetId = targetPool[Math.floor(Math.random() * targetPool.length)];
                    let destCastle = castles.find(c => c.id === randomTargetId);
                    executeNPCMove(traveler.name, myCastle, destCastle);
                }
            }
        }
    });
}


function endPlayerTurn() {
    const playerInfo = getDaimyoInfo(playerDaimyoId);
    if (!playerInfo) return;

    if (playerInfo.campaigns && playerInfo.campaigns.length > 0) {
        
        const expiredCampaigns = playerInfo.campaigns.filter(cp => cp.startTurn < currentTurn);

        expiredCampaigns.forEach(cp => {
            const officer = playerInfo.officers.find(o => o.name === cp.officerName);
            if (officer) {
                officer.currentSoldiers = cp.leadSoldiers; 
            }
            const srcCastle = castles.find(c => c.id === cp.sourceCastleId);
            const tgtCastle = castles.find(c => c.id === cp.targetCastleId);
            addLog(`<strong>${cp.officerName}</strong>隊は${srcCastle.name}へ帰還しました。`);
        });

        
        playerInfo.campaigns = playerInfo.campaigns.filter(cp => cp.startTurn === currentTurn);
    }

    processNPCTurns();

    
    generalsData.forEach(g => {
        if (g.officers) {
            g.officers.forEach(o => o.isActioned = false);
        }
    });

    
    
    
    generalsData.forEach(g => {
        if (g.officers) {
            g.officers.forEach(o => {
                
                const max = o.maxSoldiers || 2000; 
            
                
                const recoveryAmount = Math.floor(max * 0.1); 
            
                
                o.currentSoldiers = Math.min(max, o.currentSoldiers + recoveryAmount);
            });
        }
    });

    currentTurn++;
    addLog(`=== ターン ${currentTurn} 開始 ===`);
    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function directMoveOfficers(sourceCastleId, targetCastleId, officerNames) {
    const sourceCastle = castles.find(c => c.id === sourceCastleId);
    const targetCastle = castles.find(c => c.id === targetCastleId);
    if (!sourceCastle || !targetCastle) return;

    officerNames.forEach(name => {
        
        let foundOfficer = null;
        generalsData.forEach(g => {
            if (g.officers) {
                const o = g.officers.find(off => off.name === name);
                if (o) foundOfficer = o;
            }
        });

        
        if (foundOfficer && !foundOfficer.isActioned && foundOfficer.currentCastleId === sourceCastleId) {
            foundOfficer.currentCastleId = targetCastleId;
            foundOfficer.isActioned = true;
            addLog(`<strong>${foundOfficer.name}</strong>が${sourceCastle.name}から${targetCastle.name}へ移動しました。`);
        }
    });

    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}


function directLaunchAttack(sourceCastleId, targetCastleId, officerNames) {
    const sourceCastle = castles.find(c => c.id === sourceCastleId);
    const targetCastle = castles.find(c => c.id === targetCastleId);
    if (!sourceCastle || !targetCastle) return;

    const g = generalsData.find(gen => gen.id === sourceCastle.owner);
    if (!g) return;

    officerNames.forEach(name => {
        const officer = g.officers.find(o => o.name === name);
        if (!officer || officer.isActioned || officer.currentCastleId !== sourceCastleId) return;

        
        const isCurrentlyCampaigning = g.campaigns && g.campaigns.some(cp => cp.officerName === name);
        if (isCurrentlyCampaigning) return;

        const lead = officer.currentSoldiers;
        if (lead <= 0) return;

        officer.isActioned = true;

        if (!g.campaigns) g.campaigns = [];
        g.campaigns.push({
            officerName: officer.name,
            combat: officer.combat,
            leadSoldiers: lead,
            sourceCastleId: sourceCastleId,
            targetCastleId: targetCastleId,
            startTurn: currentTurn
        });

        addLog(`<strong>${officer.name}</strong>が${lead.toLocaleString()}人を率いて${targetCastle.name}を包囲！`);
    });

    selectedCastle = targetCastle;
    updateSidebar();
    if (typeof drawMap === 'function') drawMap();
}

function clearDaimyoCampaigns(daimyo) {
    if (!daimyo) return;
    
    
    daimyo.campaigns = [];
    
    
    daimyo.attackPrepared = false;
    daimyo.targetCastleId = null;

    
    if (daimyo.officers) {
        daimyo.officers.forEach(o => o.isActioned = true); 
    }
}