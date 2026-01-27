import { initGame, gameLoop } from './src/modules/core.js';
import { saveGame, loadGame } from './src/modules/game-state.js';
import { initUI } from './ui/ui-init.js';

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 Emergency Dispatch - Starting up...');
    
    // Load saved game or start new
    loadGame();
    
    // Initialize UI
    initUI();
    
    // Initialize game systems
    initGame();
    
    // Start game loop (updates every 100ms)
    setInterval(() => {
        gameLoop();
    }, 100);
    
    // Auto-save every 10 seconds (increased from 30s)
    setInterval(() => {
        saveGame();
        console.log('💾 Auto-saved');
    }, 10000);
    
    console.log('✅ Emergency Dispatch - Ready!');
});

// Save before closing/reloading
window.addEventListener('beforeunload', () => {
    saveGame();
    console.log('💾 Saved before unload');
});

// Save when tab becomes hidden (switching tabs)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveGame();
        console.log('💾 Saved on tab switch');
    }
});

// Manual save button
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    
    saveButton?.addEventListener('click', () => {
        saveGame();
        alert('Game saved!');
    });
    
    resetButton?.addEventListener('click', () => {
        if (confirm('Really delete all data? This cannot be undone!')) {
            if (confirm('Are you ABSOLUTELY sure?')) {
                localStorage.clear();
                location.reload();
            }
        }
    });
});