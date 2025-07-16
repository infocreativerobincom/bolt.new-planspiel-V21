import { GameEvent } from '../types/game';

export const gameEvents: GameEvent[] = [
  {
    id: 'renewable_breakthrough',
    title: 'Technologiedurchbruch bei Erneuerbaren Energien',
    description: 'Deutsche Forschungseinrichtungen erzielen einen Durchbruch bei der Effizienz von Solarzellen. Die Exportchancen für deutsche Technologie steigen erheblich.',
    category: 'opportunity',
    triggerConditions: [
      { metric: 'co2EmissionReduktionPfad', operator: 'gt', value: 25 },
      { metric: 'investitionsattraktivitaetDeutschlands', operator: 'gt', value: 65 }
    ],
    probability: 0.3,
    effects: [
      { metric: 'wirtschaftswachstum', value: 0.8 },
      { metric: 'investitionsattraktivitaetDeutschlands', value: 8 },
      { metric: 'popularitaetBeiWaehlern', value: 6 },
      { metric: 'energiesicherheit', value: 5 }
    ]
  },
  {
    id: 'energy_crisis_2028',
    title: 'Globale Energiekrise',
    description: 'Geopolitische Spannungen führen zu einer weltweiten Energiekrise. Länder mit hoher Energieabhängigkeit sind besonders betroffen. Deutschland muss teure Notmaßnahmen ergreifen.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'energiesicherheit', operator: 'lt', value: 40 }
    ],
    probability: 0.4,
    effects: [
      { metric: 'energiesicherheit', value: -15 },
      { metric: 'wirtschaftswachstum', value: -1.2 },
      { metric: 'popularitaetBeiWaehlern', value: -12 },
      { metric: 'schulden', value: 25000000000 }
    ]
  },
  {
    id: 'coalition_crisis',
    title: 'Koalitionskrise',
    description: 'Tiefgreifende Meinungsverschiedenheiten zwischen den Koalitionspartnern führen zu einer Regierungskrise. Die Handlungsfähigkeit der Regierung ist stark eingeschränkt.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', operator: 'lt', value: 25 },
      { metric: 'zufriedenheitLiberalerKoalitionspartner', operator: 'lt', value: 25 }
    ],
    probability: 0.7,
    effects: [
      { metric: 'popularitaetBeiWaehlern', value: -15 },
      { metric: 'investitionsattraktivitaetDeutschlands', value: -8 },
      { metric: 'wirtschaftswachstum', value: -0.5 }
    ]
  },
  {
    id: 'tech_giant_investment',
    title: 'Ansiedlung eines Tech-Giganten',
    description: 'Ein großer internationaler Tech-Konzern kündigt eine Milliardeninvestition in Deutschland an, angezogen von der digitalen Infrastruktur und dem Fachkräfteangebot.',
    category: 'opportunity',
    triggerConditions: [
      { metric: 'investitionsattraktivitaetDeutschlands', operator: 'gt', value: 75 }
    ],
    probability: 0.25,
    effects: [
      { metric: 'wirtschaftswachstum', value: 1.2 },
      { metric: 'arbeitslosenquote', value: -0.8 }, // Korrigiert: Arbeitslosigkeit sinkt
      { metric: 'popularitaetBeiWaehlern', value: 8 },
      { metric: 'entwicklungRealeinkommenMedian', value: 2000 }
    ]
  },
  {
    id: 'climate_disaster',
    title: 'Extreme Klimaauswirkungen',
    description: 'Schwere Überschwemmungen und Hitzewellen verursachen massive Schäden in Deutschland. Die Folgekosten belasten den Staatshaushalt erheblich und zeigen die Dringlichkeit des Klimaschutzes.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'co2EmissionReduktionPfad', operator: 'lt', value: 20 }
    ],
    probability: 0.35,
    effects: [
      { metric: 'schulden', value: 35000000000 },
      { metric: 'popularitaetBeiWaehlern', value: -10 },
      { metric: 'wirtschaftswachstum', value: -0.8 },
      { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -12 }
    ]
  },
  {
    id: 'economic_boom',
    title: 'Wirtschaftsaufschwung durch Innovation',
    description: 'Deutsche Unternehmen profitieren von Innovationen und steigender Nachfrage. Ein nachhaltiger Wirtschaftsaufschwung setzt ein.',
    category: 'opportunity',
    triggerConditions: [
      { metric: 'investitionsattraktivitaetDeutschlands', operator: 'gt', value: 70 },
      { metric: 'wirtschaftswachstum', operator: 'gt', value: 2.0 }
    ],
    probability: 0.3,
    effects: [
      { metric: 'wirtschaftswachstum', value: 1.0 },
      { metric: 'arbeitslosenquote', value: -1.2 },
      { metric: 'entwicklungRealeinkommenMedian', value: 3000 },
      { metric: 'popularitaetBeiWaehlern', value: 12 }
    ]
  },
  {
    id: 'cyber_attack',
    title: 'Großangelegter Cyberangriff',
    description: 'Ein koordinierter Cyberangriff legt kritische Infrastrukturen lahm. Massive Investitionen in Cybersicherheit werden notwendig.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'sicherheitVerteidigungskapazitaeten', operator: 'lt', value: 40 }
    ],
    probability: 0.25,
    effects: [
      { metric: 'sicherheitVerteidigungskapazitaeten', value: -10 },
      { metric: 'wirtschaftswachstum', value: -0.6 },
      { metric: 'schulden', value: 15000000000 },
      { metric: 'popularitaetBeiWaehlern', value: -8 }
    ]
  },
  {
    id: 'migration_wave',
    title: 'Neue Migrationswelle',
    description: 'Internationale Krisen führen zu einer neuen Migrationswelle nach Europa. Deutschland steht vor Herausforderungen bei Integration und Kapazitäten.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'sicherheitVerteidigungskapazitaeten', operator: 'lt', value: 45 }
    ],
    probability: 0.3,
    effects: [
      { metric: 'popularitaetBeiWaehlern', value: -6 },
      { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
      { metric: 'schulden', value: 12000000000 },
      { metric: 'arbeitslosenquote', value: 0.5 }
    ]
  },
  {
    id: 'eu_integration_success',
    title: 'Erfolgreiche EU-Integration',
    description: 'Deutsche Initiativen zur europäischen Integration zeigen Erfolg. Die EU wird gestärkt und Deutschland profitiert von vertiefter Zusammenarbeit.',
    category: 'opportunity',
    triggerConditions: [
      { metric: 'investitionsattraktivitaetDeutschlands', operator: 'gt', value: 65 },
      { metric: 'popularitaetBeiWaehlern', operator: 'gt', value: 55 }
    ],
    probability: 0.2,
    effects: [
      { metric: 'investitionsattraktivitaetDeutschlands', value: 10 },
      { metric: 'wirtschaftswachstum', value: 0.8 },
      { metric: 'energiesicherheit', value: 8 },
      { metric: 'sicherheitVerteidigungskapazitaeten', value: 6 }
    ]
  },
  {
    id: 'trade_war_impact',
    title: 'Handelskrieg-Auswirkungen',
    description: 'Internationale Handelskonflikte treffen die deutsche Exportwirtschaft hart. Lieferketten werden unterbrochen und Märkte gehen verloren.',
    category: 'crisis',
    triggerConditions: [
      { metric: 'wirtschaftswachstum', operator: 'lt', value: 0.5 }
    ],
    probability: 0.4,
    effects: [
      { metric: 'wirtschaftswachstum', value: -1.0 },
      { metric: 'arbeitslosenquote', value: 1.0 },
      { metric: 'investitionsattraktivitaetDeutschlands', value: -12 },
      { metric: 'popularitaetBeiWaehlern', value: -10 }
    ]
  }
];