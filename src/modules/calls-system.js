import gameState from './game-state.js';

// Call Types and Configurations
export const callTypes = {
    // Police Calls
    theft_easy: {
        callType: 'theft_easy',
        name: 'Minor Theft',
        type: 'police',
        icon: '👮',
        baseUrgency: 'medium',
        baseDifficulty: 1,
        requiredUnits: 1,
        baseReward: 20,
        duration: 5000,
        description: 'Small theft reported'
    },
    theft_medium: {
        callType: 'theft_medium',
        name: 'Burglary',
        type: 'police',
        icon: '👮',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        requiredUnits: 2,
        baseReward: 30,
        duration: 6000,
        description: 'Break-in at residential building'
    },
    theft_hard: {
        callType: 'theft_hard',
        name: 'Armed Robbery',
        type: 'police',
        icon: '👮',
        baseUrgency: 'high',
        baseDifficulty: 3,
        requiredUnits: 3,
        baseReward: 40,
        duration: 7000,
        description: 'Armed robbery in progress'
    },
    fight_easy: {
        callType: 'fight_easy',
        name: 'Disturbance',
        type: 'police',
        icon: '🥊',
        baseUrgency: 'medium',
        baseDifficulty: 1,
        requiredUnits: 1,
        baseReward: 18,
        duration: 5000,
        description: 'Noise complaint and disturbance'
    },
    fight_medium: {
        callType: 'fight_medium',
        name: 'Assault',
        type: 'police',
        icon: '🥊',
        baseUrgency: 'high',
        baseDifficulty: 2,
        requiredUnits: 2,
        baseReward: 35,
        duration: 6000,
        description: 'Violent altercation in public area'
    },
    fight_hard: {
        callType: 'fight_hard',
        name: 'Mass Brawl',
        type: 'police',
        icon: '🥊',
        baseUrgency: 'high',
        baseDifficulty: 3,
        requiredUnits: 3,
        baseReward: 50,
        duration: 8000,
        description: 'Large fight with multiple people'
    },
    
    // Fire Calls
    fire_easy: {
        callType: 'fire_easy',
        name: 'Small Fire',
        type: 'fire',
        icon: '🔥',
        baseUrgency: 'high',
        baseDifficulty: 1,
        requiredUnits: 1,
        baseReward: 25,
        duration: 6000,
        description: 'Small fire in apartment'
    },
    fire_medium: {
        callType: 'fire_medium',
        name: 'Building Fire',
        type: 'fire',
        icon: '🔥',
        baseUrgency: 'high',
        baseDifficulty: 2,
        requiredUnits: 2,
        baseReward: 45,
        duration: 8000,
        description: 'Fire in residential building'
    },
    fire_hard: {
        callType: 'fire_hard',
        name: 'Major Fire',
        type: 'fire',
        icon: '💥',
        baseUrgency: 'high',
        baseDifficulty: 3,
        requiredUnits: 3,
        baseReward: 70,
        duration: 12000,
        description: 'Large fire, multiple buildings affected'
    },
    
    // Medical Calls
    injury_easy: {
        callType: 'injury_easy',
        name: 'Minor Injury',
        type: 'medical',
        icon: '🩹',
        baseUrgency: 'medium',
        baseDifficulty: 1,
        requiredUnits: 1,
        baseReward: 22,
        duration: 5000,
        description: 'Person with minor injury'
    },
    injury_medium: {
        callType: 'injury_medium',
        name: 'Serious Injury',
        type: 'medical',
        icon: '🩹',
        baseUrgency: 'high',
        baseDifficulty: 2,
        requiredUnits: 2,
        baseReward: 38,
        duration: 6000,
        description: 'Person seriously injured'
    },
    injury_hard: {
        callType: 'injury_hard',
        name: 'Mass Casualty',
        type: 'medical',
        icon: '⚕️',
        baseUrgency: 'high',
        baseDifficulty: 3,
        requiredUnits: 3,
        baseReward: 65,
        duration: 9000,
        description: 'Multiple people injured'
    },
    emergency_easy: {
        callType: 'emergency_easy',
        name: 'Medical Call',
        type: 'medical',
        icon: '⚕️',
        baseUrgency: 'high',
        baseDifficulty: 1,
        requiredUnits: 1,
        baseReward: 28,
        duration: 5000,
        description: 'Medical emergency'
    },
    emergency_medium: {
        callType: 'emergency_medium',
        name: 'Critical Emergency',
        type: 'medical',
        icon: '❤️',
        baseUrgency: 'high',
        baseDifficulty: 2,
        requiredUnits: 2,
        baseReward: 50,
        duration: 7000,
        description: 'Life-threatening emergency'
    },
    emergency_hard: {
        callType: 'emergency_hard',
        name: 'Cardiac Arrest',
        type: 'medical',
        icon: '❤️',
        baseUrgency: 'high',
        baseDifficulty: 3,
        requiredUnits: 3,
        baseReward: 75,
        duration: 8000,
        description: 'Multiple cardiac emergencies'
    }
};

// Get available call types based on current units
function getAvailableCallTypes() {
    const availableTypes = [];
    
    Object.values(callTypes).forEach(callType => {
        const unitCount = gameState.units[callType.type].total;
        
        // Only add call if player has enough units of that type
        if (unitCount >= callType.requiredUnits) {
            availableTypes.push(callType);
        }
    });
    
    return availableTypes;
}

