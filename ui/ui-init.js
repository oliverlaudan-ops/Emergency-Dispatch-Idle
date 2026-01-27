import { setupBuildingFilters, setupExpansionButton } from './ui-render.js';
import { dispatchUnit } from '../src/modules/calls-system.js';

// UI Initialization
export function initUI() {
    console.log('🖥️ Initializing UI...');
    
    // Setup tab navigation
    setupTabs();
    
    // Setup building filters
    setupBuildingFilters();
    
    // Setup expansion button
    setupExpansionButton();
    
    // Setup dispatch event listeners
    setupDispatchListeners();
    
    console.log('✅ UI initialized');
}

// Setup tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Setup event delegation for dispatch buttons
function setupDispatchListeners() {
    const callsList = document.getElementById('active-calls');
    if (!callsList) {
        console.error('active-calls element not found!');
        return;
    }
    
    callsList.addEventListener('click', (e) => {
        const button = e.target.closest('.dispatch-button');
        if (!button || button.disabled) return;
        
        const callId = button.dataset.callId;
        const unitType = button.dataset.unitType;
        
        console.log('🚨 Dispatch button clicked:', { 
            callId, 
            callIdType: typeof callId,
            unitType,
            buttonElement: button
        });
        
        if (callId && unitType) {
            const numericCallId = parseFloat(callId);
            console.log('🚀 Dispatching unit:', { numericCallId, unitType });
            const success = dispatchUnit(numericCallId, unitType);
            console.log(success ? '✅ Dispatch successful' : '❌ Dispatch failed');
        } else {
            console.error('❌ Missing callId or unitType!', { callId, unitType });
        }
    });
    
    console.log('✅ Dispatch listeners setup v2');
}

export default { initUI };