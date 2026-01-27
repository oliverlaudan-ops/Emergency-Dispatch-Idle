# 🚨 Emergency Dispatch - Idle Game

Ein progressives Idle/Incremental-Game über die Verwaltung einer Notruf-Zentrale. Koordiniere Polizei, Feuerwehr und Rettungsdienste in einer wachsenden Stadt!

## 🎮 Spiel jetzt!

**Live Demo:** [dispatch.future-pulse.tech](https://dispatch.future-pulse.tech/)

**Status:** Early Alpha (v0.1.0) - In aktiver Entwicklung

---

### Lokal spielen

```bash
# Repository klonen
git clone https://github.com/oliverlaudan-ops/Emergency-Dispatch-Idle.git
cd Emergency-Dispatch-Idle

# Mit einem lokalen Server starten
python -m http.server 8000
# oder
npx http-server

# Im Browser öffnen
open http://localhost:8000
```

## 🎯 Spielkonzept

Du leitest eine Notruf-Zentrale und koordinierst verschiedene Rettungsdienste. Notrufe kommen automatisch herein, und du musst die richtigen Einheiten zur richtigen Zeit dispatchen. Je besser du matchst, desto höher die Belohnungen!

### Kern-Mechaniken

- **🚨 Automatische Notrufe**: Verschiedene Notfälle erscheinen regelmäßig
- **🚓 Einheiten-Management**: Verwalte Polizei, Feuerwehr und Rettungsdienste
- **🎯 Perfect Matching**: Sende die richtige Einheit zum richtigen Notruf für Bonus-Belohnungen
- **⏱️ Zeit-Management**: Reagiere schnell, bevor Notrufe ablaufen
- **💰 Ressourcen-System**: Verdiene Budget und Reputation durch erfolgreiche Einsätze
- **🚀 Progression**: Kaufe mehr und bessere Einheiten, um größere Notfälle zu bewältigen

## 📋 Aktueller Stand (v0.1.0)

### ✅ Implementiert

- **Ressourcen-System**: Budget, Reputation, Stress, Notfall-Punkte
- **Notruf-System**: 8 verschiedene Notruf-Typen (Polizei, Feuerwehr, Medizin)
- **Einheiten-System**: 6 Einheiten-Typen mit verschiedenen Effizienz-Stufen
- **Dispatch-Mechanik**: Manuelle Zuweisung von Einheiten zu Notrufen
- **Perfect Match System**: Bonus-Belohnungen für optimale Zuordnungen
- **Zeit-Druck**: Notrufe laufen ab, wenn nicht rechtzeitig bearbeitet
- **Erfolgsrate-System**: Basierend auf Einheiten-Typ und Effizienz
- **UI mit Tab-System**: Dashboard, Einheiten, Gebäude, Forschung, Erfolge, Prestige
- **Save/Load System**: LocalStorage-basiertes Speichern
- **Offline-Progress**: Basis-Implementierung
- **Live-Statistiken**: Erfolgsrate, Perfekte Matches, etc.

### 🚧 In Entwicklung

- **Gebäude-System**: Polizeiwachen, Feuerwachen, Krankenhäuser
- **Bauplatz-Management**: Strategische Platzierung von Gebäuden
- **Forschungs-Baum**: 20+ Technologien zum Freischalten
- **Achievement-System**: 30+ Erfolge mit Belohnungen
- **Prestige-System**: Career Advancement mit permanenten Boni
- **Automatisierung**: Auto-Dispatch für verschiedene Call-Typen
- **Gebiets-Expansion**: Neue Stadtteile freischalten
- **Event-System**: Großereignisse und Spezial-Notfälle
- **Elite-Einheiten**: SWAT, Drehleiter, Rettungshubschrauber

## 🎮 Gameplay-Loop

1. **Notrufe erscheinen** automatisch auf dem Dashboard
2. **Einheit auswählen** und zum Notruf dispatchen
3. **Warten** während die Einheit zum Einsatz fährt
4. **Belohnung erhalten** bei Erfolg (Budget + Reputation)
5. **Upgrades kaufen** - mehr und bessere Einheiten
6. **Wiederholen** mit komplexeren Notfällen!

## 📊 Ressourcen

### 💰 Budget
- Hauptwährung für den Kauf von Einheiten und Gebäuden
- Verdient durch erfolgreiche Notfall-Einsätze
- Perfect Matches geben 50% Bonus-Belohnung

### ⭐ Reputation
- Passiv generiert und durch erfolgreiche Einsätze erhöht
- Sinkt bei Fehlschlägen und abgelaufenen Notrufen
- Benötigt zum Freischalten von Elite-Einheiten

### 😰 Stress
- Steigt mit der Anzahl aktiver Notrufe
- Beeinflusst später die Erfolgsrate (geplant)
- Kann durch Upgrades und Automatisierung reduziert werden

### 🚨 Notfall-Punkte
- Seltene Premium-Währung (später implementiert)
- Für spezielle Upgrades und Power-Ups

## 🚓 Einheiten-Typen

### Polizei
- **Streifenwagen**: Standard-Einheit (100€)
- **SWAT Team**: Elite-Einheit, 50% effizienter (500€, benötigt 100 Reputation)

### Feuerwehr
- **Feuerlöschfahrzeug**: Standard-Einheit (150€)
- **Drehleiter**: Spezialeinheit für Hochhäuser (600€, benötigt 150 Reputation)

### Rettungsdienst
- **Rettungswagen**: Standard-Einheit (120€)
- **Rettungshubschrauber**: Schnellste Einheit, 2x effizienter (800€, benötigt 200 Reputation)

## 🚨 Notruf-Typen

### Polizei-Notrufe
- Einbruch (Medium, 20€)
- Schlägerei (High, 30€)
- Verkehrsunfall (Medium, 25€)

### Feuerwehr-Notrufe
- Kleinbrand (High, 35€)
- Großbrand (High, 60€, Schwierigkeit 4)

### Medizinische Notrufe
- Verletzung (Medium, 30€)
- Medizinischer Notfall (High, 45€)
- Herzinfarkt (High, 55€, Schwierigkeit 4)

## 🎯 Tipps für Anfänger

1. **Perfect Matches sind wichtig**: Schicke immer die richtige Einheit (50% mehr Belohnung!)
2. **Kaufe früh mehr Einheiten**: 2-3 Einheiten pro Typ helfen bei mehreren gleichzeitigen Calls
3. **Lass keine Calls ablaufen**: Verlust von Reputation tut weh
4. **Spare für Elite-Einheiten**: Sie sind teuer, aber viel effizienter
5. **Beobachte deine Erfolgsrate**: Unter 80% bedeutet, du brauchst bessere Einheiten

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Pure CSS mit CSS Custom Properties
- **State Management**: LocalStorage Persistence
- **Architecture**: Modulares Design ohne Dependencies

### Projekt-Struktur

```
Emergency-Dispatch-Idle/
├── index.html              # Haupt-HTML mit Tab-System
├── styles.css             # Alle Styles
├── main.js                # Entry Point & Init
├── src/
│   └── modules/
│       ├── game-state.js      # State Management & Save/Load
│       ├── resources-def.js   # Ressourcen-Definitionen
│       ├── calls-system.js    # Notruf-Generation & Dispatch
│       ├── units-def.js       # Einheiten-Definitionen
│       └── core.js            # Haupt-Game-Loop
├── ui/
│   ├── ui-init.js         # UI Initialisierung
│   └── ui-render.js       # Rendering-Logik
└── README.md
```

## 🔮 Roadmap

### Version 0.2.0 - Buildings & Automation
- Gebäude-System implementieren
- Bauplatz-Management
- Erste Auto-Dispatch-Optionen
- Effekte von Gebäuden auf Einheiten

### Version 0.3.0 - Research & Progression
- Vollständiger Forschungs-Baum (20 Technologien)
- Tier 1-3 Technologien
- Effizienz-Boni und Freischaltungen

### Version 0.4.0 - Achievements & Events
- 30+ Achievements
- Event-System für Großereignisse
- Versteckte Achievements
- Achievement-basierte Belohnungen

### Version 0.5.0 - Prestige
- Vollständiges Prestige-System
- 15+ Prestige-Upgrades
- Career Advancement
- Permanente Boni

### Version 1.0.0 - Polish & Balance
- Vollständiges Balancing
- Offline-Progress erweitert
- Tutorial-System
- Sound-Effekte (optional)
- Mobile-Optimierung

## 📝 Development Notes

### Design-Philosophie

1. **Klarer Loop**: Jede Aktion hat sofortiges Feedback
2. **Strategische Tiefe**: Matching-System belohnt Nachdenken
3. **Progression**: Konstantes Gefühl von Fortschritt
4. **Keine Paywall**: Rein für Spaß, kein Monetarisierung
5. **Mobile-Friendly**: Funktioniert auch auf kleineren Bildschirmen (geplant)

### Balancing-Ziele

- **Early Game**: 30 Minuten bis erste Elite-Einheit
- **Mid Game**: 2-3 Stunden bis Automatisierung
- **Late Game**: 5+ Stunden bis erstes Prestige
- **Erfolgsrate**: 70-90% bei optimalem Spiel
- **Perfect Matches**: 30-50% der Calls sollten perfekt sein

## 👥 Contributing

Beiträge sind willkommen! Dieses Projekt ist ein Lern- und Spaßprojekt.

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

MIT License - siehe LICENSE-Datei für Details

## 💬 Kontakt

Oliver Laudan - [@oliverlaudan-ops](https://github.com/oliverlaudan-ops)

Projekt Link: [https://github.com/oliverlaudan-ops/Emergency-Dispatch-Idle](https://github.com/oliverlaudan-ops/Emergency-Dispatch-Idle)

---

**Status**: 🚧 Early Alpha - Aktiv in Entwicklung

⭐ Wenn dir das Konzept gefällt, gib dem Repo einen Star! ⭐