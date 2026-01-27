// Buildings Definitions
export const buildingDefinitions = {
    // Police Buildings
    police_station: {
        id: 'police_station',
        name: 'Police Station',
        category: 'police',
        icon: '🏢',
        size: 3,
        baseCost: 300,
        costMultiplier: 1.2,
        description: 'Main hub for police units',
        effect: '+3 Police Units',
        effectValue: { type: 'police', units: 3 },
        unlockCondition: null
    },
    patrol_garage: {
        id: 'patrol_garage',
        name: 'Patrol Garage',
        category: 'police',
        icon: '🚓',
        size: 2,
        baseCost: 180,
        costMultiplier: 1.15,
        description: 'Garage for patrol cars',
        effect: '+2 Fast Police Units',
        effectValue: { type: 'police', units: 2, speedBonus: 0.1 },
        unlockCondition: null
    },
    swat_center: {
        id: 'swat_center',
        name: 'SWAT Center',
        category: 'police',
        icon: '🔫',
        size: 3,
        baseCost: 1000,
        costMultiplier: 1.3,
        description: 'Elite units for tough cases',
        effect: '+1 Elite Unit, +25% Police Efficiency',
        effectValue: { type: 'police', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    police_academy: {
        id: 'police_academy',
        name: 'Police Academy',
        category: 'police',
        icon: '🎓',
        size: 2,
        baseCost: 500,
        costMultiplier: 1.25,
        description: 'Training for better officers',
        effect: '+20% Police Efficiency',
        effectValue: { type: 'police', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    helipad_police: {
        id: 'helipad_police',
        name: 'Police Helipad',
        category: 'police',
        icon: '🚁',
        size: 2,
        baseCost: 1500,
        costMultiplier: 1.35,
        description: 'Air support unit',
        effect: '+1 Air Unit, +50% Speed',
        effectValue: { type: 'police', units: 1, speedBonus: 0.5 },
        unlockCondition: { reputation: 250 }
    },
    
    // Fire Buildings
    fire_station: {
        id: 'fire_station',
        name: 'Fire Station',
        category: 'fire',
        icon: '🏭',
        size: 3,
        baseCost: 350,
        costMultiplier: 1.2,
        description: 'Main hub for fire units',
        effect: '+3 Fire Units',
        effectValue: { type: 'fire', units: 3 },
        unlockCondition: null
    },
    fire_truck_depot: {
        id: 'fire_truck_depot',
        name: 'Fire Truck Depot',
        category: 'fire',
        icon: '🚒',
        size: 2,
        baseCost: 200,
        costMultiplier: 1.15,
        description: 'Additional fire trucks',
        effect: '+2 Fire Units',
        effectValue: { type: 'fire', units: 2 },
        unlockCondition: null
    },
    aerial_center: {
        id: 'aerial_center',
        name: 'Aerial Ladder Center',
        category: 'fire',
        icon: '🪜',
        size: 3,
        baseCost: 1200,
        costMultiplier: 1.3,
        description: 'Specialized units for high-rises',
        effect: '+1 Elite Unit, +25% Fire Efficiency',
        effectValue: { type: 'fire', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    fire_training: {
        id: 'fire_training',
        name: 'Fire Training Center',
        category: 'fire',
        icon: '🔥',
        size: 2,
        baseCost: 550,
        costMultiplier: 1.25,
        description: 'Training for firefighters',
        effect: '+20% Fire Efficiency',
        effectValue: { type: 'fire', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    fire_helipad: {
        id: 'fire_helipad',
        name: 'Fire Helicopter Pad',
        category: 'fire',
        icon: '🚁',
        size: 2,
        baseCost: 1800,
        costMultiplier: 1.35,
        description: 'Aerial firefighting',
        effect: '+1 Air Unit, +50% Speed',
        effectValue: { type: 'fire', units: 1, speedBonus: 0.5 },
        unlockCondition: { reputation: 300 }
    },
    
    // Medical Buildings
    hospital: {
        id: 'hospital',
        name: 'Hospital',
        category: 'medical',
        icon: '🏥',
        size: 3,
        baseCost: 400,
        costMultiplier: 1.2,
        description: 'Main hospital with ambulances',
        effect: '+3 Medical Units',
        effectValue: { type: 'medical', units: 3 },
        unlockCondition: null
    },
    ambulance_station: {
        id: 'ambulance_station',
        name: 'Ambulance Station',
        category: 'medical',
        icon: '🚑',
        size: 2,
        baseCost: 220,
        costMultiplier: 1.15,
        description: 'Decentralized ambulance station',
        effect: '+2 Medical Units',
        effectValue: { type: 'medical', units: 2 },
        unlockCondition: null
    },
    trauma_center: {
        id: 'trauma_center',
        name: 'Trauma Center',
        category: 'medical',
        icon: '⚕️',
        size: 3,
        baseCost: 1100,
        costMultiplier: 1.3,
        description: 'Specialized for critical injuries',
        effect: '+1 Elite Unit, +25% Medical Efficiency',
        effectValue: { type: 'medical', units: 1, efficiencyBonus: 0.25 },
        unlockCondition: { reputation: 150 }
    },
    medical_training: {
        id: 'medical_training',
        name: 'Medical Training Center',
        category: 'medical',
        icon: '💉',
        size: 2,
        baseCost: 600,
        costMultiplier: 1.25,
        description: 'Advanced training for paramedics',
        effect: '+20% Medical Efficiency',
        effectValue: { type: 'medical', efficiencyBonus: 0.2 },
        unlockCondition: { reputation: 100 }
    },
    air_ambulance: {
        id: 'air_ambulance',
        name: 'Air Ambulance Station',
        category: 'medical',
        icon: '🚁',
        size: 2,
        baseCost: 2000,
        costMultiplier: 1.35,
        description: 'Fastest medical response',
        effect: '+1 Air Unit, +100% Efficiency',
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