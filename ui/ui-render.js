import gameState from '../src/modules/game-state.js';
import { formatResource } from '../src/modules/resources-def.js';
import { buildingDefinitions, getBuildingCost, isBuildingUnlocked } from '../src/modules/buildings-def.js';
import { buyBuilding, demolishBuilding, expandBuildingSlots } from '../src/modules/buildings-system.js';

let lastRenderTime = 0;
const RENDER_INTERVAL = 100;
let activeCategory = 'all';
let lastCallsSnapshot = '';
let lastBuildingsSnapshot = '';

export function renderUI() {
    const now = Date.now();
    if (now - lastRenderTime < RENDER_INTERVAL) return;
    lastRenderTime = now;
    
    renderHeaderStats();
    renderCallsOptimized();
    renderUnitsStatus();
    renderStats();
    renderBuildingsOptimized();
    renderUnitsSummary();
}

function renderHeaderStats() {
    const budgetDisplay = document.getElementById('budget-display');
    const reputationDisplay = document.getElementById('reputation-display');
    const stressDisplay = document.getElementById('stress-display');
    
    if (budgetDisplay) {
        budgetDisplay.textContent = `Budget: ${formatResource(gameState.resources.budget)}€`;
    }
    if (reputationDisplay) {
        reputationDisplay.textContent = `Reputation: ${formatResource(gameState.resources.reputation)}`;
    }
    if (stressDisplay) {
        const stress = Math.floor(gameState.resources.stress);
        stressDisplay.textContent = `Stress: ${stress}%`;
        
        if (stress > 70) {
            stressDisplay.style.color = '#e74c3c';
        } else if (stress > 40) {
            stressDisplay.style.color = '#f39c12';
        } else {
            stressDisplay.style.color = '#27ae60';
        }
    }
}

function renderCallsOptimized() {
    const activeCalls = gameState.activeCalls;
    
    const currentSnapshot = JSON.stringify(activeCalls.map(c => ({
        id: c.id,
        status: c.status,
        expiresAt: c.expiresAt,
        autoDispatchAt: c.autoDispatchAt
    })));
    
    if (currentSnapshot === lastCallsSnapshot) {
        updateCallTimers();
        return;
    }
    
    lastCallsSnapshot = currentSnapshot;
    renderCalls();
}

function updateCallTimers() {
    const now = Date.now();
    const activeCalls = gameState.activeCalls;
    
    activeCalls.forEach((call, index) => {
        const timeLeft = Math.max(0, Math.floor((call.expiresAt - now) / 1000));
        const autoDispatchIn = Math.max(0, Math.floor((call.autoDispatchAt - now) / 1000));
        const callCards = document.querySelectorAll('.call-card');
        const callCard = callCards[index];
        
        if (callCard && call.status === 'waiting') {
            const timerElement = callCard.querySelector('.auto-dispatch-timer');
            if (timerElement) {
                if (autoDispatchIn > 0) {
                    timerElement.innerHTML = `🤖 Auto-dispatch in: <strong>${autoDispatchIn}s</strong>`;
                    timerElement.style.color = '#f39c12';
                } else {
                    timerElement.innerHTML = `🤖 Auto-dispatching...`;
                    timerElement.style.color = '#3498db';
                }
            }
            
            const detailsParagraphs = callCard.querySelectorAll('.call-details p');
            const timeParagraph = detailsParagraphs[2];
            
            if (timeParagraph) {
                timeParagraph.innerHTML = `<strong>Base:</strong> ${call.baseReward}€ | <strong>Time:</strong> ${timeLeft}s`;
            }
        }
    });
}

