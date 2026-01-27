import gameState from './game-state.js';

// Call Types and Configurations
export const callTypes = {
    // Police Calls
    theft: {
        id: 'theft',
        name: 'Einbruch',
        type: 'police',
        icon: '👮',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 20,
        duration: 5000, // 5 seconds for testing
        description: 'Einbruch in Wohngebäude'
    },
    fight: {
        id: 'fight',
        name: 'Schlägerei',
        type: 'police',
        icon: '🥊',
        baseUrgency: 'high',
        baseDifficulty: 3,
        baseReward: 30,
        duration: 6000,
        description: 'Gewalttat in öffentlichem Raum'
    },
    accident: {
        id: 'accident',
        name: 'Verkehrsunfall',
        type: 'police',
        icon: '🚗',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 25,
        duration: 7000,
        description: 'Verkehrsunfall mit Sachschaden'
    },
    
    // Fire Calls
    fire_small: {
        id: 'fire_small',
        name: 'Kleinbrand',
        type: 'fire',
        icon: '🔥',
        baseUrgency: 'high',
        baseDifficulty: 2,
        baseReward: 35,
        duration: 8000,
        description: 'Brand in Gebäude'
    },
    fire_large: {
        id: 'fire_large',
        name: 'Großbrand',
        type: 'fire',
        icon: '💥',
        baseUrgency: 'high',
        baseDifficulty: 4,
        baseReward: 60,
        duration: 12000,
        description: 'Großfeuer, mehrere Gebäude betroffen'
    },
    
    // Medical Calls
    injury: {
        id: 'injury',
        name: 'Verletzung',
        type: 'medical',
        icon: '🩹',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 30,
        duration: 6000,
        description: 'Person verletzt, benötigt medizinische Hilfe'
    },
    emergency: {
        id: 'emergency',
        name: 'Medizinischer Notfall',
        type: 'medical',
        icon: '⚕️',
        baseUrgency: 'high',
        baseDifficulty: 3,
        baseReward: 45,
        duration: 8000,
        description: 'Schwerer medizinischer Notfall'
    },
    heart_attack: {
        id: 'heart_attack',
        name: 'Herzinfarkt',
        type: 'medical',
        icon: '❤️',
        baseUrgency: 'high',
        baseDifficulty: 4,
        baseReward: 55,
        duration: 7000,
        description: 'Lebensbedrohlicher Notfall'
    }
};

// Generate a random call
export function generateCall() {
    const availableTypes = Object.values(callTypes);
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const call = {
        id: Date.now() + Math.random(),
        ...randomType,
        spawnTime: Date.now(),
        expiresAt: Date.now() + 30000, // 30 seconds to respond
        status: 'waiting'
    };
    
    return call;
}

// Add call to active calls
export function addCall(call) {
    gameState.activeCalls.push(call);
    updateStress();
}

// Remove call
export function removeCall(callId) {
    const index = gameState.activeCalls.findIndex(c => c.id === callId);
    if (index !== -1) {
        gameState.activeCalls.splice(index, 1);
        updateStress();
    }
}

// Dispatch unit to call
export function dispatchUnit(callId, unitType) {
    const call = gameState.activeCalls.find(c => c.id === callId);
    if (!call) return false;
    
    const unit = gameState.units[unitType];
    if (!unit || unit.available <= 0) return false;
    
    // Check if correct unit type
    const isPerfectMatch = call.type === unitType;
    
    // Calculate success chance
    const baseChance = isPerfectMatch ? 0.9 : 0.5;
    const efficiencyBonus = unit.efficiency - 1.0;
    const successChance = Math.min(baseChance + efficiencyBonus, 0.99);
    
    // Reduce available units
    unit.available--;
    
    // Mark call as dispatched
    call.status = 'dispatched';
    call.dispatchedUnit = unitType;
    call.isPerfectMatch = isPerfectMatch;
    
    // Simulate call resolution after duration
    setTimeout(() => {
        resolveCall(callId, successChance);
        // Return unit
        unit.available++;
    }, call.duration);
    
    return true;
}

// Resolve call (success or failure)
function resolveCall(callId, successChance) {
    const call = gameState.activeCalls.find(c => c.id === callId);
    if (!call) return;
    
    const success = Math.random() < successChance;
    
    if (success) {
        // Success
        let reward = call.baseReward;
        if (call.isPerfectMatch) {
            reward = Math.floor(reward * 1.5);
            gameState.callHistory.perfectMatches++;
        }
        
        gameState.resources.budget += reward;
        gameState.resources.reputation += Math.floor(reward / 5);
        gameState.callHistory.successful++;
        
        console.log(`✅ Call resolved successfully! +${reward} Budget`);
    } else {
        // Failure
        gameState.resources.reputation -= 10;
        gameState.callHistory.failed++;
        
        console.log('❌ Call failed!');
    }
    
    removeCall(callId);
}

// Check for expired calls
export function checkExpiredCalls() {
    const now = Date.now();
    const expiredCalls = gameState.activeCalls.filter(call => 
        call.status === 'waiting' && call.expiresAt < now
    );
    
    expiredCalls.forEach(call => {
        gameState.callHistory.failed++;
        gameState.resources.reputation -= 5;
        removeCall(call.id);
        console.log('⏰ Call expired!');
    });
}

// Update stress based on active calls
function updateStress() {
    const activeCalls = gameState.activeCalls.length;
    const targetStress = Math.min(activeCalls * 10, 100);
    
    // Smooth transition
    const currentStress = gameState.resources.stress;
    gameState.resources.stress = currentStress + (targetStress - currentStress) * 0.1;
}

export default { generateCall, addCall, removeCall, dispatchUnit, checkExpiredCalls };