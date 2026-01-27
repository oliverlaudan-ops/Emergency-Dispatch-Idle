import gameState from './game-state.js';
import { generateCall, addCall, checkExpiredCalls, cleanupStuckCalls } from './calls-system.js';
import { applyBuildingEffects } from './buildings-def.js';
import { renderUI } from '../../ui/ui-render.js';

let lastCallTime = 0;
const CALL_INTERVAL = 8000; // New call every 8 seconds

// Initialize game systems
export function initGame() {
    console.log('🎮 Initializing game systems...');
    
    // Clean up any stuck dispatched calls from previous session
    cleanupStuckCalls();
    
    // Apply building effects on load
    applyBuildingEffects(gameState);
    
    // Generate first call after 3 seconds
    setTimeout(() => {
        const call = generateCall();
        addCall(call);
    }, 3000);
    
    lastCallTime = Date.now();
}

// Main game loop
export function gameLoop() {
    const now = Date.now();
    
    // Generate new calls periodically
    if (now - lastCallTime > CALL_INTERVAL) {
        // Don't generate too many calls at once
        if (gameState.activeCalls.length < 5) {
            const call = generateCall();
            addCall(call);
        }
        lastCallTime = now;
    }
    
    // Check for expired calls
    checkExpiredCalls();
    
    // Update reputation slowly over time
    gameState.resources.reputation += 0.001;
    
    // Update game time
    gameState.gameTime += 0.1;
    
    // Update UI
    renderUI();
}

export default { initGame, gameLoop };