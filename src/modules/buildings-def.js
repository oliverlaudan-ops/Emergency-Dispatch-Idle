// Buildings Definitions
export const buildingDefinitions = {
    // Police Buildings
    police_station: {
        id: 'police_station',
        name: 'Polizeistation',
        category: 'police',
        icon: '🏢',
        size: 3,
        baseCost: 300,
        costMultiplier: 1.2,
        description: 'Zentrale für Polizeieinheiten',
        effect: '+2 Polizeieinheiten',
        effectValue: { type: 'police', units: 2 },
        unlockCondition: null
    },
    patrol_garage: {
        id: 'patrol_garage',
        name: 'Streifenwagen-Garage',
        category: 'police',
        icon: '🚓',
        size: 2,
        baseCost: 200,
        costMultiplier: 1.15,
        description: 'Garage für Streifenwagen',
        effect: '+3 schnelle Polizeieinheiten',
        effectValue: { type: 'police', units: 3, speedBonus: 0.1 },
        unlockCondition: null
    },
    swat_center: {
        id: 'swat_center',
        name: 'SWAT-Zentrum',
        category: 'police',
        icon: '🔫',
        size: 3,
        baseCost: 1000,
        costMultiplier: 1.3,
        description: 'Elite-Einheiten für schwere Fälle',
        effect: '+1 Elite-Einheit, +25% Polizei-Effizienz',
        effectValue: { type: 'police', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    police_academy: {
        id: 'police_academy',
        name: 'Polizei-Akademie',
        category: 'police',
        icon: '🎓',
        size: 2,
        baseCost: 500,
        costMultiplier: 1.25,
        description: 'Training für bessere Polizisten',
        effect: '+20% Polizei-Effizienz',
        effectValue: { type: 'police', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    helipad_police: {
        id: 'helipad_police',
        name: 'Polizei-Helikopter-Landeplatz',
        category: 'police',
        icon: '🚁',
        size: 2,
        baseCost: 1500,
        costMultiplier: 1.35,
        description: 'Luftunterstützung',
        effect: '+1 Luft-Einheit, +50% Geschwindigkeit',
        effectValue: { type: 'police', units: 1, speedBonus: 0.5 },
        unlockCondition: { reputation: 250 }
    },
    
    // Fire Buildings
    fire_station: {
        id: 'fire_station',
        name: 'Feuerwache',
        category: 'fire',
        icon: '🏭',
        size: 3,
        baseCost: 350,
        costMultiplier: 1.2,
        description: 'Zentrale für Feuerwehreinheiten',
        effect: '+2 Feuerwehreinheiten',
        effectValue: { type: 'fire', units: 2 },
        unlockCondition: null
    },
    fire_truck_depot: {
        id: 'fire_truck_depot',
        name: 'Löschfahrzeug-Depot',
        category: 'fire',
        icon: '🚒',
        size: 2,
        baseCost: 250,
        costMultiplier: 1.15,
        description: 'Zusätzliche Löschfahrzeuge',
        effect: '+3 Feuerwehreinheiten',
        effectValue: { type: 'fire', units: 3 },
        unlockCondition: null
    },
    aerial_center: {
        id: 'aerial_center',
        name: 'Drehleiter-Zentrum',
        category: 'fire',
        icon: '🪜',
        size: 3,
        baseCost: 1200,
        costMultiplier: 1.3,
        description: 'Spezialeinheiten für Hochhäuser',
        effect: '+1 Elite-Einheit, +25% Feuerwehr-Effizienz',
        effectValue: { type: 'fire', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    fire_training: {
        id: 'fire_training',
        name: 'Feuerwehr-Trainingszentrum',
        category: 'fire',
        icon: '🔥',
        size: 2,
        baseCost: 550,
        costMultiplier: 1.25,
        description: 'Training für Feuerwehrleute',
        effect: '+20% Feuerwehr-Effizienz',
        effectValue: { type: 'fire', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    fire_helipad: {
        id: 'fire_helipad',
        name: 'Löschhubschrauber-Landeplatz',
        category: 'fire',
        icon: '🚁',
        size: 2,
        baseCost: 1800,
        costMultiplier: 1.35,
        description: 'Luftgestützte Brandbekämpfung',
        effect: '+1 Luft-Einheit, +50% Geschwindigkeit',
        effectValue: { type: 'fire', units: 1, speedBonus: 0.5 },
        unlockCondition: { reputation: 300 }
    },
    
    // Medical Buildings
    hospital: {
        id: 'hospital',
        name: 'Krankenhaus',
        category: 'medical',
        icon: '🏥',
        size: 3,
        baseCost: 400,
        costMultiplier: 1.2,
        description: 'Hauptkrankenhaus mit Rettungswagen',
        effect: '+2 Rettungseinheiten',
        effectValue: { type: 'medical', units: 2 },
        unlockCondition: null
    },
    ambulance_station: {
        id: 'ambulance_station',
        name: 'Rettungswachen',
        category: 'medical',
        icon: '🚑',
        size: 2,
        baseCost: 220,
        costMultiplier: 1.15,
        description: 'Dezentrale Rettungswache',
        effect: '+3 Rettungseinheiten',
        effectValue: { type: 'medical', units: 3 },
        unlockCondition: null
    },
    trauma_center: {
        id: 'trauma_center',
        name: 'Trauma-Zentrum',
        category: 'medical',
        icon: '⚕️',
        size: 3,
        baseCost: 1100,
        costMultiplier: 1.3,
        description: 'Spezialisiert auf Schwerstverletzte',
        effect: '+1 Elite-Einheit, +25% Rettungs-Effizienz',
        effectValue: { type: 'medical', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    medical_training: {
        id: 'medical_training',
        name: 'Medizinisches Trainingszentrum',
        category: 'medical',
        icon: '💉',
        size: 2,
        baseCost: 600,
        costMultiplier: 1.25,
        description: 'Fortbildung für Rettungssanitäter',
        effect: '+20% Rettungs-Effizienz',
        effectValue: { type: 'medical', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    air_ambulance: {
        id: 'air_ambulance',
        name: 'Rettungshubschrauber-Station',
        category: 'medical',
        icon: '🚁',
        size: 2,
        baseCost: 2000,
        costMultiplier: 1.35,
        description: 'Schnellste Rettungseinheit',
        effect: '+1 Luft-Einheit, +100% Effizienz',
        effectValue: { type: 'medical', units: 1, efficiencyBonus: 1.0 },
        unlockCondition: { reputation: 350 }
    }
};

// Calculate current cost for a building
export function getBuildingCost(buildingId, ownedCount = 0) {
    const building = buildingDefinitions[buildingId];
    if (!building) return 0;
    
    return Math.floor(building.baseCost * Math.pow(building.costMultiplier, ownedCount));
}

// Check if building is unlocked
export function isBuildingUnlocked(buildingId, gameState) {
    const building = buildingDefinitions[buildingId];
    if (!building || !building.unlockCondition) return true;
    
    const condition = building.unlockCondition;
    if (condition.reputation && gameState.resources.reputation < condition.reputation) {
        return false;
    }
    
    return true;
}

// Apply building effects to game state
export function applyBuildingEffects(gameState) {
    // Store old totals to calculate difference
    const oldTotals = {
        police: gameState.units.police.total,
        fire: gameState.units.fire.total,
        medical: gameState.units.medical.total
    };
    
    // Reset to base values
    gameState.units.police.total = 2;
    gameState.units.fire.total = 1;
    gameState.units.medical.total = 1;
    
    gameState.units.police.efficiency = 1.0;
    gameState.units.fire.efficiency = 1.0;
    gameState.units.medical.efficiency = 1.0;
    
    // Apply all building effects
    Object.entries(gameState.buildings).forEach(([buildingId, count]) => {
        const building = buildingDefinitions[buildingId];
        if (!building || count === 0) return;
        
        const effect = building.effectValue;
        const unitType = effect.type;
        
        // Apply units
        if (effect.units) {
            gameState.units[unitType].total += effect.units * count;
        }
        
        // Apply efficiency bonus
        if (effect.efficiencyBonus) {
            gameState.units[unitType].efficiency += effect.efficiencyBonus * count;
        }
    });
    
    // Add new units to available (difference between new and old total)
    ['police', 'fire', 'medical'].forEach(type => {
        const difference = gameState.units[type].total - oldTotals[type];
        if (difference > 0) {
            // New units were added, make them available
            gameState.units[type].available += difference;
        }
        
        // Ensure available doesn't exceed total
        if (gameState.units[type].available > gameState.units[type].total) {
            gameState.units[type].available = gameState.units[type].total;
        }
    });
}

export default buildingDefinitions;