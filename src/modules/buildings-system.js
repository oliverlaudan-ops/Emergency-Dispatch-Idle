import gameState from './game-state.js';
import { buildingDefinitions, getBuildingCost, isBuildingUnlocked, applyBuildingEffects } from './buildings-def.js';

// Buy a building
export function buyBuilding(buildingId) {
    const building = buildingDefinitions[buildingId];
    if (!building) {
        console.error('Building not found:', buildingId);
        return false;
    }
    
    // Check if unlocked
    if (!isBuildingUnlocked(buildingId, gameState)) {
        console.log('Building not unlocked yet');
        return false;
    }
    
    // Check building slots
    const requiredSlots = building.size;
    const availableSlots = gameState.buildingSlots.total - gameState.buildingSlots.used;
    
    if (availableSlots < requiredSlots) {
        console.log('Not enough building slots');
        return false;
    }
    
    // Calculate cost
    const ownedCount = gameState.buildings[buildingId] || 0;
    const cost = getBuildingCost(buildingId, ownedCount);
    
    // Check if can afford
    if (gameState.resources.budget < cost) {
        console.log('Not enough budget');
        return false;
    }
    
    // Purchase building
    gameState.resources.budget -= cost;
    gameState.buildings[buildingId] = ownedCount + 1;
    gameState.buildingSlots.used += requiredSlots;
    
    // Apply building effects
    applyBuildingEffects(gameState);
    
    console.log(`✅ Built ${building.name}!`);
    return true;
}

// Demolish a building (50% refund)
export function demolishBuilding(buildingId) {
    const building = buildingDefinitions[buildingId];
    const ownedCount = gameState.buildings[buildingId] || 0;
    
    if (ownedCount === 0) {
        console.log('No building to demolish');
        return false;
    }
    
    // Calculate refund (50% of current cost)
    const cost = getBuildingCost(buildingId, ownedCount - 1);
    const refund = Math.floor(cost * 0.5);
    
    // Refund and remove building
    gameState.resources.budget += refund;
    gameState.buildings[buildingId] = ownedCount - 1;
    gameState.buildingSlots.used -= building.size;
    
    // Reapply building effects
    applyBuildingEffects(gameState);
    
    console.log(`🔨 Demolished ${building.name}. Refund: ${refund}€`);
    return true;
}

// Expand building slots
export function expandBuildingSlots() {
    const expansions = [
        { from: 15, to: 25, cost: 500, reputation: 50 },
        { from: 25, to: 40, cost: 1500, reputation: 150 },
        { from: 40, to: 60, cost: 3500, reputation: 300 },
        { from: 60, to: 85, cost: 8000, reputation: 500 },
        { from: 85, to: 100, cost: 15000, reputation: 800 }
    ];
    
    const currentTotal = gameState.buildingSlots.total;
    const expansion = expansions.find(e => e.from === currentTotal);
    
    if (!expansion) {
        console.log('Max building slots reached');
        return false;
    }
    
    // Check requirements
    if (gameState.resources.budget < expansion.cost) {
        console.log('Not enough budget for expansion');
        return false;
    }
    
    if (gameState.resources.reputation < expansion.reputation) {
        console.log('Not enough reputation for expansion');
        return false;
    }
    
    // Expand
    gameState.resources.budget -= expansion.cost;
    gameState.buildingSlots.total = expansion.to;
    
    console.log(`🏗️ Expanded to ${expansion.to} building slots!`);
    return true;
}

export default { buyBuilding, demolishBuilding, expandBuildingSlots };