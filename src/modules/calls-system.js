import gameState from './game-state.js';

// Call Types and Configurations
export const callTypes = {
    // Police Calls
    theft: {
        callType: 'theft',
        name: 'Burglary',
        type: 'police',
        icon: '👮',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 20,
        duration: 5000,
        description: 'Break-in at residential building'
    },
    fight: {
        callType: 'fight',
        name: 'Assault',
        type: 'police',
        icon: '🥊',
        baseUrgency: 'high',
        baseDifficulty: 3,
        baseReward: 30,
        duration: 6000,
        description: 'Violent altercation in public area'
    },
    accident: {
        callType: 'accident',
        name: 'Traffic Accident',
        type: 'police',
        icon: '🚗',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 25,
        duration: 7000,
        description: 'Traffic accident with property damage'
    },
    
    // Fire Calls
    fire_small: {
        callType: 'fire_small',
        name: 'Small Fire',
        type: 'fire',
        icon: '🔥',
        baseUrgency: 'high',
        baseDifficulty: 2,
        baseReward: 35,
        duration: 8000,
        description: 'Fire in building'
    },
    fire_large: {
        callType: 'fire_large',
        name: 'Major Fire',
        type: 'fire',
        icon: '💥',
        baseUrgency: 'high',
        baseDifficulty: 4,
        baseReward: 60,
        duration: 12000,
        description: 'Large fire, multiple buildings affected'
    },
    
    // Medical Calls
    injury: {
        callType: 'injury',
        name: 'Injury',
        type: 'medical',
        icon: '🩹',
        baseUrgency: 'medium',
        baseDifficulty: 2,
        baseReward: 30,
        duration: 6000,
        description: 'Person injured, needs medical attention'
    },
    emergency: {
        callType: 'emergency',
        name: 'Medical Emergency',
        type: 'medical',
        icon: '⚕️',
        baseUrgency: 'high',
        baseDifficulty: 3,
        baseReward: 45,
        duration: 8000,
        description: 'Severe medical emergency'
    },
    heart_attack: {
        callType: 'heart_attack',
        name: 'Heart Attack',
        type: 'medical',
        icon: '❤️',
        baseUrgency: 'high',
        baseDifficulty: 4,
        baseReward: 55,
        duration: 7000,
        description: 'Life-threatening emergency'
    }
};

// Generate a random call
export function generateCall() {
    const availableTypes = Object.values(callTypes);
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const call = {
        ...randomType,
        id: Date.now() + Math.random(),
        spawnTime: Date.now(),
        expiresAt: Date.now() + 60000, // 60 seconds (increased from 30)
        status: 'waiting',
        isManual: false // Track if manually dispatched
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
            // Check if call should have been resolved by now
            const timeSinceSpawn = now - call.spawnTime;
            const shouldBeResolved = timeSinceSpawn > (call.duration + 5000); // +5s grace period
            
            if (shouldBeResolved) {
                // Auto-resolve as success and remove
                let reward = call.baseReward;
                if (call.isPerfectMatch) {
                    reward = Math.floor(reward * 1.5);
                    gameState.callHistory.perfectMatches++;
                }
                gameState.resources.budget += reward;
                gameState.resources.reputation += Math.floor(reward / 5);
                gameState.callHistory.successful++;
                
                // Mark for removal
                call._shouldRemove = true;
                cleaned++;
            }
        }
    });
    
    // Remove marked calls
    gameState.activeCalls = gameState.activeCalls.filter(c => !c._shouldRemove);
    
    if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} stuck calls`);
        updateStress();
    }
}

// Auto-dispatch system (called from game loop)
export function processAutoDispatch() {
    const waitingCalls = gameState.activeCalls.filter(c => c.status === 'waiting');
    
    waitingCalls.forEach(call => {
        // Check if there's a unit available for this call type
        const unit = gameState.units[call.type];
        
        if (unit && unit.available > 0) {
            // Auto-dispatch!
            dispatchUnit(call.id, call.type, false); // false = auto-dispatch (no bonus)
        }
    });
}

// Dispatch unit to call
export function dispatchUnit(callId, unitType, isManual = true) {
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
    call.isManual = isManual; // Track if manually dispatched
    
    // Simulate call resolution after duration
    setTimeout(() => {
        resolveCall(callId, successChance);
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

// Check for expired calls (now auto-resolves them)
export function checkExpiredCalls() {
    const now = Date.now();
    const expiredCalls = gameState.activeCalls.filter(call => 
        call.status === 'waiting' && call.expiresAt < now
    );
    
    expiredCalls.forEach(call => {
        // Auto-resolve expired calls instead of failing them
        const unit = gameState.units[call.type];
        
        if (unit && unit.available > 0) {
            // Try to auto-dispatch one last time
            dispatchUnit(call.id, call.type, false);
        } else {
            // No units available, resolve as basic success
            const reward = Math.floor(call.baseReward * 0.5); // 50% reward for auto-resolved
            gameState.resources.budget += reward;
            gameState.resources.reputation += Math.floor(reward / 10);
            gameState.callHistory.successful++;
            removeCall(call.id);
        }
    });
}

// Update stress based on active calls
function updateStress() {
    const activeCalls = gameState.activeCalls.length;
    const targetStress = Math.min(activeCalls * 10, 100);
    
    const currentStress = gameState.resources.stress;
    gameState.resources.stress = currentStress + (targetStress - currentStress) * 0.1;
}

export default { generateCall, addCall, removeCall, dispatchUnit, checkExpiredCalls, cleanupStuckCalls, processAutoDispatch };