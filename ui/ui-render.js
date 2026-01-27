import gameState from '../src/modules/game-state.js';
import { formatResource } from '../src/modules/resources-def.js';
import { buildingDefinitions, getBuildingCost, isBuildingUnlocked } from '../src/modules/buildings-def.js';
import { buyBuilding, demolishBuilding, expandBuildingSlots } from '../src/modules/buildings-system.js';

let lastRenderTime = 0;
const RENDER_INTERVAL = 100; // Render every 100ms
let activeCategory = 'all';
let lastCallsSnapshot = '';
let lastBuildingsSnapshot = '';

// Main render function
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

// Render header statistics
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
        
        // Color code stress
        if (stress > 70) {
            stressDisplay.style.color = '#e74c3c';
        } else if (stress > 40) {
            stressDisplay.style.color = '#f39c12';
        } else {
            stressDisplay.style.color = '#27ae60';
        }
    }
}

// Optimized render - only update when calls change
function renderCallsOptimized() {
    const activeCalls = gameState.activeCalls;
    
    // Create snapshot of current calls state
    const currentSnapshot = JSON.stringify(activeCalls.map(c => ({
        id: c.id,
        status: c.status,
        expiresAt: c.expiresAt
    })));
    
    // Only re-render if calls actually changed (not just timer)
    if (currentSnapshot === lastCallsSnapshot) {
        // Still update time display for existing calls
        updateCallTimers();
        return;
    }
    
    lastCallsSnapshot = currentSnapshot;
    renderCalls();
}

// Update only the timers without re-rendering entire calls
function updateCallTimers() {
    const activeCalls = gameState.activeCalls;
    activeCalls.forEach((call, index) => {
        const timeLeft = Math.max(0, Math.floor((call.expiresAt - Date.now()) / 1000));
        const callCards = document.querySelectorAll('.call-card');
        const callCard = callCards[index];
        
        if (callCard && call.status === 'waiting') {
            const detailsParagraphs = callCard.querySelectorAll('.call-details p');
            const timeParagraph = detailsParagraphs[2];
            
            if (timeParagraph) {
                timeParagraph.innerHTML = `<strong>Belohnung:</strong> ${call.baseReward}€ | <strong>Zeit:</strong> ${timeLeft}s`;
            }
        }
    });
}

// Render active calls
function renderCalls() {
    const callsList = document.getElementById('active-calls');
    if (!callsList) return;
    
    const activeCalls = gameState.activeCalls;
    
    if (activeCalls.length === 0) {
        callsList.innerHTML = '<p class="empty-state">Keine aktiven Notrufe</p>';
        return;
    }
    
    callsList.innerHTML = activeCalls.map(call => {
        const timeLeft = Math.max(0, Math.floor((call.expiresAt - Date.now()) / 1000));
        const isDispatched = call.status === 'dispatched';
        
        return `
            <div class="call-card ${call.type}">
                <div class="call-header">
                    <span class="call-title">${call.icon} ${call.name}</span>
                    <span class="call-urgency ${call.baseUrgency}">${call.baseUrgency.toUpperCase()}</span>
                </div>
                <div class="call-details">
                    <p>${call.description}</p>
                    <p><strong>Schwierigkeit:</strong> ${'⭐'.repeat(call.baseDifficulty)}</p>
                    <p><strong>Belohnung:</strong> ${call.baseReward}€ | <strong>Zeit:</strong> ${timeLeft}s</p>
                </div>
                ${isDispatched ? 
                    '<p style="color: #3498db; font-weight: 600;">✓ Einheit unterwegs...</p>' :
                    `<div class="call-actions">
                        <button class="dispatch-button police" data-call-id="${call.id}" data-unit-type="police"
                            ${gameState.units.police.available === 0 ? 'disabled' : ''}>
                            🚓 Polizei (${gameState.units.police.available})
                        </button>
                        <button class="dispatch-button fire" data-call-id="${call.id}" data-unit-type="fire"
                            ${gameState.units.fire.available === 0 ? 'disabled' : ''}>
                            🚒 Feuerwehr (${gameState.units.fire.available})
                        </button>
                        <button class="dispatch-button medical" data-call-id="${call.id}" data-unit-type="medical"
                            ${gameState.units.medical.available === 0 ? 'disabled' : ''}>
                            🚑 Rettung (${gameState.units.medical.available})
                        </button>
                    </div>`
                }
            </div>
        `;
    }).join('');
}