function renderCalls() {
    const callsList = document.getElementById('active-calls');
    if (!callsList) return;
    
    const activeCalls = gameState.activeCalls;
    
    if (activeCalls.length === 0) {
        callsList.innerHTML = `
            <div class="info-banner">
                <h3>🤖 Smart Dispatch Active</h3>
                <p>✅ You have 20 seconds to manually dispatch for bonus</p>
                <p>💰 Manual: <strong>+50% bonus</strong> | Perfect match: <strong>+75% bonus</strong></p>
                <p>🤖 After 20s: Auto-dispatch takes over automatically</p>
            </div>
            <p class="empty-state">No active emergency calls</p>
        `;
        return;
    }
    
    const now = Date.now();
    
    callsList.innerHTML = `
        <div class="info-banner">
            <p>⏱️ <strong>20s window</strong> for manual bonus | 💰 <strong>+50%</strong> manual (+75% perfect) | 🤖 Auto after 20s</p>
        </div>
    ` + activeCalls.map(call => {
        const timeLeft = Math.max(0, Math.floor((call.expiresAt - now) / 1000));
        const autoDispatchIn = Math.max(0, Math.floor((call.autoDispatchAt - now) / 1000));
        const isDispatched = call.status === 'dispatched';
        
        const baseReward = call.baseReward;
        const perfectBonus = Math.floor(baseReward * 1.75);
        const wrongUnitBonus = Math.floor(baseReward * 1.5);
        
        return `
            <div class="call-card ${call.type}">
                <div class="call-header">
                    <span class="call-title">${call.icon} ${call.name}</span>
                    <span class="call-urgency ${call.baseUrgency}">${call.baseUrgency.toUpperCase()}</span>
                </div>
                <div class="call-details">
                    <p>${call.description}</p>
                    <p><strong>Difficulty:</strong> ${'⭐'.repeat(call.baseDifficulty)} | <strong>Needs:</strong> ${call.requiredUnits} unit${call.requiredUnits > 1 ? 's' : ''}</p>
                    <p><strong>Base:</strong> ${baseReward}€ | <strong>Time:</strong> ${timeLeft}s</p>
                </div>
                ${isDispatched ? 
                    `<p style="color: #3498db; font-weight: 600;">✓ ${call.requiredUnits} unit${call.requiredUnits > 1 ? 's' : ''} en route...</p>` :
                    `<p class="auto-dispatch-timer" style="margin: 10px 0; font-weight: 600;">
                        ${autoDispatchIn > 0 ? 
                            `🤖 Auto-dispatch in: <strong>${autoDispatchIn}s</strong>` : 
                            `🤖 Auto-dispatching...`
                        }
                    </p>
                    <div class="call-actions">
                        <button class="dispatch-button police ${call.type === 'police' ? 'perfect-match' : ''}" 
                            data-call-id="${call.id}" data-unit-type="police"
                            ${gameState.units.police.available < call.requiredUnits ? 'disabled' : ''}>
                            🚓 Police (${gameState.units.police.available}/${call.requiredUnits})<br>
                            <small>${call.type === 'police' ? `⭐ ${perfectBonus}€` : `${wrongUnitBonus}€`}</small>
                        </button>
                        <button class="dispatch-button fire ${call.type === 'fire' ? 'perfect-match' : ''}" 
                            data-call-id="${call.id}" data-unit-type="fire"
                            ${gameState.units.fire.available < call.requiredUnits ? 'disabled' : ''}>
                            🚒 Fire (${gameState.units.fire.available}/${call.requiredUnits})<br>
                            <small>${call.type === 'fire' ? `⭐ ${perfectBonus}€` : `${wrongUnitBonus}€`}</small>
                        </button>
                        <button class="dispatch-button medical ${call.type === 'medical' ? 'perfect-match' : ''}" 
                            data-call-id="${call.id}" data-unit-type="medical"
                            ${gameState.units.medical.available < call.requiredUnits ? 'disabled' : ''}>
                            🚑 Medical (${gameState.units.medical.available}/${call.requiredUnits})<br>
                            <small>${call.type === 'medical' ? `⭐ ${perfectBonus}€` : `${wrongUnitBonus}€`}</small>
                        </button>
                    </div>`
                }
            </div>
        `;
    }).join('');
}

