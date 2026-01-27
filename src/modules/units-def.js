// Unit Definitions
export const unitDefinitions = {
    // Police Units
    police_patrol: {
        id: 'police_patrol',
        name: 'Streifenwagen',
        type: 'police',
        icon: '🚓',
        baseCost: 100,
        costMultiplier: 1.15,
        efficiency: 1.0,
        description: 'Standard-Polizeieinheit',
        effect: '+1 Polizeieinheit'
    },
    police_swat: {
        id: 'police_swat',
        name: 'SWAT Team',
        type: 'police',
        icon: '🔫',
        baseCost: 500,
        costMultiplier: 1.2,
        efficiency: 1.5,
        description: 'Elite-Polizeieinheit für schwere Fälle',
        effect: '+1 Elite-Polizeieinheit (50% effizienter)',
        unlockCondition: { reputation: 100 }
    },
    
    // Fire Units
    fire_truck: {
        id: 'fire_truck',
        name: 'Feuerlöschfahrzeug',
        type: 'fire',
        icon: '🚒',
        baseCost: 150,
        costMultiplier: 1.15,
        efficiency: 1.0,
        description: 'Standard-Feuerwehreinheit',
        effect: '+1 Feuerwehreinheit'
    },
    fire_aerial: {
        id: 'fire_aerial',
        name: 'Drehleiter',
        type: 'fire',
        icon: '🪩',
        baseCost: 600,
        costMultiplier: 1.2,
        efficiency: 1.5,
        description: 'Spezialeinheit für Hochhäuser',
        effect: '+1 Elite-Feuerwehreinheit (50% effizienter)',
        unlockCondition: { reputation: 150 }
    },
    
    // Medical Units
    ambulance: {
        id: 'ambulance',
        name: 'Rettungswagen',
        type: 'medical',
        icon: '🚑',
        baseCost: 120,
        costMultiplier: 1.15,
        efficiency: 1.0,
        description: 'Standard-Rettungseinheit',
        effect: '+1 Rettungseinheit'
    },
    medical_helicopter: {
        id: 'medical_helicopter',
        name: 'Rettungshubschrauber',
        type: 'medical',
        icon: '🚁',
        baseCost: 800,
        costMultiplier: 1.25,
        efficiency: 2.0,
        description: 'Schnellste Einheit, doppelt so effizient',
        effect: '+1 Elite-Rettungseinheit (2x effizienter)',
        unlockCondition: { reputation: 200 }
    }
};

// Calculate current cost for a unit
export function getUnitCost(unitId) {
    const unitDef = unitDefinitions[unitId];
    if (!unitDef) return 0;
    
    const owned = getOwnedCount(unitId);
    return Math.floor(unitDef.baseCost * Math.pow(unitDef.costMultiplier, owned));
}

// Get how many of this unit the player owns
function getOwnedCount(unitId) {
    // This would need to track individual purchases
    // For now, simplified
    return 0;
}

// Check if unit is unlocked
export function isUnitUnlocked(unitId, gameState) {
    const unitDef = unitDefinitions[unitId];
    if (!unitDef.unlockCondition) return true;
    
    const condition = unitDef.unlockCondition;
    if (condition.reputation && gameState.resources.reputation < condition.reputation) {
        return false;
    }
    
    return true;
}

export default unitDefinitions;