// Render units status
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

// Render statistics
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

// Render units summary (in Units tab)
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

// Get next expansion info
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

// Optimized buildings render
function renderBuildingsOptimized() {
    // Create snapshot of buildings state
    const currentSnapshot = JSON.stringify({
        buildings: gameState.buildings,
        slots: gameState.buildingSlots,
        budget: Math.floor(gameState.resources.budget / 100) * 100, // Round to reduce updates
        reputation: Math.floor(gameState.resources.reputation / 10) * 10,
        category: activeCategory
    });
    
    // Only re-render if something changed
    if (currentSnapshot === lastBuildingsSnapshot) return;
    
    lastBuildingsSnapshot = currentSnapshot;
    renderBuildingsSlots();
    renderBuildingsList();
}

// Render building slots info
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
            
            expandButton.innerHTML = `🏭️ Erweitern auf ${expansion.to}<br>
                <small>(${formatResource(expansion.cost)}€, ${expansion.reputation} Reputation)</small>`;
            expandButton.disabled = !canAfford;
        } else {
            expandButton.innerHTML = '✅ Maximum erreicht';
            expandButton.disabled = true;
        }
    }
}

// Render buildings list
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
                    <p class="unlock-info">Freischaltung: ${building.unlockCondition.reputation} Reputation</p>
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
                    <p class="building-effect"><strong>Effekt:</strong> ${building.effect}</p>
                </div>
                <div class="building-stats">
                    <p><strong>Größe:</strong> ${building.size} Bauplätze</p>
                    <p><strong>Kosten:</strong> ${formatResource(cost)}€</p>
                    ${ownedCount > 0 ? `<p><strong>Abriss-Rückerstattung:</strong> ${formatResource(Math.floor(getBuildingCost(building.id, ownedCount - 1) * 0.5))}€</p>` : ''}
                </div>
                <div class="building-actions">
                    <button class="buy-button" onclick="window.buyBuildingBtn('${building.id}')" 
                        ${!canAfford || !hasSpace ? 'disabled' : ''}>
                        ${!hasSpace ? '⚠️ Kein Platz' : `Bauen (${formatResource(cost)}€)`}
                    </button>
                    ${ownedCount > 0 ? `
                        <button class="demolish-button" onclick="window.demolishBuildingBtn('${building.id}')">
                            🔨 Abreissen
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Setup category filters
export function setupBuildingFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.dataset.category;
            lastBuildingsSnapshot = ''; // Force re-render
            renderBuildingsOptimized();
        });
    });
}

// Setup expansion button
export function setupExpansionButton() {
    const expandButton = document.getElementById('expand-slots-button');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            const result = expandBuildingSlots();
            if (result) {
                lastBuildingsSnapshot = ''; // Force re-render
                renderBuildingsOptimized();
            } else {
                const expansion = getNextExpansion();
                if (!expansion) {
                    alert('Maximale Bauplätze erreicht!');
                } else {
                    alert(`Nicht genug Ressourcen!\n\nBenötigt: ${formatResource(expansion.cost)}€ und ${expansion.reputation} Reputation`);
                }
            }
        });
    }
}

// Global functions for buildings
window.buyBuildingBtn = function(buildingId) {
    const result = buyBuilding(buildingId);
    if (result) {
        lastBuildingsSnapshot = ''; // Force re-render
    }
};

window.demolishBuildingBtn = function(buildingId) {
    if (confirm('Gebäude abreissen? Du erhältst 50% der Kosten zurück.')) {
        const result = demolishBuilding(buildingId);
        if (result) {
            lastBuildingsSnapshot = ''; // Force re-render
        }
    }
};

export default { renderUI, setupBuildingFilters, setupExpansionButton };