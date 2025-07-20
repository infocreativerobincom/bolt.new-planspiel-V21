import { useState, useCallback, useEffect } from 'react';
import { GameState, GameMetrics, CompletedDecision, Decision, DecisionOption } from '../types/game';
import { decisions } from '../data/decisions';
import { gameEvents } from '../data/events';
import { SaveGameModal } from '../components/SaveGameModal';

const initialMetrics: GameMetrics = {
  popularitaetBeiWaehlern: 50,
  zufriedenheitSozialdemokratischerKoalitionspartner: 50,
  zufriedenheitLiberalerKoalitionspartner: 50,
  arbeitslosenquote: 5.2,
  wirtschaftswachstum: 1.1,
  investitionsattraktivitaetDeutschlands: 50,
  entwicklungRealeinkommenMedian: 45000,
  schulden: 0,
  zinskosten: 0,
  sicherheitVerteidigungskapazitaeten: 50,
  energiesicherheit: 50,
  co2EmissionReduktionPfad: 50, // Startet bei 50%
  co2ReduktionTonnen: 0, // Startet bei 0 Tonnen
  gesamtbewertung: 50
};

const initialPartyPolls = {
  linke: 5,
  liberale: 15,
  sozialdemokraten: 11,
  progressiven: 25, // Spielerpartei
  konservative: 17,
  rechte: 14,
  gruene: 10,
  sonstige: 3
};

