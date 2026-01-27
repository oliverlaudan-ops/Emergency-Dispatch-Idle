// Resource Definitions
export const resources = {
    budget: {
        id: 'budget',
        name: 'Budget',
        icon: '💰',
        description: 'Hauptwährung für Käufe und Upgrades',
        baseValue: 100,
        displayDecimals: 0
    },
    reputation: {
        id: 'reputation',
        name: 'Reputation',
        icon: '⭐',
        description: 'Beeinflusst Schwierigkeit und Belohnungen',
        baseValue: 0,
        displayDecimals: 0
    },
    stress: {
        id: 'stress',
        name: 'Stress',
        icon: '😰',
        description: 'Zu viele gleichzeitige Calls erhöhen Stress',
        baseValue: 0,
        maxValue: 100,
        displayDecimals: 0
    },
    emergencyPoints: {
        id: 'emergencyPoints',
        name: 'Notfall-Punkte',
        icon: '🚨',
        description: 'Spezielle Währung für seltene Upgrades',
        baseValue: 0,
        displayDecimals: 0
    }
};

export function formatResource(value, decimals = 0) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(decimals) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(decimals) + 'K';
    }
    return value.toFixed(decimals);
}

export default resources;