function renderUnitsStatus() {
    const elements = {
        policeAvailable: document.getElementById('police-available'),
        policeTotal: document.getElementById('police-total'),
        policeEfficiency: document.getElementById('police-efficiency'),
        fireAvailable: document.getElementById('fire-available'),
        fireTotal: document.getElementById('fire-total'),
        fireEfficiency: document.getElementById('fire-efficiency'),
        medicalAvailable: document.getElementById('medical-available'),
        medicalTotal: document.getElementById('medical-total'),
        medicalEfficiency: document.getElementById('medical-efficiency')
    };
    
    if (elements.policeAvailable) {
        elements.policeAvailable.textContent = gameState.units.police.available;
        elements.policeTotal.textContent = gameState.units.police.total;
        elements.policeEfficiency.textContent = gameState.units.police.efficiency.toFixed(1) + 'x';
        
        elements.fireAvailable.textContent = gameState.units.fire.available;
        elements.fireTotal.textContent = gameState.units.fire.total;
        elements.fireEfficiency.textContent = gameState.units.fire.efficiency.toFixed(1) + 'x';
        
        elements.medicalAvailable.textContent = gameState.units.medical.available;
        elements.medicalTotal.textContent = gameState.units.medical.total;
        elements.medicalEfficiency.textContent = gameState.units.medical.efficiency.toFixed(1) + 'x';
    }
}

function renderStats() {
    const elements = {
        successful: document.getElementById('successful-calls'),
        failed: document.getElementById('failed-calls'),
        successRate: document.getElementById('success-rate'),
        perfectMatches: document.getElementById('perfect-matches')
    };
    
    if (elements.successful) {
        const total = gameState.callHistory.successful + gameState.callHistory.failed;
        const rate = total > 0 ? Math.floor((gameState.callHistory.successful / total) * 100) : 0;
        
        elements.successful.textContent = gameState.callHistory.successful;
        elements.failed.textContent = gameState.callHistory.failed;
        elements.successRate.textContent = rate + '%';
        elements.perfectMatches.textContent = gameState.callHistory.perfectMatches;
    }
}

function renderUnitsSummary() {
    const summaryElements = {
        policeTotal: document.getElementById('summary-police-total'),
        policeEff: document.getElementById('summary-police-eff'),
        fireTotal: document.getElementById('summary-fire-total'),
        fireEff: document.getElementById('summary-fire-eff'),
        medicalTotal: document.getElementById('summary-medical-total'),
        medicalEff: document.getElementById('summary-medical-eff')
    };
    
    if (summaryElements.policeTotal) {
        summaryElements.policeTotal.textContent = gameState.units.police.total;
        summaryElements.policeEff.textContent = gameState.units.police.efficiency.toFixed(1) + 'x';
        summaryElements.fireTotal.textContent = gameState.units.fire.total;
        summaryElements.fireEff.textContent = gameState.units.fire.efficiency.toFixed(1) + 'x';
        summaryElements.medicalTotal.textContent = gameState.units.medical.total;
        summaryElements.medicalEff.textContent = gameState.units.medical.efficiency.toFixed(1) + 'x';
    }
}

function getNextExpansion() {
    const expansions = [
        { from: 15, to: 25, cost: 500, reputation: 50 },
        { from: 25, to: 40, cost: 1500, reputation: 150 },
        { from: 40, to: 60, cost: 3500, reputation: 300 },
        { from: 60, to: 85, cost: 8000, reputation: 500 },
        { from: 85, to: 100, cost: 15000, reputation: 800 }
    ];
    
    const currentTotal = gameState.buildingSlots.total;
    return expansions.find(e => e.from === currentTotal);
}

function renderBuildingsOptimized() {
    const currentSnapshot = JSON.stringify({
        buildings: gameState.buildings,
        slots: gameState.buildingSlots,
        budget: Math.floor(gameState.resources.budget / 100) * 100,
        reputation: Math.floor(gameState.resources.reputation / 10) * 10,
        category: activeCategory
    });
    
    if (currentSnapshot === lastBuildingsSnapshot) return;
    
    lastBuildingsSnapshot = currentSnapshot;
    renderBuildingsSlots();
    renderBuildingsList();
}