// Generate a random call
export function generateCall() {
    const availableTypes = getAvailableCallTypes();
    
    // If no types available, generate easy call
    if (availableTypes.length === 0) {
        const easyTypes = Object.values(callTypes).filter(c => c.requiredUnits === 1);
        const randomType = easyTypes[Math.floor(Math.random() * easyTypes.length)];
        
        const call = {
            ...randomType,
            id: Date.now() + Math.random(),
            spawnTime: Date.now(),
            expiresAt: Date.now() + 60000,
            autoDispatchAt: Date.now() + 20000, // 20 seconds delay for auto-dispatch
            status: 'waiting',
            isManual: false
        };
        
        return call;
    }
    
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const call = {
        ...randomType,
        id: Date.now() + Math.random(),
        spawnTime: Date.now(),
        expiresAt: Date.now() + 60000,
        autoDispatchAt: Date.now() + 20000, // 20 seconds delay for auto-dispatch
        status: 'waiting',
        isManual: false
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

// Clean up stuck dispatched calls (called on game init)
export function cleanupStuckCalls() {
    const now = Date.now();
    let cleaned = 0;
    
    gameState.activeCalls.forEach(call => {
        if (call.status === 'dispatched') {
            const timeSinceSpawn = now - call.spawnTime;
            const shouldBeResolved = timeSinceSpawn > (call.duration + 5000);
            
            if (shouldBeResolved) {
                let reward = call.baseReward;
                if (call.isPerfectMatch) {
                    reward = Math.floor(reward * 1.5);
                    gameState.callHistory.perfectMatches++;
                }
                gameState.resources.budget += reward;
                gameState.resources.reputation += Math.floor(reward / 5);
                gameState.callHistory.successful++;
                
                call._shouldRemove = true;
                cleaned++;
            }
        }
    });
    
    gameState.activeCalls = gameState.activeCalls.filter(c => !c._shouldRemove);
    
    if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} stuck calls`);
        updateStress();
    }
}

// Auto-dispatch system with delay
export function processAutoDispatch() {
    const now = Date.now();
    const waitingCalls = gameState.activeCalls.filter(c => c.status === 'waiting');
    
    waitingCalls.forEach(call => {
        // Only auto-dispatch after delay
        if (now >= call.autoDispatchAt) {
            const unit = gameState.units[call.type];
            
            if (unit && unit.available >= call.requiredUnits) {
                dispatchUnit(call.id, call.type, false);
            }
        }
    });
}

// Dispatch unit to call
export function dispatchUnit(callId, unitType, isManual = true) {
    const call = gameState.activeCalls.find(c => c.id === callId);
    if (!call) return false;
    
    const unit = gameState.units[unitType];
    if (!unit || unit.available < call.requiredUnits) return false;
    
    const isPerfectMatch = call.type === unitType;
    
    const baseChance = isPerfectMatch ? 0.9 : 0.5;
    const efficiencyBonus = unit.efficiency - 1.0;
    const successChance = Math.min(baseChance + efficiencyBonus, 0.99);
    
    unit.available -= call.requiredUnits;
    
    call.status = 'dispatched';
    call.dispatchedUnit = unitType;
    call.isPerfectMatch = isPerfectMatch;
    call.isManual = isManual;
    
    setTimeout(() => {
        resolveCall(callId, successChance);
        unit.available += call.requiredUnits;
    }, call.duration);
    
    return true;
}

// Resolve call
function resolveCall(callId, successChance) {
    const call = gameState.activeCalls.find(c => c.id === callId);
    if (!call) return;
    
    const success = Math.random() < successChance;
    
    if (success) {
        let reward = call.baseReward;
        
        // Manual dispatch bonus
        if (call.isManual) {
            if (call.isPerfectMatch) {
                reward = Math.floor(reward * 1.75); // +75% for perfect manual match
            } else {
                reward = Math.floor(reward * 1.5); // +50% for manual dispatch
            }
        } else if (call.isPerfectMatch) {
            reward = Math.floor(reward * 1.25); // +25% for perfect auto-match
        }
        
        if (call.isPerfectMatch) {
            gameState.callHistory.perfectMatches++;
        }
        
        gameState.resources.budget += reward;
        gameState.resources.reputation += Math.floor(reward / 5);
        gameState.callHistory.successful++;
    } else {
        gameState.resources.reputation -= 10;
        gameState.callHistory.failed++;
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
        const unit = gameState.units[call.type];
        
        if (unit && unit.available >= call.requiredUnits) {
            dispatchUnit(call.id, call.type, false);
        } else {
            const reward = Math.floor(call.baseReward * 0.5);
            gameState.resources.budget += reward;
            gameState.resources.reputation += Math.floor(reward / 10);
            gameState.callHistory.successful++;
            removeCall(call.id);
        }
    });
}

// Update stress
function updateStress() {
    const activeCalls = gameState.activeCalls.length;
    const targetStress = Math.min(activeCalls * 10, 100);
    
    const currentStress = gameState.resources.stress;
    gameState.resources.stress = currentStress + (targetStress - currentStress) * 0.1;
}

export default { generateCall, addCall, removeCall, dispatchUnit, checkExpiredCalls, cleanupStuckCalls, processAutoDispatch };