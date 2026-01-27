// Game State Management
export const gameState = {
    // Resources
    resources: {
        budget: 100,
        reputation: 0,
        stress: 0,
        emergencyPoints: 0
    },
    
    // Units
    units: {
        police: { total: 2, available: 2, efficiency: 1.0 },
        fire: { total: 1, available: 1, efficiency: 1.0 },
        medical: { total: 1, available: 1, efficiency: 1.0 }
    },
    
    // Buildings
    buildings: {},
    buildingSlots: { used: 0, total: 15 },
    
    // Calls
    activeCalls: [],
    callHistory: {
        successful: 0,
        failed: 0,
        perfectMatches: 0
    },
    
    // Research & Achievements
    research: {},
    achievements: {},
    
    // Prestige
    prestige: {
        level: 0,
        points: 0
    },
    
    // Meta
    gameTime: 0,
    lastSave: Date.now(),
    version: '0.1.0'
};

// Save game to localStorage
export function saveGame() {
    try {
        const saveData = {
            ...gameState,
            lastSave: Date.now()
        };
        localStorage.setItem('emergencyDispatch_save', JSON.stringify(saveData));
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

// Load game from localStorage
export function loadGame() {
    try {
        const saveData = localStorage.getItem('emergencyDispatch_save');
        if (saveData) {
            const loaded = JSON.parse(saveData);
            
            // Merge loaded data with current state
            Object.assign(gameState, loaded);
            
            // Calculate offline progress
            const offlineTime = Date.now() - gameState.lastSave;
            if (offlineTime > 1000) {
                handleOfflineProgress(offlineTime);
            }
            
            console.log('✅ Game loaded successfully');
            return true;
        }
    } catch (error) {
        console.error('Failed to load game:', error);
    }
    console.log('🆕 Starting new game');
    return false;
}

// Handle offline progress
function handleOfflineProgress(offlineTime) {
    const offlineSeconds = Math.min(offlineTime / 1000, 86400); // Max 24 hours
    const offlineMinutes = Math.floor(offlineSeconds / 60);
    
    if (offlineMinutes > 0) {
        // Simple offline calculation: reputation grows slowly
        const offlineReputation = Math.floor(offlineMinutes * 0.5);
        gameState.resources.reputation += offlineReputation;
        
        console.log(`⏰ Offline for ${offlineMinutes} minutes. Gained ${offlineReputation} reputation.`);
    }
}

export default gameState;