const GAME_STORAGE_KEY = 'political-game-state';
const ANNUAL_BUDGET = 25000000000; // 25 Mrd EUR pro Jahr
const INTEREST_RATE = 0.03; // 3% Zinssatz
const MAX_DECISIONS_PER_YEAR = 8; // Maximal 8 Entscheidungen pro Jahr
const SECONDS_PER_DAY = 1; // 1 echte Sekunde = 1 Spieltag

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Lade gespeicherten Spielstand
    const saved = localStorage.getItem(GAME_STORAGE_KEY);
    if (saved) {
      try {
        const loadedState = JSON.parse(saved);
        // Stelle sicher, dass neue Felder existieren
        if (!loadedState.metrics.co2ReduktionTonnen) {
          loadedState.metrics.co2ReduktionTonnen = 0;
        }
        if (!loadedState.metrics.zufriedenheitSozialdemokratischerKoalitionspartner) {
          loadedState.metrics.zufriedenheitSozialdemokratischerKoalitionspartner = 
            loadedState.metrics.zufriedenheitSozialdemokratischerKoalitionspartner || 50;
        }
        if (!loadedState.timeProgress) {
          loadedState.timeProgress = {
            daysElapsed: 0,
            complexityAccumulated: 0,
            realTimeStart: Date.now(),
            currentDate: new Date(2025, 0, 1), // 01.01.2025
            totalElapsedTime: 0,
            isPaused: false
          };
        }
        if (typeof loadedState.timeProgress.totalElapsedTime === 'undefined') {
          loadedState.timeProgress.totalElapsedTime = 0;
        }
        if (typeof loadedState.timeProgress.isPaused === 'undefined') {
          loadedState.timeProgress.isPaused = false;
        }
        if (!loadedState.timeProgress.currentDate) {
          loadedState.timeProgress.currentDate = new Date(2025, 0, 1);
        }
        if (typeof loadedState.timeProgress.daysElapsed === 'undefined') {
          loadedState.timeProgress.daysElapsed = loadedState.timeProgress.monthsElapsed * 30 || 0;
        }
        if (!loadedState.partyPolls) {
          loadedState.partyPolls = { ...initialPartyPolls };
        }
        return loadedState;
      } catch (e) {
        console.error('Fehler beim Laden des Spielstands:', e);
      }
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      playerId: 'player1',
      currentYear: 2025,
      currentDecision: 0,
      completedDecisions: [],
      metrics: initialMetrics,
      availableDecisions: decisions.map(d => d.id),
      triggeredEvents: [],
      partyPolls: { ...initialPartyPolls },
      budget: {
        availableBudgetCurrentPeriod: ANNUAL_BUDGET,
        totalSpentCurrentPeriod: 0,
        totalDebt: 0,
        annualInterestCosts: 0,
        currentPeriod: 1,
        periods: [
          { id: 1, years: '2025-2029', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 },
          { id: 2, years: '2029-2033', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 },
          { id: 3, years: '2033-2037', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 }
        ]
      },
      coalitionStatus: {
        leftPartnerSatisfaction: 50,
        liberalPartnerSatisfaction: 50,
        stabilityRisk: 'low',
        crisisEvents: []
      },
      timeProgress: {
        daysElapsed: 0,
        complexityAccumulated: 0,
        realTimeStart: Date.now(),
        currentDate: new Date(2025, 0, 1), // 01.01.2025
        totalElapsedTime: 0,
        isPaused: false
      },
      shownYearlyEvaluations: [],
      shownLegislatureEvaluations: []
    };
  });

  // Timer-System: Kontinuierlicher Timer - NIEMALS ZURÜCKSETZEN
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Speichere Spielstand bei jeder Änderung
  useEffect(() => {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Timer für Zeitfortschritt - läuft kontinuierlich wenn aktiv
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!gameState.timeProgress.isPaused) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const newSeconds = prev + 1;
          
          // Berechne das neue Datum basierend auf Timer-Sekunden
          const startDate = new Date(2025, 0, 1); // 01.01.2025
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + newSeconds); // Jede Sekunde = 1 Tag
          const currentYear = currentDate.getFullYear();
          
          setGameState(prevState => ({
            ...prevState,
            currentYear: Math.min(2037, currentYear),
            timeProgress: {
              ...prevState.timeProgress,
              daysElapsed: newSeconds,
              currentDate: currentDate,
              totalElapsedTime: newSeconds * 1000 // Für Kompatibilität
            }
          }));
          
          return newSeconds;
        });
      }, 1000); // Jede Sekunde
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.timeProgress.isPaused]);

  // Initialisiere Timer-Sekunden aus gespeichertem Spielstand
  useEffect(() => {
    if (gameState.timeProgress?.daysElapsed !== undefined) {
      setTimerSeconds(gameState.timeProgress.daysElapsed);
    }
  }, []);

  // Altes Timer-System entfernt - wird nicht mehr verwendet
  useEffect(() => {
    // Leerer Effect - das alte Timer-System wurde entfernt
  }, []);

  const startDecisionTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timeProgress: {
        ...prev.timeProgress,
        isPaused: false
      }
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timeProgress: {
        ...prev.timeProgress,
        isPaused: true
      }
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timeProgress: {
        ...prev.timeProgress,
        isPaused: false
      }
    }));
  }, []);

  const getCurrentTimerDisplay = useCallback(() => {
    const totalSeconds = timerSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds };
  }, [timerSeconds]);

  const advanceToEndOfYear = useCallback(() => {
    setGameState(prev => {
      const currentDate = new Date(prev.timeProgress.currentDate);
      const nextYearStart = new Date(currentDate.getFullYear() + 1, 0, 1);
      const daysToAdd = Math.ceil((nextYearStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const newTimerSeconds = timerSeconds + daysToAdd;
      
      setTimerSeconds(newTimerSeconds);
      
      return {
        ...prev,
        currentYear: Math.min(2037, nextYearStart.getFullYear()),
        budget: {
          ...prev.budget,
          availableBudgetCurrentPeriod: ANNUAL_BUDGET,
          totalSpentCurrentPeriod: 0
        },
        timeProgress: {
          ...prev.timeProgress,
          currentDate: nextYearStart,
          daysElapsed: newTimerSeconds,
          totalElapsedTime: newTimerSeconds * 1000
        }
      };
    });
  }, [timerSeconds]);

  const advanceToEndOfLegislature = useCallback(() => {
    setGameState(prev => {
      const currentDate = new Date(prev.timeProgress.currentDate);
      const currentYear = currentDate.getFullYear();
      const currentLegislatureEnd = Math.ceil((currentYear - 2025 + 1) / 4) * 4 + 2025;
      const legislatureEndDate = new Date(currentLegislatureEnd, 0, 1);
      const daysToAdd = Math.ceil((legislatureEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const newTimerSeconds = timerSeconds + daysToAdd;
      
      setTimerSeconds(newTimerSeconds);
      
      return {
        ...prev,
        currentYear: Math.min(2037, currentLegislatureEnd),
        budget: {
          ...prev.budget,
          availableBudgetCurrentPeriod: ANNUAL_BUDGET,
          totalSpentCurrentPeriod: 0
        },
        timeProgress: {
          ...prev.timeProgress,
          currentDate: legislatureEndDate,
          daysElapsed: newTimerSeconds,
          totalElapsedTime: newTimerSeconds * 1000
        }
      };
    });
  }, [timerSeconds]);
        
        setGameState(prev => ({
          ...prev,
          currentYear: Math.min(2037, currentYear),
          timeProgress: {
            ...prev.timeProgress,
            daysElapsed: totalDaysElapsed,
            currentDate: currentDate
          }
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.timeProgress.isPaused, timerStartTime, gameState.timeProgress.totalElapsedTime]);

  const calculatePartyPollChanges = useCallback((decision: Decision, selectedOptions: DecisionOption[], currentPolls: any) => {
    const newPolls = { ...currentPolls };
    
    // Erweiterte Parteien-Dynamik mit Stammwähler-Logik
    selectedOptions.forEach(option => {
      let changes = { linke: 0, liberale: 0, sozialdemokraten: 0, progressiven: 0, konservative: 0, rechte: 0, gruene: 0, sonstige: 0 };
      
      // Kategoriebasierte Änderungen mit Wechselwähler-Logik (40% können wechseln)
      switch (decision.category) {
        case 'umweltpolitik':
          // Grüne Politik: Progressiven gewinnen von Grünen, verlieren an Konservative/Rechte
          const greenVoters = currentPolls.gruene * 0.4 * 0.3; // 30% der Wechselwähler
          changes.progressiven += greenVoters;
          changes.gruene -= greenVoters;
          
          const conservativeLoss = currentPolls.progressiven * 0.4 * 0.2; // 20% der Wechselwähler
          changes.progressiven -= conservativeLoss;
          changes.konservative += conservativeLoss * 0.6;
          changes.rechte += conservativeLoss * 0.4;
          break;
          
        case 'wirtschaft':
          // Wirtschaftspolitik: Gewinne von Liberalen/Konservativen, Verluste an Linke
          const liberalVoters = currentPolls.liberale * 0.4 * 0.25;
          changes.progressiven += liberalVoters;
          changes.liberale -= liberalVoters;
          
          const leftLoss = currentPolls.progressiven * 0.4 * 0.15;
          changes.progressiven -= leftLoss;
          changes.linke += leftLoss * 0.7;
          changes.sozialdemokraten += leftLoss * 0.3;
          break;
          
        case 'soziales':
          // Sozialpolitik: Gewinne von Linken/Sozialdemokraten
          const leftVoters = (currentPolls.linke + currentPolls.sozialdemokraten) * 0.4 * 0.2;
          changes.progressiven += leftVoters;
          changes.linke -= leftVoters * 0.4;
          changes.sozialdemokraten -= leftVoters * 0.6;
          
          const rightLoss = currentPolls.progressiven * 0.4 * 0.1;
          changes.progressiven -= rightLoss;
          changes.liberale += rightLoss * 0.5;
          changes.konservative += rightLoss * 0.5;
          break;
          
        case 'verteidigung':
          // Verteidigungspolitik: Gewinne von Konservativen/Rechten
          const rightVoters = (currentPolls.konservative + currentPolls.rechte) * 0.4 * 0.2;
          changes.progressiven += rightVoters;
          changes.konservative -= rightVoters * 0.6;
          changes.rechte -= rightVoters * 0.4;
          
          const pacifistLoss = currentPolls.progressiven * 0.4 * 0.15;
          changes.progressiven -= pacifistLoss;
          changes.linke += pacifistLoss * 0.6;
          changes.gruene += pacifistLoss * 0.4;
          break;
          
        case 'migration':
          // Migrationspolitik: Je nach Richtung unterschiedliche Effekte
          if (option.cost > 5000000000) { // Teure = liberale Migrationspolitik
            const leftVoters = (currentPolls.linke + currentPolls.gruene) * 0.4 * 0.15;
            changes.progressiven += leftVoters;
            changes.linke -= leftVoters * 0.6;
            changes.gruene -= leftVoters * 0.4;
            
            const rightLoss = currentPolls.progressiven * 0.4 * 0.25;
            changes.progressiven -= rightLoss;
            changes.rechte += rightLoss * 0.7;
            changes.konservative += rightLoss * 0.3;
          } else { // Restriktive Migrationspolitik
            const rightVoters = currentPolls.rechte * 0.4 * 0.2;
            changes.progressiven += rightVoters;
            changes.rechte -= rightVoters;
            
            const leftLoss = currentPolls.progressiven * 0.4 * 0.1;
            changes.progressiven -= leftLoss;
            changes.linke += leftLoss;
          }
          break;
      }
      
      // Kostenbasierte Änderungen
      if (option.cost > 15000000000) { // Sehr teure Maßnahmen
        const fiscalConservativeLoss = currentPolls.progressiven * 0.4 * 0.1;
        changes.progressiven -= fiscalConservativeLoss;
        changes.liberale += fiscalConservativeLoss * 0.6;
        changes.konservative += fiscalConservativeLoss * 0.4;
      } else if (option.cost < 0) { // Steuererhöhungen/Einsparungen (Einnahmen)
        const fiscalConservativeGain = (currentPolls.liberale + currentPolls.konservative) * 0.4 * 0.05;
        changes.progressiven += fiscalConservativeGain;
        changes.liberale -= fiscalConservativeGain * 0.6;
        changes.konservative -= fiscalConservativeGain * 0.4;
      }
      
      // Anwenden der Änderungen
      Object.keys(changes).forEach(party => {
        newPolls[party] += changes[party];
      });
    });
    
    // Normalisierung auf 100%
    const sum = Object.values(newPolls).reduce((a: number, b: number) => a + b, 0);
    if (sum !== 100) {
      const factor = 100 / sum;
      Object.keys(newPolls).forEach(party => {
        newPolls[party] = Math.max(0.1, newPolls[party] * factor);
      });
    }
    
    // Runde auf 1 Dezimalstelle
    Object.keys(newPolls).forEach(party => {
      newPolls[party] = Math.round(newPolls[party] * 10) / 10;
    });
    
    return newPolls;
  }, []);

  const calculateMedianRealeinkommenDevelopment = useCallback((metrics: GameMetrics, previousIncome: number = 45000): number => {
    let development = 0;
    
    // Wirtschaftswachstum Einfluss (max 4% Steigerung pro Jahr = 1800€ bei 45000€)
    const maxYearlyIncrease = previousIncome * 0.04;
    development += Math.min(metrics.wirtschaftswachstum * 300, maxYearlyIncrease); // Reduziert von 400 auf 300
    
    // Arbeitslosigkeit Einfluss (umgekehrt)
    development -= (metrics.arbeitslosenquote - 3) * 150; // Reduziert von 200 auf 150
    
    // Schulden/Zinskosten Einfluss
    const schuldenBelastung = Math.abs(metrics.schulden) / 1000000000; // in Milliarden
    development -= schuldenBelastung * 15; // Reduziert von 20 auf 15
    
    // Inflation simulieren (vereinfacht über Schulden)
    const inflationseffekt = Math.min(2, schuldenBelastung / 50); // Reduziert von 3 auf 2
    development -= inflationseffekt * 100; // Reduziert von 150 auf 100
    
    // Maximal 4% Steigerung pro Jahr
    development = Math.max(-1000, Math.min(maxYearlyIncrease, development)); // Reduziert von -1200 auf -1000
    
    return Math.max(40000, Math.min(80000, previousIncome + development));
  }, []);

  const calculateCO2ReductionPercentage = useCallback((tonnesReduced: number): number => {
    // 10 Millionen Tonnen = 1% auf dem Reduktionspfad
    // Ausgangswert ist 50%
    const baseValue = 50;
    const percentageChange = tonnesReduced / 10000000; // 10 Mio Tonnen = 1%
    return Math.min(100, Math.max(0, baseValue + percentageChange));
  }, []);

  const calculateGesamtbewertung = useCallback((metrics: GameMetrics): number => {
    const components = {
      popularitaet: { value: metrics.popularitaetBeiWaehlern, weight: 0.15, baseline: 50 },
      koalitionSozial: { value: metrics.zufriedenheitSozialdemokratischerKoalitionspartner, weight: 0.05, baseline: 50 },
      koalitionLiberal: { value: metrics.zufriedenheitLiberalerKoalitionspartner, weight: 0.05, baseline: 50 },
      arbeitslosigkeit: { value: Math.max(0, 100 - (metrics.arbeitslosenquote * 14.3)), weight: 0.10, baseline: 50 },
      wirtschaftswachstum: { value: Math.max(0, Math.min(100, 50 + (metrics.wirtschaftswachstum * 20))), weight: 0.15, baseline: 50 },
      investitionsattraktivitaet: { value: metrics.investitionsattraktivitaetDeutschlands, weight: 0.10, baseline: 50 },
      realeinkommen: { value: Math.max(0, Math.min(100, ((metrics.entwicklungRealeinkommenMedian - 40000) / 400))), weight: 0.10, baseline: 50 },
      schuldenbelastung: { value: Math.max(0, 100 - (Math.abs(metrics.schulden) / 2000000000)), weight: 0.05, baseline: 50 },
      sicherheit: { value: metrics.sicherheitVerteidigungskapazitaeten, weight: 0.10, baseline: 50 },
      energiesicherheit: { value: metrics.energiesicherheit, weight: 0.10, baseline: 50 },
      klimaschutz: { value: metrics.co2EmissionReduktionPfad, weight: 0.05, baseline: 50 }
    };

    let totalScore = 0;
    Object.values(components).forEach(component => {
      const normalizedValue = Math.max(5, Math.min(95, component.value));
      totalScore += normalizedValue * component.weight;
    });

    return Math.max(5, Math.min(98, totalScore));
  }, []);

  const checkForEvents = useCallback((newMetrics: GameMetrics, completedDecisions: CompletedDecision[], currentYear: number) => {
    const triggeredEvents = [];
    
    gameEvents.forEach(event => {
      // Prüfe ob Event bereits ausgelöst wurde (verhindert Wiederholung)
      const alreadyTriggered = gameState.triggeredEvents.some(te => te.id === event.id);
      if (alreadyTriggered) return;

      const shouldTrigger = event.triggerConditions.every(condition => {
        const currentValue = newMetrics[condition.metric];
        switch (condition.operator) {
          case 'gt': return currentValue > condition.value;
          case 'lt': return currentValue < condition.value;
          case 'eq': return currentValue === condition.value;
          case 'gte': return currentValue >= condition.value;
          case 'lte': return currentValue <= condition.value;
          default: return false;
        }
      });

      if (shouldTrigger && Math.random() < event.probability) {
        triggeredEvents.push({
          id: event.id,
          title: event.title,
          description: event.description,
          year: currentYear,
          effects: event.effects,
          stakeholder: event.stakeholder,
          triggerReason: `Ausgelöst durch: ${event.triggerConditions.map(c => 
            `${c.metric} ${c.operator} ${c.value}`).join(' und ')}`
        });
      }
    });

    return triggeredEvents;
  }, [gameState.triggeredEvents]);

  const checkCoalitionStability = useCallback((metrics: GameMetrics) => {
    if (metrics.zufriedenheitSozialdemokratischerKoalitionspartner <= 10 || 
        metrics.zufriedenheitLiberalerKoalitionspartner <= 10) {
      return {
        gameOver: true,
        reason: 'Koalitionsbruch - Neuwahlen erforderlich',
        description: 'Ein Koalitionspartner hat das Vertrauen verloren. Die Regierung ist gestürzt.'
      };
    }

    if (metrics.popularitaetBeiWaehlern <= 15) {
      return {
        gameOver: true,
        reason: 'Misstrauensvotum - Regierung abgewählt',
        description: 'Die Popularität ist so niedrig, dass ein Misstrauensvotum erfolgreich war.'
      };
    }

    if (Math.abs(metrics.schulden) > 500000000000) { // 500 Mrd
      return {
        gameOver: true,
        reason: 'Staatsinsolvenz - Handlungsunfähigkeit',
        description: 'Die Schuldenlast ist untragbar geworden. Deutschland ist handlungsunfähig.'
      };
    }

    return { gameOver: false };
  }, []);

  const applyBudgetCosts = useCallback((totalCost: number, currentBudget: any) => {
    const newBudget = { ...currentBudget };
    let totalDebt = 0;

    if (totalCost > newBudget.availableBudgetCurrentPeriod) {
      // Kosten übersteigen verfügbares Budget
      totalDebt = totalCost - newBudget.availableBudgetCurrentPeriod;
      newBudget.totalSpentCurrentPeriod += newBudget.availableBudgetCurrentPeriod;
      newBudget.availableBudgetCurrentPeriod = 0; // Budget fällt auf 0, nicht unter 0
    } else {
      // Kosten können vollständig vom Budget gedeckt werden
      newBudget.totalSpentCurrentPeriod += totalCost;
      newBudget.availableBudgetCurrentPeriod -= totalCost;
    }

    newBudget.totalDebt += totalDebt;
    newBudget.annualInterestCosts = newBudget.totalDebt * INTEREST_RATE;

    return { newBudget, totalDebt };
  }, []);

  const advanceToEndOfYear = useCallback(() => {
    setGameState(prev => {
      const newYear = prev.currentYear + 1;
      const newBudget = { ...prev.budget };
      
      // Neues jährliches Budget nur bei Jahreswechsel
      newBudget.availableBudgetCurrentPeriod = ANNUAL_BUDGET;
      newBudget.totalSpentCurrentPeriod = 0;
      
      // Berechne Tage bis zum 01.01. des nächsten Jahres
      const currentDate = new Date(prev.timeProgress.currentDate);
      const nextYearStart = new Date(newYear, 0, 1);
      const daysToAdd = Math.ceil((nextYearStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const timeToAdd = daysToAdd * SECONDS_PER_DAY * 1000;
      const newTotalElapsedTime = prev.timeProgress.totalElapsedTime + timeToAdd;
      
      return {
        ...prev,
        currentYear: Math.min(2037, newYear),
        budget: newBudget,
        timeProgress: {
          ...prev.timeProgress,
          currentDate: new Date(newYear, 0, 1),
          daysElapsed: prev.timeProgress.daysElapsed + daysToAdd,
          totalElapsedTime: newTotalElapsedTime
        }
      };
    });
    
    // Timer-Startzeit entsprechend anpassen
    if (timerStartTime) {
      const currentDate = new Date(gameState.timeProgress.currentDate);
      const nextYearStart = new Date(gameState.currentYear + 1, 0, 1);
      const daysToAdd = Math.ceil((nextYearStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const timeToAdd = daysToAdd * SECONDS_PER_DAY * 1000;
      setTimerStartTime(Date.now() - timeToAdd);
    }
  }, [gameState.timeProgress.currentDate, gameState.currentYear, timerStartTime]);


  const applyDecision = useCallback((decision: Decision, selectedOptions: DecisionOption[]) => {
    setGameState(prev => {
      const newMetrics = { ...prev.metrics };
      const previousIncome = prev.metrics.entwicklungRealeinkommenMedian;
      let totalCost = 0;

      // Prüfe auf widersprüchliche Optionen
      const hasConflict = selectedOptions.some((option1, i) => 
        selectedOptions.some((option2, j) => 
          i !== j && option1.conflicts?.includes(option2.id)
        )
      );

      if (hasConflict) {
        alert('Diese Optionen widersprechen sich und können nicht gleichzeitig gewählt werden.');
        return prev;
      }

      // Prüfe Entscheidungslimit pro Jahr
      const decisionsThisYear = prev.completedDecisions.filter(d => d.year === prev.currentYear).length;
      // Entscheidungslimit wird jetzt in der App-Komponente geprüft

      selectedOptions.forEach(option => {
        totalCost += option.cost;
        
        option.effects.forEach(effect => {
          let value = effect.value;
          
          // Multiplikator basierend auf aktuellem Zustand
          if (effect.conditional) {
            const condition = effect.conditional.condition;
            const currentValue = prev.metrics[condition.metric];
            
            if (
              (condition.operator === 'gt' && currentValue > condition.value) ||
              (condition.operator === 'lt' && currentValue < condition.value) ||
              (condition.operator === 'eq' && currentValue === condition.value) ||
              (condition.operator === 'gte' && currentValue >= condition.value) ||
              (condition.operator === 'lte' && currentValue <= condition.value)
            ) {
              value *= effect.conditional.multiplier;
            }
          }
          
          if (effect.metric === 'co2ReduktionTonnen') {
            newMetrics.co2ReduktionTonnen += value;
            // CO2-Pfad basierend auf Tonnen berechnen
            newMetrics.co2EmissionReduktionPfad = calculateCO2ReductionPercentage(newMetrics.co2ReduktionTonnen);
          } else if (effect.metric === 'schulden') {
            // Schulden sind IMMER negativ - Kosten erhöhen Schulden
            newMetrics.schulden -= Math.abs(value);
          } else if (effect.metric === 'arbeitslosenquote') {
            // Arbeitslosenquote: Neue Arbeitsplätze senken die Quote
            newMetrics[effect.metric] += value;
          } else {
            newMetrics[effect.metric] += value;
          }
        });
      });

      // Budget-Berechnungen - korrekte Logik
      const { newBudget, totalDebt } = applyBudgetCosts(totalCost, prev.budget);

      // Schulden und Zinskosten aktualisieren - Schulden sind NEGATIV
      newMetrics.schulden -= totalDebt; // Schulden werden negativer
      newMetrics.zinskosten = newBudget.annualInterestCosts;

      // Median-Realeinkommen berechnen mit vorherigem Wert
      newMetrics.entwicklungRealeinkommenMedian = calculateMedianRealeinkommenDevelopment(newMetrics, previousIncome);

      // Grenzen einhalten (moderater)
      newMetrics.arbeitslosenquote = Math.max(1, Math.min(7, newMetrics.arbeitslosenquote));
      newMetrics.wirtschaftswachstum = Math.max(-3, Math.min(3, newMetrics.wirtschaftswachstum)); // Reduziert von -5/5 auf -3/3
      newMetrics.popularitaetBeiWaehlern = Math.max(20, Math.min(80, newMetrics.popularitaetBeiWaehlern));
      newMetrics.zufriedenheitSozialdemokratischerKoalitionspartner = Math.max(0, Math.min(90, newMetrics.zufriedenheitSozialdemokratischerKoalitionspartner));
      newMetrics.zufriedenheitLiberalerKoalitionspartner = Math.max(0, Math.min(90, newMetrics.zufriedenheitLiberalerKoalitionspartner));
      newMetrics.energiesicherheit = Math.max(10, Math.min(95, newMetrics.energiesicherheit));
      newMetrics.sicherheitVerteidigungskapazitaeten = Math.max(20, Math.min(90, newMetrics.sicherheitVerteidigungskapazitaeten));
      newMetrics.investitionsattraktivitaetDeutschlands = Math.max(10, Math.min(95, newMetrics.investitionsattraktivitaetDeutschlands));
      newMetrics.co2EmissionReduktionPfad = Math.max(0, Math.min(100, newMetrics.co2EmissionReduktionPfad));
      newMetrics.schulden = Math.min(0, newMetrics.schulden); // Schulden können nicht positiv werden

      // Gesamtbewertung berechnen
      newMetrics.gesamtbewertung = calculateGesamtbewertung(newMetrics);

      // Parteiumfragen aktualisieren
      const newPartyPolls = calculatePartyPollChanges(decision, selectedOptions, prev.partyPolls);

      const completedDecision: CompletedDecision = {
        decisionId: decision.id,
        optionIds: selectedOptions.map(o => o.id),
        year: prev.currentYear,
        effects: selectedOptions.flatMap(o => o.effects),
        cost: totalCost,
        decisionTitle: decision.title,
        selectedOptionTitles: selectedOptions.map(o => o.title)
      };

      const newCompletedDecisions = [...prev.completedDecisions, completedDecision];


      // Ereignisse prüfen
      const newEvents = checkForEvents(newMetrics, newCompletedDecisions, prev.currentYear);
      
      // Ereigniseffekte anwenden
      newEvents.forEach(event => {
        event.effects.forEach(effect => {
          if (effect.metric === 'schulden') {
            const eventCost = effect.value;
            const { newBudget: eventBudget, totalDebt: eventDebt } = applyBudgetCosts(eventCost, newBudget);
            Object.assign(newBudget, eventBudget);
            newMetrics.schulden -= eventDebt; // Schulden werden negativer
            newMetrics.zinskosten = newBudget.annualInterestCosts;
          } else if (effect.metric === 'co2ReduktionTonnen') {
            newMetrics.co2ReduktionTonnen += effect.value;
            newMetrics.co2EmissionReduktionPfad = calculateCO2ReductionPercentage(newMetrics.co2ReduktionTonnen);
          } else if (effect.metric === 'entwicklungRealeinkommenMedian') {
            // Realeinkommen-Ereignisse: Maximal 4% pro Jahr
            const maxIncrease = newMetrics.entwicklungRealeinkommenMedian * 0.04;
            const adjustedValue = Math.min(Math.abs(effect.value), maxIncrease) * Math.sign(effect.value);
            newMetrics[effect.metric] += adjustedValue;
          } else {
            newMetrics[effect.metric] += effect.value;
          }
        });
      });

      // Koalitionsstabilität prüfen
      const stabilityCheck = checkCoalitionStability(newMetrics);
      
      // Entscheidung aus verfügbaren Entscheidungen entfernen
      const newAvailableDecisions = prev.availableDecisions.filter(id => id !== decision.id);

      // Neue Entscheidungen freischalten basierend auf Bedingungen
      const unlockedDecisions = decisions.filter(d => 
        !newAvailableDecisions.includes(d.id) && 
        !newCompletedDecisions.some(cd => cd.decisionId === d.id) &&
        d.prerequisites?.every(prereq => 
          newCompletedDecisions.some(cd => cd.decisionId === prereq)
        )
      ).map(d => d.id);

      return {
        ...prev,
        currentYear: prev.currentYear,
        currentDecision: prev.currentDecision + 1,
        completedDecisions: newCompletedDecisions,
        metrics: newMetrics,
        partyPolls: newPartyPolls,
        budget: newBudget,
        timeProgress: prev.timeProgress,
        triggeredEvents: [...prev.triggeredEvents, ...newEvents],
        availableDecisions: [...newAvailableDecisions, ...unlockedDecisions],
        coalitionStatus: {
          leftPartnerSatisfaction: newMetrics.zufriedenheitSozialdemokratischerKoalitionspartner,
          liberalPartnerSatisfaction: newMetrics.zufriedenheitLiberalerKoalitionspartner,
          stabilityRisk: 
            newMetrics.zufriedenheitSozialdemokratischerKoalitionspartner < 30 || 
            newMetrics.zufriedenheitLiberalerKoalitionspartner < 30 ? 'high' :
            newMetrics.zufriedenheitSozialdemokratischerKoalitionspartner < 50 || 
            newMetrics.zufriedenheitLiberalerKoalitionspartner < 50 ? 'medium' : 'low',
          crisisEvents: stabilityCheck.gameOver ? [stabilityCheck.reason] : []
        },
        gameOver: stabilityCheck.gameOver ? {
          reason: stabilityCheck.reason,
          description: stabilityCheck.description
        } : undefined
      };
    });
  }, [calculateGesamtbewertung, calculateMedianRealeinkommenDevelopment, calculateCO2ReductionPercentage, checkForEvents, checkCoalitionStability, applyBudgetCosts, calculatePartyPollChanges]);

  const startDecisionTimer = useCallback(() => {
    if (!timerStartTime) {
      // Erster Start des Timers
      const startTime = Date.now();
      setTimerStartTime(startTime);
    }
    setGameState(prev => ({
      ...prev,
      timeProgress: {
        ...prev.timeProgress,
        isPaused: false
      }
    }));
  }, [timerStartTime]);

  const pauseTimer = useCallback(() => {
    if (!gameState.timeProgress.isPaused && timerStartTime) {
      // Speichere die bisher verstrichene Zeit
      const sessionElapsed = Date.now() - timerStartTime;
      setGameState(prev => ({
        ...prev,
        timeProgress: {
          ...prev.timeProgress,
          totalElapsedTime: prev.timeProgress.totalElapsedTime + sessionElapsed,
          isPaused: true
        }
      }));
    }
  }, [gameState.timeProgress.isPaused, timerStartTime]);

  const resumeTimer = useCallback(() => {
    if (gameState.timeProgress.isPaused) {
      // Setze neuen Startpunkt, aber behalte die gespeicherte Zeit
      setTimerStartTime(Date.now());
      setGameState(prev => ({
        ...prev,
        timeProgress: {
          ...prev.timeProgress,
          isPaused: false
        }
      }));
    }
  }, [gameState.timeProgress.isPaused]);

  const getAvailableDecisions = useCallback(() => {
    return decisions.filter(d => gameState.availableDecisions.includes(d.id));
  }, [gameState.availableDecisions]);

  const shouldShowEvaluation = useCallback(() => {
    return gameState.currentDecision > 0 && gameState.currentDecision % 10 === 0;
  }, [gameState.currentDecision]);

  const getMetricsHistory = useCallback(() => {
    const history = [{ 
      decision: 0, 
      metrics: { ...initialMetrics }, 
      decisionName: 'Spielstart',
      year: 2025,
      selectedOptions: '',
      isEvent: false
    }];
    
    let currentMetrics = { ...initialMetrics };
    let previousIncome = 45000;
    
    // Entscheidungen und Ereignisse chronologisch sortieren
    const allActions = [];
    
    // Entscheidungen hinzufügen
    gameState.completedDecisions.forEach((decision, index) => {
      allActions.push({
        type: 'decision',
        data: decision,
        index: index + 1,
        year: decision.year
      });
    });
    
    // Ereignisse hinzufügen
    gameState.triggeredEvents.forEach((event) => {
      allActions.push({
        type: 'event',
        data: event,
        year: event.year
      });
    });
    
    // Nach Jahr sortieren
    allActions.sort((a, b) => a.year - b.year);
    
    let decisionCounter = 0;
    
    allActions.forEach((action) => {
      if (action.type === 'decision') {
        decisionCounter++;
        const decision = action.data;
        const decisionData = decisions.find(d => d.id === decision.decisionId);
        
        // Effekte korrekt anwenden - EXAKT wie im Spiel
        decision.effects.forEach(effect => {
          if (effect.metric === 'co2ReduktionTonnen') {
            currentMetrics.co2ReduktionTonnen += effect.value;
            currentMetrics.co2EmissionReduktionPfad = calculateCO2ReductionPercentage(currentMetrics.co2ReduktionTonnen);
          } else if (effect.metric === 'schulden') {
            // Schulden sind IMMER negativ
            currentMetrics.schulden -= Math.abs(effect.value);
          } else if (effect.metric === 'entwicklungRealeinkommenMedian') {
            // Wird separat berechnet
          } else {
            currentMetrics[effect.metric] += effect.value;
          }
        });
        
        // Median-Realeinkommen neu berechnen mit vorherigem Wert
        currentMetrics.entwicklungRealeinkommenMedian = calculateMedianRealeinkommenDevelopment(currentMetrics, previousIncome);
        previousIncome = currentMetrics.entwicklungRealeinkommenMedian;
        
        // Gesamtbewertung neu berechnen
        currentMetrics.gesamtbewertung = calculateGesamtbewertung(currentMetrics);
        
        history.push({
          decision: decisionCounter,
          metrics: { ...currentMetrics },
          decisionName: decision.decisionTitle || decisionData?.title || 'Unbekannte Entscheidung',
          selectedOptions: decision.selectedOptionTitles?.join(', ') || '',
          year: decision.year,
          isEvent: false
        });
      } else if (action.type === 'event') {
        const event = action.data;
        
        // Ereigniseffekte anwenden
        event.effects.forEach(effect => {
          if (effect.metric === 'co2ReduktionTonnen') {
            currentMetrics.co2ReduktionTonnen += effect.value;
            currentMetrics.co2EmissionReduktionPfad = calculateCO2ReductionPercentage(currentMetrics.co2ReduktionTonnen);
          } else if (effect.metric === 'schulden') {
            // Ereignis-Schulden werden als negative Werte behandelt
            currentMetrics.schulden -= Math.abs(effect.value);
          } else if (effect.metric === 'entwicklungRealeinkommenMedian') {
            const maxIncrease = currentMetrics.entwicklungRealeinkommenMedian * 0.04;
            const adjustedValue = Math.min(Math.abs(effect.value), maxIncrease) * Math.sign(effect.value);
            currentMetrics[effect.metric] += adjustedValue;
          } else {
            currentMetrics[effect.metric] += effect.value;
          }
        });
        
        // Gesamtbewertung neu berechnen
        currentMetrics.gesamtbewertung = calculateGesamtbewertung(currentMetrics);
        
        history.push({
          decision: decisionCounter + 0.5, // Ereignisse zwischen Entscheidungen
          metrics: { ...currentMetrics },
          decisionName: `Ereignis: ${event.title}`,
          selectedOptions: event.description,
          year: event.year,
          isEvent: true
        });
      }
    });
    
    return history;
  }, [gameState.completedDecisions, gameState.triggeredEvents, calculateGesamtbewertung, calculateMedianRealeinkommenDevelopment, calculateCO2ReductionPercentage]);

  const formatCurrency = useCallback((value: number): string => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Mrd. €`;
    } else if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Mio. €`;
    } else {
      return `${value.toLocaleString('de-DE')} €`;
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_STORAGE_KEY);
    const newStartTime = Date.now();
    setGameState({
      id: Math.random().toString(36).substr(2, 9),
      playerId: 'player1',
      currentYear: 2025,
      currentDecision: 0,
      completedDecisions: [],
      metrics: { ...initialMetrics },
      partyPolls: { ...initialPartyPolls },
      availableDecisions: decisions.map(d => d.id),
      triggeredEvents: [],
      budget: {
        availableBudgetCurrentPeriod: ANNUAL_BUDGET,
        totalSpentCurrentPeriod: 0,
        totalDebt: 0,
        annualInterestCosts: 0,
        currentPeriod: 1,
        periods: [
          { id: 1, years: '2025-2029', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 },
          { id: 2, years: '2029-2033', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 },
          { id: 3, years: '2033-2037', budget: ANNUAL_BUDGET * 4, spent: 0, remaining: ANNUAL_BUDGET * 4 }
        ]
      },
      coalitionStatus: {
        leftPartnerSatisfaction: 50,
        liberalPartnerSatisfaction: 50,
        stabilityRisk: 'low',
        crisisEvents: []
      },
      timeProgress: {
        daysElapsed: 0,
        complexityAccumulated: 0,
        realTimeStart: newStartTime,
        currentDate: new Date(2025, 0, 1),
        totalElapsedTime: 0,
        isPaused: false
      }
    });
    setTimerStartTime(newStartTime);
  }, []);

  const getCurrentMonth = useCallback(() => {
    if (!gameState.timeProgress?.currentDate) return '01.01.2025';
    
    const date = new Date(gameState.timeProgress.currentDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  }, [gameState.timeProgress?.currentDate]);

  const getCurrentTimerDisplay = useCallback(() => {
    if (!timerStartTime) return { hours: 0, minutes: 0, seconds: 0 };
    
    const totalElapsed = !gameState.timeProgress.isPaused ? 
      (gameState.timeProgress.totalElapsedTime + (Date.now() - timerStartTime)) : 
      gameState.timeProgress.totalElapsedTime;
    
    const hours = Math.floor(totalElapsed / (1000 * 60 * 60));
    const minutes = Math.floor((totalElapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalElapsed % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  }, [timerStartTime, gameState.timeProgress.isPaused, gameState.timeProgress.totalElapsedTime]);

  const loadSavedGame = useCallback((saveId: string) => {
    const saved = localStorage.getItem('political-game-saves');
    if (saved) {
      const saves = JSON.parse(saved);
      const saveGame = saves.find((s: any) => s.id === saveId);
      if (saveGame) {
        setGameState(saveGame.gameState);
        // Timer entsprechend setzen
        if (saveGame.gameState.timeProgress) {
          setTimerStartTime(Date.now() - saveGame.gameState.timeProgress.totalElapsedTime);
        }
      }
    }
  }, []);

  const saveCurrentGame = useCallback((name: string) => {
    // Wird vom SaveGameModal gehandhabt
  }, []);

  // Prüfe ob Jahr abgeschlossen ist (8 Entscheidungen oder Jahreswechsel)
  const shouldShowYearlyEvaluation = useCallback(() => {
    const currentYear = gameState.currentYear;
    const currentDate = new Date(gameState.timeProgress?.currentDate || new Date(2025, 0, 1));
    const isNewYear = currentDate.getMonth() === 0 && currentDate.getDate() === 1;
    const decisionsThisYear = gameState.completedDecisions.filter(d => d.year === currentYear).length;
    
    // Jahresbilanz wenn 8 Entscheidungen getroffen wurden ODER am 01.01. des neuen Jahres
    if (decisionsThisYear >= 8) {
      const alreadyShown = gameState.shownYearlyEvaluations?.includes(currentYear) || false;
      return !alreadyShown;
    }
    
    if (isNewYear && currentYear > 2025) {
      const lastYear = currentYear - 1;
      const alreadyShown = gameState.shownYearlyEvaluations?.includes(lastYear) || false;
      return !alreadyShown;
    }
    
    return false;
  }, [gameState.completedDecisions, gameState.currentYear, gameState.timeProgress?.currentDate]);

  const shouldShowLegislatureEvaluation = useCallback(() => {
    const currentYear = gameState.currentYear;
    const currentDate = new Date(gameState.timeProgress?.currentDate || new Date(2025, 0, 1));
    const isNewYear = currentDate.getMonth() === 0 && currentDate.getDate() === 1;
    
    // Legislaturbilanz am 01.01. der Jahre 2029, 2033, 2037
    if (isNewYear && (currentYear === 2029 || currentYear === 2033 || currentYear === 2037)) {
      const legislatureEnd = currentYear - 1;
      const alreadyShown = gameState.shownLegislatureEvaluations?.includes(legislatureEnd) || false;
      return !alreadyShown;
    }
    
    return false;
  }, [gameState.currentYear, gameState.timeProgress?.currentDate]);

  const getDecisionsLimitReached = useCallback(() => {
    const decisionsThisYear = gameState.completedDecisions.filter(d => d.year === gameState.currentYear).length;
    return decisionsThisYear >= 8;
  }, [gameState.completedDecisions, gameState.currentYear]);

  return {
    gameState,
    applyDecision,
    getAvailableDecisions,
    shouldShowEvaluation,
    getMetricsHistory,
    calculateGesamtbewertung,
    formatCurrency,
    resetGame,
    advanceToEndOfYear,
    advanceToEndOfLegislature,
    startDecisionTimer,
    pauseTimer,
    resumeTimer,
    decisionStartTime: timerStartTime,
    getCurrentMonth,
    getCurrentTimerDisplay,
    interestRate: INTEREST_RATE,
    loadSavedGame,
    saveCurrentGame,
    shouldShowYearlyEvaluation,
    shouldShowLegislatureEvaluation,
    getDecisionsLimitReached
  };
};