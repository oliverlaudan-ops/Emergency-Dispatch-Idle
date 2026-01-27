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
    
    // Auto-save every 30 seconds
    setInterval(() => {
        saveGame();
        console.log('💾 Auto-saved');
    }, 30000);
    
    console.log('✅ Emergency Dispatch - Ready!');
});

// Manual save button
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    
    saveButton?.addEventListener('click', () => {
        saveGame();
        alert('Spiel gespeichert!');
    });
    
    resetButton?.addEventListener('click', () => {
        if (confirm('Wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
            if (confirm('Bist du dir ABSOLUT sicher?')) {
                localStorage.clear();
                location.reload();
            }
        }
    });
});