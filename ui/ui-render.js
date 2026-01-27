import gameState from '../src/modules/game-state.js';
import { formatResource } from '../src/modules/resources-def.js';
import { dispatchUnit } from '../src/modules/calls-system.js';
import { unitDefinitions, getUnitCost, isUnitUnlocked } from '../src/modules/units-def.js';

let lastRenderTime = 0;
const RENDER_INTERVAL = 100; // Render every 100ms

// Main render function
export function renderUI() {
    const now = Date.now();
    if (now - lastRenderTime < RENDER_INTERVAL) return;
    lastRenderTime = now;
    
    renderHeaderStats();
    renderCalls();
    renderUnitsStatus();
    renderStats();
    renderUnitsList();
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
                        <button class="dispatch-button police" onclick="window.dispatchToCall('${call.id}', 'police')" 
                            ${gameState.units.police.available === 0 ? 'disabled' : ''}>
                            🚓 Polizei (${gameState.units.police.available})
                        </button>
                        <button class="dispatch-button fire" onclick="window.dispatchToCall('${call.id}', 'fire')"
                            ${gameState.units.fire.available === 0 ? 'disabled' : ''}>
                            🚒 Feuerwehr (${gameState.units.fire.available})
                        </button>
                        <button class="dispatch-button medical" onclick="window.dispatchToCall('${call.id}', 'medical')"
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
        fireAvailable: document.getElementById('fire-available'),
        fireTotal: document.getElementById('fire-total'),
        medicalAvailable: document.getElementById('medical-available'),
        medicalTotal: document.getElementById('medical-total')
    };
    
    if (elements.policeAvailable) {
        elements.policeAvailable.textContent = gameState.units.police.available;
        elements.policeTotal.textContent = gameState.units.police.total;
        elements.fireAvailable.textContent = gameState.units.fire.available;
        elements.fireTotal.textContent = gameState.units.fire.total;
        elements.medicalAvailable.textContent = gameState.units.medical.available;
        elements.medicalTotal.textContent = gameState.units.medical.total;
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

// Render units list (for Units tab)
function renderUnitsList() {
    const unitsList = document.getElementById('units-list');
    if (!unitsList) return;
    
    unitsList.innerHTML = Object.values(unitDefinitions).map(unit => {
        const isUnlocked = isUnitUnlocked(unit.id, gameState);
        const cost = getUnitCost(unit.id);
        const canAfford = gameState.resources.budget >= cost;
        
        if (!isUnlocked) {
            return `
                <div class="unit-card" style="opacity: 0.5;">
                    <h3>🔒 ${unit.name}</h3>
                    <p>Freischaltung: ${unit.unlockCondition.reputation} Reputation</p>
                </div>
            `;
        }
        
        return `
            <div class="unit-card">
                <h3>${unit.icon} ${unit.name}</h3>
                <div class="unit-info">
                    <p>${unit.description}</p>
                    <p><strong>Typ:</strong> ${unit.type}</p>
                    <p><strong>Effizienz:</strong> ${unit.efficiency}x</p>
                    <p><strong>Effekt:</strong> ${unit.effect}</p>
                </div>
                <button class="buy-button" onclick="window.buyUnit('${unit.id}')" ${!canAfford ? 'disabled' : ''}>
                    Kaufen (${cost}€)
                </button>
            </div>
        `;
    }).join('');
}

// Global function for dispatching (called from HTML)
window.dispatchToCall = function(callId, unitType) {
    dispatchUnit(parseFloat(callId), unitType);
};

// Global function for buying units
window.buyUnit = function(unitId) {
    const cost = getUnitCost(unitId);
    const unitDef = unitDefinitions[unitId];
    
    if (gameState.resources.budget >= cost) {
        gameState.resources.budget -= cost;
        
        // Add unit to appropriate type
        const unitType = unitDef.type;
        gameState.units[unitType].total++;
        gameState.units[unitType].available++;
        
        // Improve efficiency if it's an elite unit
        if (unitDef.efficiency > 1.0) {
            const currentEfficiency = gameState.units[unitType].efficiency;
            gameState.units[unitType].efficiency = (currentEfficiency + unitDef.efficiency) / 2;
        }
        
        console.log(`✅ Bought ${unitDef.name}!`);
    }
};

export default { renderUI };