function renderBuildingsSlots() {
    const usedSlots = document.getElementById('used-slots');
    const totalSlots = document.getElementById('total-slots');
    const expandButton = document.getElementById('expand-slots-button');
    
    if (usedSlots) {
        usedSlots.textContent = gameState.buildingSlots.used;
        totalSlots.textContent = gameState.buildingSlots.total;
    }
    
    if (expandButton) {
        const expansion = getNextExpansion();
        if (expansion) {
            const canAfford = gameState.resources.budget >= expansion.cost && 
                             gameState.resources.reputation >= expansion.reputation;
            
            expandButton.innerHTML = `🏭️ Expand to ${expansion.to}<br>
                <small>(${formatResource(expansion.cost)}€, ${expansion.reputation} Reputation)</small>`;
            expandButton.disabled = !canAfford;
        } else {
            expandButton.innerHTML = '✅ Maximum reached';
            expandButton.disabled = true;
        }
    }
}

function renderBuildingsList() {
    const buildingsList = document.getElementById('buildings-list');
    if (!buildingsList) return;
    
    const buildings = Object.values(buildingDefinitions);
    const filteredBuildings = activeCategory === 'all' 
        ? buildings 
        : buildings.filter(b => b.category === activeCategory);
    
    buildingsList.innerHTML = filteredBuildings.map(building => {
        const isUnlocked = isBuildingUnlocked(building.id, gameState);
        const ownedCount = gameState.buildings[building.id] || 0;
        const cost = getBuildingCost(building.id, ownedCount);
        const canAfford = gameState.resources.budget >= cost;
        const hasSpace = (gameState.buildingSlots.total - gameState.buildingSlots.used) >= building.size;
        
        if (!isUnlocked) {
            return `
                <div class="building-card locked">
                    <h3>🔒 ${building.name}</h3>
                    <p class="unlock-info">Unlock: ${building.unlockCondition.reputation} Reputation</p>
                </div>
            `;
        }
        
        return `
            <div class="building-card ${building.category}">
                <div class="building-header">
                    <h3>${building.icon} ${building.name}</h3>
                    <span class="owned-badge">${ownedCount > 0 ? `${ownedCount}x` : ''}</span>
                </div>
                <div class="building-info">
                    <p>${building.description}</p>
                    <p class="building-effect"><strong>Effect:</strong> ${building.effect}</p>
                </div>
                <div class="building-stats">
                    <p><strong>Size:</strong> ${building.size} slots</p>
                    <p><strong>Cost:</strong> ${formatResource(cost)}€</p>
                    ${ownedCount > 0 ? `<p><strong>Demolish Refund:</strong> ${formatResource(Math.floor(getBuildingCost(building.id, ownedCount - 1) * 0.5))}€</p>` : ''}
                </div>
                <div class="building-actions">
                    <button class="buy-button" onclick="window.buyBuildingBtn('${building.id}')" 
                        ${!canAfford || !hasSpace ? 'disabled' : ''}>
                        ${!hasSpace ? '⚠️ No Space' : `Build (${formatResource(cost)}€)`}
                    </button>
                    ${ownedCount > 0 ? `
                        <button class="demolish-button" onclick="window.demolishBuildingBtn('${building.id}')">
                            🔨 Demolish
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

export function setupBuildingFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.dataset.category;
            lastBuildingsSnapshot = '';
            renderBuildingsOptimized();
        });
    });
}

export function setupExpansionButton() {
    const expandButton = document.getElementById('expand-slots-button');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            const result = expandBuildingSlots();
            if (result) {
                lastBuildingsSnapshot = '';
                renderBuildingsOptimized();
            } else {
                const expansion = getNextExpansion();
                if (!expansion) {
                    alert('Maximum building slots reached!');
                } else {
                    alert(`Not enough resources!\n\nRequired: ${formatResource(expansion.cost)}€ and ${expansion.reputation} Reputation`);
                }
            }
        });
    }
}

window.buyBuildingBtn = function(buildingId) {
    const result = buyBuilding(buildingId);
    if (result) {
        lastBuildingsSnapshot = '';
    }
};

window.demolishBuildingBtn = function(buildingId) {
    if (confirm('Demolish building? You will get 50% of the cost back.')) {
        const result = demolishBuilding(buildingId);
        if (result) {
            lastBuildingsSnapshot = '';
        }
    }
};

export default { renderUI, setupBuildingFilters, setupExpansionButton };