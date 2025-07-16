import { Decision } from '../types/game';

export const decisions: Decision[] = [
  {
    id: '1000000001',
    title: 'Ausbau der Erneuerbaren Energien bis 2030',
    description: 'Wie aggressiv soll Deutschland den Ausbau von Wind- und Solarenergie vorantreiben, um die Klimaziele zu erreichen und die Energieunabhängigkeit zu stärken?',
    category: 'umweltpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000001.0001',
        title: 'Moderater Ausbau - 65% Erneuerbare bis 2030',
        description: 'Fortsetzung des aktuellen Ausbautempos mit jährlich 10 GW neuer Kapazität, hauptsächlich durch Marktmechanismen',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'energiesicherheit', value: 8 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ],
        delayedEffects: [
          {
            yearsDelay: 3,
            effect: { metric: 'energiesicherheit', value: 12 },
            description: 'Erste große Windparks gehen ans Netz'
          },
          {
            yearsDelay: 5,
            effect: { metric: 'wirtschaftswachstum', value: 2 },
            description: 'Exportchancen für Erneuerbare Technologien steigen'
          }
        ]
      },
      {
        id: '1000000001.0002',
        title: 'Aggressiver Ausbau - 80% Erneuerbare bis 2030',
        description: 'Massiver staatlicher Ausbau mit 18 GW jährlich, vereinfachte Genehmigungsverfahren, staatliche Investitionen',
        cost: 45000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'co2EmissionReduktionPfad', value: 18 },
          { metric: 'energiesicherheit', value: 15 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ],
        delayedEffects: [
          {
            yearsDelay: 2,
            effect: { metric: 'energiesicherheit', value: 25 },
            description: 'Massive Kapazitätserweiterung wird wirksam'
          },
          {
            yearsDelay: 4,
            effect: { metric: 'wirtschaftswachstum', value: 6 },
            description: 'Deutschland wird Exporteur von Erneuerbare-Technologie'
          }
        ]
      },
      {
        id: '1000000001.0003',
        title: 'Technologieoffener Ansatz - 60% Erneuerbare bis 2030',
        description: 'Langsamerer Ausbau, Fokus auf Effizienz und Speichertechnologien, Offenheit für neue Technologien',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'co2EmissionReduktionPfad', value: 2 },
          { metric: 'energiesicherheit', value: 3 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000001.0004',
        title: 'Europäische Kooperation - 70% Erneuerbare bis 2030',
        description: 'Koordinierter Ausbau mit EU-Partnern, gemeinsame Netzinfrastruktur, geteilte Investitionen',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 6 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'co2EmissionReduktionPfad', value: 12 },
          { metric: 'energiesicherheit', value: 18 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 6 }
        ]
      }
    ]
  },
  {
    id: '1000000002',
    title: 'Zukunft der Atomenergie in Deutschland',
    description: 'Soll Deutschland den Atomausstieg überdenken oder alternative Wege zur Kernenergie-Nutzung erforschen?',
    category: 'umweltpolitik',
    timeframe: 'sehr-lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000002.0001',
        title: 'Endgültiger Atomausstieg bestätigen',
        description: 'Beim Atomausstieg bleiben, Fokus auf Erneuerbare und Speichertechnologien',
        cost: 0,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 10 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'co2EmissionReduktionPfad', value: -3 },
          { metric: 'energiesicherheit', value: -5 }
        ]
      },
      {
        id: '1000000002.0002',
        title: 'Laufzeitverlängerung für bestehende AKW',
        description: 'Verlängerung der Laufzeit um 10 Jahre, Nachrüstung der Sicherheitstechnik',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -12 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'energiesicherheit', value: 15 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000002.0003',
        title: 'Forschung zu neuen Reaktortypen',
        description: 'Investition in Forschung zu Small Modular Reactors (SMR) und Fusionsenergie',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -1 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 6 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000002.0004',
        title: 'Europäische Atomenergie-Kooperation',
        description: 'Beteiligung an europäischen Atomprojekten, Import von Atomstrom',
        cost: 3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -2 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'energiesicherheit', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000003',
    title: 'Verteidigungsausgaben und NATO-Verpflichtungen',
    description: 'Wie soll Deutschland seine Verteidigungsausgaben entwickeln, um die NATO-Verpflichtungen zu erfüllen und die Sicherheit zu gewährleisten?',
    category: 'verteidigung',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000003.0001',
        title: 'Schrittweise Erhöhung auf 2% des BIP bis 2028',
        description: 'Moderate Steigerung der Verteidigungsausgaben entsprechend NATO-Minimalziel',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 2 }
        ]
      },
      {
        id: '1000000003.0002',
        title: 'Drastische Erhöhung auf 3,5% des BIP bis 2035',
        description: 'Massive Aufrüstung für strategische Autonomie und Führungsrolle in Europa',
        cost: 80000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 35 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000003.0003',
        title: 'Fokus auf Cyber- und Weltraumverteidigung',
        description: 'Spezialisierung auf moderne Bedrohungen statt konventioneller Rüstung',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 1 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -2 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000003.0004',
        title: 'Europäische Verteidigungsunion stärken',
        description: 'Koordinierte Verteidigungspolitik mit EU-Partnern, gemeinsame Beschaffung',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 6 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 18 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      }
    ]
  },
  {
    id: '1000000004',
    title: 'Migrationspolitik und Arbeitsmarktintegration',
    description: 'Wie soll Deutschland seine Migrationspolitik gestalten, um dem Fachkräftemangel zu begegnen und Integration zu fördern?',
    category: 'migration',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000004.0001',
        title: 'Punktesystem für qualifizierte Einwanderer',
        description: 'Einführung eines kanadischen Modells zur gezielten Anwerbung von Fachkräften',
        cost: 3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 2 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000004.0002',
        title: 'Massive Investition in Integrationsprogramme',
        description: 'Umfassende Sprach- und Bildungsprogramme für alle Migranten',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -3 },
          { metric: 'arbeitslosenquote', value: -1 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000004.0003',
        title: 'Verschärfung der Migrationskontrolle',
        description: 'Strengere Grenzkontrollen, beschleunigte Abschiebungen, reduzierte Zuwanderung',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 2 },
          { metric: 'arbeitslosenquote', value: 1 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -3 }
        ]
      },
      {
        id: '1000000004.0004',
        title: 'EU-weite Migrationspolitik koordinieren',
        description: 'Gemeinsame europäische Lösung für Migration und Lastenteilung',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 1 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'arbeitslosenquote', value: -1 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      }
    ]
  },
  {
    id: '1000000005',
    title: 'Digitalisierung der öffentlichen Verwaltung',
    description: 'Wie aggressiv soll Deutschland die Digitalisierung der Verwaltung vorantreiben und Bürokratie abbauen?',
    category: 'digitalisierung',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000005.0001',
        title: 'Schrittweise Modernisierung bestehender Systeme',
        description: 'Gradueller Übergang zu digitalen Diensten, Erhalt bewährter Prozesse',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 2 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 4 }
        ]
      },
      {
        id: '1000000005.0002',
        title: 'Radikale Digitalisierung "Digital First"',
        description: 'Komplette Neuentwicklung aller Verwaltungsprozesse, KI-gestützte Automatisierung',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000005.0003',
        title: 'Öffentlich-private Partnerschaften',
        description: 'Zusammenarbeit mit Tech-Unternehmen für schnelle Digitalisierung',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 10 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000005.0004',
        title: 'Europäische Digitalisierungsinitiative',
        description: 'Koordinierte Digitalisierung mit EU-Partnern, gemeinsame Standards',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 4 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 6 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 7 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 10 }
        ]
      }
    ]
  },
  {
    id: '1000000006',
    title: 'Bildungsreform und Digitalisierung der Schulen',
    description: 'Wie soll Deutschland sein Bildungssystem modernisieren, um für die Zukunft gerüstet zu sein?',
    category: 'bildung',
    timeframe: 'lang',
    immediateEffects: false,
    options: [
      {
        id: '1000000006.0001',
        title: 'Massive Investition in digitale Schulausstattung',
        description: 'Tablets für alle Schüler, Glasfaser in jede Schule, KI-gestützte Lernplattformen',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 6 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ],
        delayedEffects: [
          {
            yearsDelay: 5,
            effect: { metric: 'wirtschaftswachstum', value: 4 },
            description: 'Besser ausgebildete Arbeitskräfte steigern Produktivität'
          },
          {
            yearsDelay: 8,
            effect: { metric: 'investitionsattraktivitaetDeutschlands', value: 12 },
            description: 'Deutschland wird zum Tech-Standort'
          }
        ]
      },
      {
        id: '1000000006.0002',
        title: 'Fokus auf Grundlagen und klassische Bildung',
        description: 'Stärkung von Mathematik, Deutsch, Naturwissenschaften ohne übermäßige Digitalisierung',
        cost: 18000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 2 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 2 }
        ],
        delayedEffects: [
          {
            yearsDelay: 6,
            effect: { metric: 'wirtschaftswachstum', value: 2 },
            description: 'Solide Grundbildung zahlt sich langfristig aus'
          }
        ]
      },
      {
        id: '1000000006.0003',
        title: 'Berufsbildung und duale Ausbildung stärken',
        description: 'Massive Investition in Handwerk, Technik und praktische Fertigkeiten',
        cost: 22000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 10 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -3 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ],
        delayedEffects: [
          {
            yearsDelay: 3,
            effect: { metric: 'investitionsattraktivitaetDeutschlands', value: 8 },
            description: 'Fachkräftemangel wird reduziert'
          }
        ]
      },
      {
        id: '1000000006.0004',
        title: 'Privatisierung und Wettbewerb im Bildungswesen',
        description: 'Bildungsgutscheine, private Schulträger, Leistungswettbewerb zwischen Schulen',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ],
        delayedEffects: [
          {
            yearsDelay: 7,
            effect: { metric: 'investitionsattraktivitaetDeutschlands', value: 6 },
            description: 'Effizienzgewinne durch Wettbewerb'
          }
        ]
      }
    ]
  },
  {
    id: '1000000007',
    title: 'Steuerreform und Unternehmensbesteuerung',
    description: 'Wie soll Deutschland seine Steuerpolitik gestalten, um wettbewerbsfähig zu bleiben und gleichzeitig Einnahmen zu sichern?',
    category: 'wirtschaft',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000007.0001',
        title: 'Massive Steuersenkungen für Unternehmen',
        description: 'Körperschaftsteuer auf 15%, Gewerbesteuer reformieren, Bürokratie abbauen',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 6 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 20 },
          { metric: 'arbeitslosenquote', value: -2 }
        ]
      },
      {
        id: '1000000007.0002',
        title: 'Digitalsteuer für Tech-Konzerne',
        description: 'Besteuerung von Google, Amazon, Meta basierend auf deutschen Umsätzen',
        cost: -8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -5 }
        ]
      },
      {
        id: '1000000007.0003',
        title: 'Vermögenssteuer für Superreiche',
        description: 'Besteuerung von Vermögen über 10 Millionen Euro mit 1% jährlich',
        cost: -15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 },
          { metric: 'wirtschaftswachstum', value: -1 }
        ]
      },
      {
        id: '1000000007.0004',
        title: 'Steuerliche Förderung von Innovationen',
        description: 'Forschungsförderung, Startup-Steuervorteile, Venture Capital begünstigen',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000007.0005',
        title: 'CO2-Steuer drastisch erhöhen',
        description: 'CO2-Preis auf 200€/Tonne, Rückverteilung an Bürger als Klimadividende',
        cost: -25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'co2EmissionReduktionPfad', value: 15 },
          { metric: 'wirtschaftswachstum', value: -3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -5 }
        ]
      }
    ]
  },
  {
    id: '1000000008',
    title: 'Infrastruktur und Verkehrswende',
    description: 'Wie soll Deutschland seine Verkehrsinfrastruktur modernisieren und die Mobilitätswende gestalten?',
    category: 'infrastruktur',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000008.0001',
        title: 'Massive Investition in Schienenverkehr',
        description: 'Hochgeschwindigkeitsnetz ausbauen, Regionalverkehr elektrifizieren, kostenloser ÖPNV',
        cost: 80000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'co2EmissionReduktionPfad', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ],
        delayedEffects: [
          {
            yearsDelay: 4,
            effect: { metric: 'investitionsattraktivitaetDeutschlands', value: 10 },
            description: 'Verbesserte Mobilität steigert Standortattraktivität'
          }
        ]
      },
      {
        id: '1000000008.0002',
        title: 'Elektromobilität forcieren',
        description: 'Millionen Ladestationen, E-Auto-Kaufprämien, Verbrenner-Verbot ab 2030',
        cost: 45000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'co2EmissionReduktionPfad', value: 10 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000008.0003',
        title: 'Autobahnen und Straßen modernisieren',
        description: 'Marode Brücken sanieren, Autobahnen digitalisieren, autonomes Fahren ermöglichen',
        cost: 60000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 6 },
          { metric: 'co2EmissionReduktionPfad', value: -2 }
        ]
      },
      {
        id: '1000000008.0004',
        title: 'Wasserstoff-Infrastruktur aufbauen',
        description: 'Wasserstoff-Tankstellen, H2-Züge, Industrie-Wasserstoff-Netz',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 },
          { metric: 'energiesicherheit', value: 6 }
        ]
      }
    ]
  },
  {
    id: '1000000009',
    title: 'Rentensystem und demografischer Wandel',
    description: 'Wie soll Deutschland das Rentensystem angesichts der alternden Gesellschaft reformieren?',
    category: 'soziales',
    timeframe: 'sehr-lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000009.0001',
        title: 'Rente mit 70 und private Vorsorge stärken',
        description: 'Schrittweise Erhöhung des Renteneintrittsalters, Förderung privater Altersvorsorge',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'arbeitslosenquote', value: -1 }
        ]
      },
      {
        id: '1000000009.0002',
        title: 'Massive Erhöhung der Renten',
        description: 'Grundrente auf 1200€, Rentenniveau auf 53% stabilisieren, höhere Beiträge',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 20 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -15 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000009.0003',
        title: 'Einwanderung zur Rentenstabilisierung',
        description: 'Gezielte Anwerbung junger Arbeitskräfte zur Stabilisierung der Rentenkasse',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 3 }
        ]
      },
      {
        id: '1000000009.0004',
        title: 'Staatsfonds nach norwegischem Vorbild',
        description: 'Aufbau eines Staatsfonds zur Finanzierung der Renten aus Kapitalerträgen',
        cost: 50000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ],
        delayedEffects: [
          {
            yearsDelay: 10,
            effect: { metric: 'wirtschaftswachstum', value: 3 },
            description: 'Staatsfonds generiert Erträge'
          }
        ]
      }
    ]
  },
  {
    id: '1000000010',
    title: 'Gesundheitssystem und Pandemie-Vorsorge',
    description: 'Wie soll Deutschland sein Gesundheitssystem stärken und für künftige Krisen rüsten?',
    category: 'soziales',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000010.0001',
        title: 'Bürgerversicherung für alle einführen',
        description: 'Einheitliches Gesundheitssystem, alle zahlen ein, bessere Leistungen für alle',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'wirtschaftswachstum', value: -1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -3 }
        ]
      },
      {
        id: '1000000010.0002',
        title: 'Privatisierung und Wettbewerb stärken',
        description: 'Mehr private Krankenversicherung, Selbstbeteiligung erhöhen, Marktmechanismen',
        cost: -10000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000010.0003',
        title: 'Massive Investition in Krankenhaus-Infrastruktur',
        description: 'Neue Krankenhäuser, bessere Ausstattung, mehr Pflegekräfte, höhere Löhne',
        cost: 45000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 18 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000010.0004',
        title: 'Digitalisierung und KI im Gesundheitswesen',
        description: 'Elektronische Patientenakte, KI-Diagnostik, Telemedizin ausbauen',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000011',
    title: 'Wohnungspolitik und Mietpreisbremse',
    description: 'Wie soll Deutschland die Wohnungskrise lösen und bezahlbaren Wohnraum schaffen?',
    category: 'soziales',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000011.0001',
        title: 'Massive staatliche Wohnungsbauprogramme',
        description: '500.000 neue Sozialwohnungen pro Jahr, staatliche Wohnungsbaugesellschaften',
        cost: 60000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 20 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -10 },
          { metric: 'arbeitslosenquote', value: -3 },
          { metric: 'wirtschaftswachstum', value: 3 }
        ]
      },
      {
        id: '1000000011.0002',
        title: 'Mietpreisbremse und Enteignungen',
        description: 'Mietpreisdeckel, Enteignung großer Wohnungskonzerne, Mietenmoratorium',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 30 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -25 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -15 },
          { metric: 'wirtschaftswachstum', value: -2 }
        ]
      },
      {
        id: '1000000011.0003',
        title: 'Bauvorschriften lockern und Bürokratie abbauen',
        description: 'Schnellere Genehmigungen, weniger Auflagen, private Investoren fördern',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000011.0004',
        title: 'Wohngeld massiv erhöhen',
        description: 'Wohngeld verdoppeln, mehr Berechtigte, regionale Anpassung',
        cost: 18000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      }
    ]
  },
  {
    id: '1000000012',
    title: 'Außenpolitik und EU-Integration',
    description: 'Welche Rolle soll Deutschland in Europa und der Welt spielen?',
    category: 'aussenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000012.0001',
        title: 'Vereinigte Staaten von Europa vorantreiben',
        description: 'Europäische Armee, gemeinsame Außenpolitik, Fiskalunion, EU-Steuern',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000012.0002',
        title: 'Deutschland First - nationale Souveränität',
        description: 'EU-Kompetenzen zurückholen, nationale Grenzen kontrollieren, weniger EU-Beiträge',
        cost: -8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -5 }
        ]
      },
      {
        id: '1000000012.0003',
        title: 'Strategische Autonomie Europas',
        description: 'Unabhängigkeit von USA und China, europäische Tech-Champions, eigene Lieferketten',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 10 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000012.0004',
        title: 'Globale Führungsrolle übernehmen',
        description: 'UN-Sicherheitsrat, Entwicklungshilfe verdoppeln, Klimadiplomatie führen',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'co2EmissionReduktionPfad', value: 5 }
        ]
      }
    ]
  },
  {
    id: '1000000013',
    title: 'Beziehungen zu China und Handelspolitik',
    description: 'Wie soll Deutschland seine Wirtschaftsbeziehungen zu China gestalten?',
    category: 'aussenpolitik',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000013.0001',
        title: 'Komplette Entkopplung von China',
        description: 'Stopp aller kritischen Technologie-Exporte, Investitionsverbot, Handelsbeschränkungen',
        cost: 10000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'wirtschaftswachstum', value: -5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000013.0002',
        title: 'Wandel durch Handel fortsetzen',
        description: 'Intensive Wirtschaftsbeziehungen, Technologietransfer, chinesische Investitionen willkommen',
        cost: 0,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000013.0003',
        title: 'Selektive Kooperation und Risikominimierung',
        description: 'Handel ja, aber kritische Infrastruktur schützen, Abhängigkeiten reduzieren',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      },
      {
        id: '1000000013.0004',
        title: 'Menschenrechte vor Handel',
        description: 'Sanktionen wegen Xinjiang und Hongkong, Boykott der Olympischen Spiele',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -3 }
        ]
      }
    ]
  },
  {
    id: '1000000014',
    title: 'Transatlantische Beziehungen und NATO',
    description: 'Wie soll Deutschland seine Beziehungen zu den USA und der NATO gestalten?',
    category: 'aussenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000014.0001',
        title: 'Bedingungslose Treue zu USA und NATO',
        description: 'Alle US-Wünsche erfüllen, mehr Truppen, Raketenabwehr, Technologie-Allianz',
        cost: 30000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 25 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000014.0002',
        title: 'Gleichberechtigte Partnerschaft',
        description: 'NATO-Verpflichtungen erfüllen, aber eigene Interessen vertreten, kritische Distanz',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000014.0003',
        title: 'Europäische Emanzipation von den USA',
        description: 'Weniger NATO-Abhängigkeit, europäische Verteidigung, eigene Außenpolitik',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      },
      {
        id: '1000000014.0004',
        title: 'Neutralität und Blockfreiheit',
        description: 'NATO verlassen, militärische Neutralität, Vermittlerrolle zwischen Blöcken',
        cost: -5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -20 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -10 }
        ]
      }
    ]
  },
  {
    id: '1000000015',
    title: 'Künstliche Intelligenz und Technologieführerschaft',
    description: 'Wie soll Deutschland im Bereich KI und Zukunftstechnologien aufholen und führen?',
    category: 'technologie',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000015.0001',
        title: 'Europäischer KI-Champion aufbauen',
        description: 'Staatliche KI-Förderung, europäische Tech-Giganten schaffen, Datenhoheit sichern',
        cost: 50000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 20 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 }
        ]
      },
      {
        id: '1000000015.0002',
        title: 'Kooperation mit US-Tech-Giganten',
        description: 'Partnerschaften mit Google, Microsoft, Amazon, Standort für KI-Forschung werden',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -5 }
        ]
      },
      {
        id: '1000000015.0003',
        title: 'KI-Regulierung und Ethik-Führerschaft',
        description: 'Strenge KI-Gesetze, Algorithmus-Transparenz, ethische KI als Exportschlager',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'wirtschaftswachstum', value: -1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 }
        ]
      },
      {
        id: '1000000015.0004',
        title: 'Quantencomputing-Offensive',
        description: 'Massive Investition in Quantentechnologie, Quanteninternet, Verschlüsselung',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 }
        ]
      }
    ]
  },
  {
    id: '1000000016',
    title: 'Cybersicherheit und digitale Souveränität',
    description: 'Wie soll Deutschland seine digitale Infrastruktur schützen und Souveränität sichern?',
    category: 'technologie',
    timeframe: 'kurz',
    immediateEffects: true,
    options: [
      {
        id: '1000000016.0001',
        title: 'Nationale Cyber-Armee aufbauen',
        description: 'Cyber-Kommando der Bundeswehr, offensive Cyber-Fähigkeiten, Hacker-Rekrutierung',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 20 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000016.0002',
        title: 'Europäische Cyber-Allianz',
        description: 'Gemeinsame EU-Cyber-Abwehr, geteilte Threat Intelligence, koordinierte Antworten',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 10 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000016.0003',
        title: 'Kritische Infrastruktur verstaatlichen',
        description: 'Strom, Wasser, Telekom zurück in staatliche Hand, chinesische Technik verbannen',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -18 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 25 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000016.0004',
        title: 'Public-Private Cyber-Partnerships',
        description: 'Enge Kooperation mit Privatwirtschaft, Informationsaustausch, gemeinsame Standards',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000017',
    title: 'Medien und Meinungsfreiheit im digitalen Zeitalter',
    description: 'Wie soll Deutschland mit Fake News, Hassrede und Medienkonzentration umgehen?',
    category: 'innenpolitik',
    timeframe: 'kurz',
    immediateEffects: true,
    options: [
      {
        id: '1000000017.0001',
        title: 'Strenge Regulierung sozialer Medien',
        description: 'Löschpflicht für Fake News, hohe Bußgelder, Algorithmus-Transparenz erzwingen',
        cost: 3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -5 }
        ]
      },
      {
        id: '1000000017.0002',
        title: 'Meinungsfreiheit absolut schützen',
        description: 'Minimale Regulierung, Selbstregulierung der Plattformen, freier Meinungsaustausch',
        cost: 0,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000017.0003',
        title: 'Öffentlich-rechtliche Medien stärken',
        description: 'Mehr Geld für ARD/ZDF, digitale Plattformen, Faktenchecker finanzieren',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -10 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 }
        ]
      },
      {
        id: '1000000017.0004',
        title: 'Deutsche Social Media Plattform schaffen',
        description: 'Staatliche Alternative zu Facebook/Twitter, europäische Werte, Datenschutz',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      }
    ]
  },
  {
    id: '1000000018',
    title: 'Cannabis-Legalisierung und Drogenpolitik',
    description: 'Wie soll Deutschland seine Drogenpolitik reformieren und mit Cannabis umgehen?',
    category: 'innenpolitik',
    timeframe: 'kurz',
    immediateEffects: true,
    options: [
      {
        id: '1000000018.0001',
        title: 'Vollständige Cannabis-Legalisierung',
        description: 'Freier Verkauf, Besteuerung, Cannabis-Tourismus, alle Drogen entkriminalisieren',
        cost: -5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -3 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000018.0002',
        title: 'Kontrollierte Abgabe in Apotheken',
        description: 'Medizinisches Cannabis plus kontrollierte Freizeitabgabe, strenge Regulierung',
        cost: 2000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 2 }
        ]
      },
      {
        id: '1000000018.0003',
        title: 'Status Quo beibehalten',
        description: 'Cannabis bleibt illegal, verstärkte Strafverfolgung, mehr Prävention',
        cost: 3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -2 }
        ]
      },
      {
        id: '1000000018.0004',
        title: 'Präventions- und Therapie-Offensive',
        description: 'Massive Investition in Suchtprävention, Therapieplätze, Substitution ausbauen',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 }
        ]
      }
    ]
  },
  {
    id: '1000000019',
    title: 'Landwirtschaft und Ernährungssicherheit',
    description: 'Wie soll Deutschland seine Landwirtschaft transformieren und Ernährung sichern?',
    category: 'umweltpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000019.0001',
        title: 'Komplette Umstellung auf Bio-Landwirtschaft',
        description: 'Pestizidverbot, 100% Bio bis 2035, massive Subventionen für Umstellung',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'wirtschaftswachstum', value: -2 }
        ]
      },
      {
        id: '1000000019.0002',
        title: 'Precision Farming und Technologie',
        description: 'KI-gesteuerte Landwirtschaft, Drohnen, Sensoren, optimaler Ressourceneinsatz',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000019.0003',
        title: 'Fleischsteuer und Ernährungswende',
        description: 'Hohe Steuern auf Fleisch, Subventionen für pflanzliche Alternativen, Tierwohl-Standards',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'co2EmissionReduktionPfad', value: 12 },
          { metric: 'wirtschaftswachstum', value: -1 }
        ]
      },
      {
        id: '1000000019.0004',
        title: 'Ernährungssouveränität und Selbstversorgung',
        description: 'Weniger Importe, regionale Kreisläufe, strategische Reserven, Bauernhöfe erhalten',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      }
    ]
  },
  {
    id: '1000000020',
    title: 'Weltraumpolitik und Satelliten-Infrastruktur',
    description: 'Welche Rolle soll Deutschland im Weltraum spielen und wie die Abhängigkeit von ausländischen Satelliten reduzieren?',
    category: 'technologie',
    timeframe: 'sehr-lang',
    immediateEffects: false,
    options: [
      {
        id: '1000000020.0001',
        title: 'Europäische Weltraum-Supermacht',
        description: 'Massive ESA-Investitionen, europäisches GPS, eigene Raumstation, Mars-Mission',
        cost: 60000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ],
        delayedEffects: [
          {
            yearsDelay: 8,
            effect: { metric: 'sicherheitVerteidigungskapazitaeten', value: 20 },
            description: 'Strategische Weltraum-Autonomie erreicht'
          },
          {
            yearsDelay: 10,
            effect: { metric: 'wirtschaftswachstum', value: 5 },
            description: 'Weltraum-Technologie wird Exportschlager'
          }
        ]
      },
      {
        id: '1000000020.0002',
        title: 'Kooperation mit SpaceX und US-Firmen',
        description: 'Partnerschaften mit privaten Weltraum-Unternehmen, günstige Starts, schnelle Ergebnisse',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000020.0003',
        title: 'Deutsche NewSpace-Industrie fördern',
        description: 'Startup-Förderung, private Raumfahrt, deutsche SpaceX schaffen, Risikokapital',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000020.0004',
        title: 'Weltraum-Abrüstung und friedliche Nutzung',
        description: 'Internationale Verträge, Weltraum-Müll beseitigen, keine militärische Nutzung',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 }
        ]
      }
    ]
  },
  {
    id: '1000000021',
    title: 'Industriepolitik und Standortsicherung',
    description: 'Wie soll Deutschland seine Industrie stärken und gegen internationale Konkurrenz wappnen?',
    category: 'wirtschaft',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000021.0001',
        title: 'Massive staatliche Industrieförderung',
        description: 'Subventionen für Schlüsselindustrien, staatliche Beteiligungen, Protektionismus',
        cost: 70000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -15 },
          { metric: 'arbeitslosenquote', value: -3 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -5 }
        ]
      },
      {
        id: '1000000021.0002',
        title: 'Freier Markt und Wettbewerb',
        description: 'Subventionen abbauen, Märkte öffnen, internationale Konkurrenz zulassen',
        cost: -15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 20 },
          { metric: 'arbeitslosenquote', value: 2 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000021.0003',
        title: 'Green Industrial Deal',
        description: 'Transformation zu grüner Industrie, Wasserstoff-Stahl, E-Mobilität, Kreislaufwirtschaft',
        cost: 50000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 10 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'co2EmissionReduktionPfad', value: 15 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000021.0004',
        title: 'Reshoring und strategische Autonomie',
        description: 'Produktion zurückholen, kritische Lieferketten sichern, weniger China-Abhängigkeit',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      }
    ]
  },
  {
    id: '1000000022',
    title: 'Finanzmarktregulierung und Bankenaufsicht',
    description: 'Wie soll Deutschland seine Finanzmärkte regulieren und systemische Risiken minimieren?',
    category: 'wirtschaft',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000022.0001',
        title: 'Strenge Bankenregulierung verschärfen',
        description: 'Höhere Eigenkapitalquoten, Trennbanken-System, Finanztransaktionssteuer',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'wirtschaftswachstum', value: -1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000022.0002',
        title: 'Finanzplatz Deutschland stärken',
        description: 'Regulierung lockern, Banken fördern, Frankfurt als Finanz-Hub ausbauen',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000022.0003',
        title: 'Digitaler Euro und Krypto-Regulierung',
        description: 'Staatliche Digitalwährung, Bitcoin regulieren, Blockchain-Technologie fördern',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 10 }
        ]
      },
      {
        id: '1000000022.0004',
        title: 'Genossenschaftsbanken und Sparkassen stärken',
        description: 'Öffentliche Banken fördern, regionale Finanzierung, weniger Großbanken',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      }
    ]
  },
  {
    id: '1000000023',
    title: 'Arbeitsmarkt und Gewerkschaften',
    description: 'Wie soll Deutschland seinen Arbeitsmarkt reformieren und die Rolle der Gewerkschaften gestalten?',
    category: 'soziales',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000023.0001',
        title: 'Mindestlohn auf 15 Euro erhöhen',
        description: 'Drastische Mindestlohn-Erhöhung, stärkere Tarifbindung, Gewerkschaften stärken',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 18 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -18 },
          { metric: 'entwicklungRealeinkommenMedian', value: 8 },
          { metric: 'arbeitslosenquote', value: 1 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000023.0002',
        title: 'Arbeitsmarkt flexibilisieren',
        description: 'Kündigungsschutz lockern, Zeitarbeit erleichtern, weniger Regulierung',
        cost: 0,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 20 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000023.0003',
        title: '4-Tage-Woche bei vollem Lohnausgleich',
        description: 'Arbeitszeitverkürzung, Work-Life-Balance, Produktivitätssteigerung durch weniger Stunden',
        cost: 30000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 25 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 30 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'arbeitslosenquote', value: -1 },
          { metric: 'wirtschaftswachstum', value: -3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -10 }
        ]
      },
      {
        id: '1000000023.0004',
        title: 'Bedingungsloses Grundeinkommen testen',
        description: 'Pilotprojekt mit 1000€/Monat für alle, Bürokratie abbauen, Zukunft der Arbeit',
        cost: 80000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -5 },
          { metric: 'wirtschaftswachstum', value: -1 }
        ]
      }
    ]
  },
  {
    id: '1000000024',
    title: 'Polizei und innere Sicherheit',
    description: 'Wie soll Deutschland seine innere Sicherheit gewährleisten und die Polizei reformieren?',
    category: 'innenpolitik',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000024.0001',
        title: 'Massive Polizei-Aufstockung',
        description: '50.000 neue Polizisten, bessere Ausrüstung, höhere Löhne, mehr Befugnisse',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'arbeitslosenquote', value: -1 }
        ]
      },
      {
        id: '1000000024.0002',
        title: 'Polizei-Reform und Rassismus bekämpfen',
        description: 'Unabhängige Beschwerdestelle, Diversität fördern, Deeskalations-Training',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 }
        ]
      },
      {
        id: '1000000024.0003',
        title: 'Überwachung und Prävention ausbauen',
        description: 'Mehr Kameras, Gesichtserkennung, Vorratsdatenspeicherung, Online-Durchsuchung',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 }
        ]
      },
      {
        id: '1000000024.0004',
        title: 'Community Policing und Bürgernähe',
        description: 'Polizei in die Stadtteile, Vertrauensaufbau, Prävention statt Repression',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000025',
    title: 'Justizreform und Rechtsstaat',
    description: 'Wie soll Deutschland sein Justizsystem modernisieren und den Rechtsstaat stärken?',
    category: 'innenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000025.0001',
        title: 'Massive Investition in Justiz-Personal',
        description: '10.000 neue Richter und Staatsanwälte, digitale Akten, schnellere Verfahren',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000025.0002',
        title: 'Strafrecht verschärfen',
        description: 'Höhere Strafen, weniger Bewährung, mehr Gefängnisse, Law-and-Order',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 }
        ]
      },
      {
        id: '1000000025.0003',
        title: 'Restorative Justice und Resozialisierung',
        description: 'Täter-Opfer-Ausgleich, Therapie statt Strafe, offener Vollzug, Wiedereingliederung',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 }
        ]
      },
      {
        id: '1000000025.0004',
        title: 'KI und Digitalisierung in der Justiz',
        description: 'Algorithmus-gestützte Urteilsfindung, Online-Verfahren, automatisierte Rechtsprechung',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000026',
    title: 'Kulturpolitik und Medienförderung',
    description: 'Wie soll Deutschland seine Kultur fördern und die Medienlandschaft gestalten?',
    category: 'innenpolitik',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000026.0001',
        title: 'Massive Kulturförderung und Gratiskultur',
        description: 'Freier Eintritt in Museen, mehr Geld für Theater, Künstler-Grundeinkommen',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000026.0002',
        title: 'Privatisierung und Marktorientierung',
        description: 'Weniger staatliche Förderung, private Sponsoren, Kultur als Wirtschaftsfaktor',
        cost: -5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      },
      {
        id: '1000000026.0003',
        title: 'Deutsche Streaming-Plattform schaffen',
        description: 'Konkurrenz zu Netflix, deutsche Inhalte fördern, Kulturexport stärken',
        cost: 18000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000026.0004',
        title: 'Gaming und E-Sports fördern',
        description: 'Deutschland als Gaming-Standort, E-Sports als Sport anerkennen, Entwickler fördern',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      }
    ]
  },
  {
    id: '1000000027',
    title: 'Sportförderung und Olympische Spiele',
    description: 'Wie soll Deutschland den Sport fördern und sich international positionieren?',
    category: 'innenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000027.0001',
        title: 'Olympische Spiele nach Deutschland holen',
        description: 'Bewerbung um Olympia 2036, massive Infrastruktur-Investitionen, Prestigeprojekt',
        cost: 50000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000027.0002',
        title: 'Breitensport und Gesundheit fördern',
        description: 'Mehr Sportvereine, kostenlose Schwimmbäder, Sport in Schulen, Volkssport',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 18 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -1 }
        ]
      },
      {
        id: '1000000027.0003',
        title: 'Spitzensport und Leistungszentren',
        description: 'Elite-Förderung, Bundesleistungszentren, Trainer-Ausbildung, Medaillen-Ziele',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      },
      {
        id: '1000000027.0004',
        title: 'Sport-Privatisierung und Kommerzialisierung',
        description: 'Weniger staatliche Förderung, private Investoren, Stadion-Naming-Rights',
        cost: -3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      }
    ]
  },
  {
    id: '1000000028',
    title: 'Tourismus und Standortmarketing',
    description: 'Wie soll Deutschland als Reiseziel und Wirtschaftsstandort vermarktet werden?',
    category: 'wirtschaft',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000028.0001',
        title: 'Deutschland als Premium-Reiseziel',
        description: 'Luxus-Tourismus fördern, UNESCO-Welterbe ausbauen, hochwertige Infrastruktur',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000028.0002',
        title: 'Nachhaltiger und sanfter Tourismus',
        description: 'Öko-Tourismus, Bahnreisen fördern, Overtourism vermeiden, Naturschutz',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000028.0003',
        title: 'Business-Tourismus und Messen',
        description: 'Kongress-Zentren, Messe-Standort stärken, Geschäftsreisen anziehen',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000028.0004',
        title: 'Digitaler Tourismus und Virtual Reality',
        description: 'VR-Museen, digitale Stadtführungen, Online-Erlebnisse, Tech-Tourismus',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000029',
    title: 'Demografischer Wandel und Familienpolitik',
    description: 'Wie soll Deutschland dem demografischen Wandel begegnen und Familien unterstützen?',
    category: 'soziales',
    timeframe: 'sehr-lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000029.0001',
        title: 'Massive Familienförderung und Kindergeld',
        description: 'Kindergeld auf 500€, kostenlose Kitas, Elternzeit verlängern, Familien-Boni',
        cost: 60000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 25 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'wirtschaftswachstum', value: -1 }
        ],
        delayedEffects: [
          {
            yearsDelay: 8,
            effect: { metric: 'arbeitslosenquote', value: -2 },
            description: 'Mehr Kinder führen zu mehr Arbeitskräften'
          }
        ]
      },
      {
        id: '1000000029.0002',
        title: 'Einwanderung als demografische Lösung',
        description: 'Massive Zuwanderung junger Arbeitskräfte, Integration fördern, Multikulti',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -3 },
          { metric: 'wirtschaftswachstum', value: 4 }
        ]
      },
      {
        id: '1000000029.0003',
        title: 'Automatisierung und Roboter',
        description: 'Weniger Menschen durch mehr Maschinen, KI-Arbeitsplätze, Produktivität steigern',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'arbeitslosenquote', value: 2 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000029.0004',
        title: 'Aktives Altern und Rente mit 75',
        description: 'Ältere länger arbeiten lassen, Gesundheit fördern, Erfahrung nutzen',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'arbeitslosenquote', value: -1 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      }
    ]
  },
  {
    id: '1000000030',
    title: 'Wasserstoff-Wirtschaft und Energiespeicher',
    description: 'Wie soll Deutschland die Wasserstoff-Technologie entwickeln und als Energiespeicher nutzen?',
    category: 'umweltpolitik',
    timeframe: 'lang',
    immediateEffects: false,
    options: [
      {
        id: '1000000030.0001',
        title: 'Deutschland als Wasserstoff-Weltmarktführer',
        description: 'Massive H2-Investitionen, Elektrolyse-Fabriken, Wasserstoff-Export, grüner Wasserstoff',
        cost: 80000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'co2EmissionReduktionPfad', value: 5 }
        ],
        delayedEffects: [
          {
            yearsDelay: 5,
            effect: { metric: 'energiesicherheit', value: 25 },
            description: 'Wasserstoff-Infrastruktur wird operational'
          },
          {
            yearsDelay: 7,
            effect: { metric: 'wirtschaftswachstum', value: 8 },
            description: 'Deutschland wird Wasserstoff-Exporteur'
          },
          {
            yearsDelay: 8,
            effect: { metric: 'investitionsattraktivitaetDeutschlands', value: 20 },
            description: 'Technologieführerschaft etabliert'
          }
        ]
      },
      {
        id: '1000000030.0002',
        title: 'Wasserstoff-Import aus Afrika und Australien',
        description: 'Partnerschaften für günstigen Wasserstoff, Import-Infrastruktur, internationale Kooperation',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'energiesicherheit', value: 12 }
        ]
      },
      {
        id: '1000000030.0003',
        title: 'Blauer Wasserstoff als Übergangslösung',
        description: 'Wasserstoff aus Erdgas mit CO2-Abscheidung, schneller Hochlauf, pragmatischer Ansatz',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'co2EmissionReduktionPfad', value: 3 },
          { metric: 'energiesicherheit', value: 15 },
          { metric: 'wirtschaftswachstum', value: 3 }
        ]
      },
      {
        id: '1000000030.0004',
        title: 'Wasserstoff nur für Industrie und Schwerlast',
        description: 'Fokus auf Stahl, Chemie, LKW, Schiffe - nicht für Heizung oder PKW',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'co2EmissionReduktionPfad', value: 10 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      }
    ]
  },
  {
    id: '1000000031',
    title: 'Kreislaufwirtschaft und Ressourcenschonung',
    description: 'Wie soll Deutschland zu einer vollständigen Kreislaufwirtschaft übergehen?',
    category: 'umweltpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000031.0001',
        title: 'Radikale Kreislaufwirtschaft bis 2035',
        description: 'Verbot von Einwegprodukten, Reparatur-Recht, 95% Recycling-Quote, Zero Waste',
        cost: 45000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'co2EmissionReduktionPfad', value: 12 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000031.0002',
        title: 'Marktbasierte Anreize für Recycling',
        description: 'Pfandsystem ausweiten, Recycling-Börse, Steuervorteile für Kreislaufwirtschaft',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'co2EmissionReduktionPfad', value: 6 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000031.0003',
        title: 'Digitale Kreislaufwirtschaft',
        description: 'Blockchain für Materialverfolgung, KI für Recycling-Optimierung, digitale Produktpässe',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000031.0004',
        title: 'Internationale Kreislauf-Standards',
        description: 'EU-weite Normen, globale Recycling-Abkommen, Technologie-Export',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 10 },
          { metric: 'co2EmissionReduktionPfad', value: 10 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      }
    ]
  },
  {
    id: '1000000032',
    title: 'Biotechnologie und Gentechnik',
    description: 'Wie soll Deutschland mit Gentechnik, CRISPR und Biotechnologie umgehen?',
    category: 'technologie',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000032.0001',
        title: 'Deutschland als Biotech-Standort Nr. 1',
        description: 'Massive Förderung, Gentechnik-Gesetze lockern, Biotech-Cluster, Forschungsfreiheit',
        cost: 30000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 20 }
        ]
      },
      {
        id: '1000000032.0002',
        title: 'Strenge Regulierung und Vorsichtsprinzip',
        description: 'Gentechnik-Moratorium, strenge Zulassung, Risikobewertung, Bürgerbeteiligung',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -12 },
          { metric: 'wirtschaftswachstum', value: -2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -8 }
        ]
      },
      {
        id: '1000000032.0003',
        title: 'Medizinische Gentechnik fördern',
        description: 'CRISPR für Krankheiten, Gentherapie, personalisierte Medizin, aber keine Landwirtschaft',
        cost: 18000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000032.0004',
        title: 'Synthetische Biologie und Bio-Manufacturing',
        description: 'Künstliche Organismen, Bio-Fabriken, nachhaltige Chemie, neue Materialien',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 2 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -3 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 18 }
        ]
      }
    ]
  },
  {
    id: '1000000033',
    title: 'Rohstoffsicherheit und kritische Materialien',
    description: 'Wie soll Deutschland seine Versorgung mit kritischen Rohstoffen sichern?',
    category: 'wirtschaft',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000033.0001',
        title: 'Strategische Rohstoffreserven aufbauen',
        description: 'Staatliche Lager für Lithium, Seltene Erden, Kupfer - 2 Jahre Vorrat',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'wirtschaftswachstum', value: -1 }
        ]
      },
      {
        id: '1000000033.0002',
        title: 'Eigene Minen in Deutschland reaktivieren',
        description: 'Lithium im Oberrhein, Seltene Erden in Sachsen, Umweltauflagen lockern',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 20 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'co2EmissionReduktionPfad', value: -5 }
        ]
      },
      {
        id: '1000000033.0003',
        title: 'Recycling und Urban Mining',
        description: 'Rohstoffe aus Elektroschrott, Handy-Recycling, Kreislaufwirtschaft für Metalle',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000033.0004',
        title: 'Diversifizierung der Lieferanten',
        description: 'Weniger China-Abhängigkeit, Partnerschaften mit Afrika, Australien, Kanada',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'wirtschaftswachstum', value: 1 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      }
    ]
  },
  {
    id: '1000000034',
    title: 'Pandemie-Vorsorge und Gesundheitssicherheit',
    description: 'Wie soll Deutschland sich für künftige Pandemien und Gesundheitskrisen rüsten?',
    category: 'soziales',
    timeframe: 'mittel',
    immediateEffects: true,
    options: [
      {
        id: '1000000034.0001',
        title: 'Nationale Impfstoff- und Medikamenten-Produktion',
        description: 'Eigene Pharma-Fabriken, Unabhängigkeit von Importen, strategische Reserven',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 20 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000034.0002',
        title: 'Internationale Kooperation und WHO stärken',
        description: 'Mehr Geld für WHO, globale Pandemie-Abkommen, Technologie-Sharing',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 }
        ]
      },
      {
        id: '1000000034.0003',
        title: 'KI-basierte Früherkennung und Überwachung',
        description: 'Algorithmen für Pandemie-Vorhersage, Gesundheitsdaten sammeln, Tracking-Apps',
        cost: 8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000034.0004',
        title: 'Dezentrale Gesundheitsversorgung stärken',
        description: 'Mehr Hausärzte, regionale Kliniken, Telemedizin, lokale Resilienz',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 18 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 12 },
          { metric: 'arbeitslosenquote', value: -1 }
        ]
      }
    ]
  },
  {
    id: '1000000035',
    title: 'Zukunft der Demokratie und Bürgerbeteiligung',
    description: 'Wie soll Deutschland seine Demokratie modernisieren und Bürgerbeteiligung stärken?',
    category: 'innenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000035.0001',
        title: 'Direkte Demokratie und Volksentscheide',
        description: 'Bundesweite Referenden, Bürgerbegehren, Schweizer Modell, mehr Mitbestimmung',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 20 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -3 }
        ]
      },
      {
        id: '1000000035.0002',
        title: 'Digitale Demokratie und E-Voting',
        description: 'Online-Wahlen, digitale Bürgerbeteiligung, Blockchain-Voting, Liquid Democracy',
        cost: 12000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000035.0003',
        title: 'Bürgerräte und Losverfahren',
        description: 'Zufällig ausgewählte Bürger beraten Politik, Irisches Modell, deliberative Demokratie',
        cost: 3000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 3 }
        ]
      },
      {
        id: '1000000035.0004',
        title: 'Repräsentative Demokratie stärken',
        description: 'Parteienfinanzierung reformieren, Lobbyismus regulieren, Parlament stärken',
        cost: 2000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      }
    ]
  },
  {
    id: '1000000036',
    title: 'Klimaanpassung und Katastrophenschutz',
    description: 'Wie soll Deutschland sich an den Klimawandel anpassen und vor Naturkatastrophen schützen?',
    category: 'umweltpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000036.0001',
        title: 'Massive Investition in Hochwasserschutz',
        description: 'Neue Deiche, Rückhaltebecken, Frühwarnsysteme, Katastrophenschutz ausbauen',
        cost: 50000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 18 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 15 },
          { metric: 'arbeitslosenquote', value: -2 }
        ]
      },
      {
        id: '1000000036.0002',
        title: 'Städte klimaresilient umbauen',
        description: 'Schwammstädte, Grünflächen, Kühlung, hitzeresistente Infrastruktur',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000036.0003',
        title: 'Landwirtschaft an Klimawandel anpassen',
        description: 'Dürreresistente Pflanzen, Bewässerung, neue Anbaumethoden, Versicherungen',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 },
          { metric: 'wirtschaftswachstum', value: 1 }
        ]
      },
      {
        id: '1000000036.0004',
        title: 'Klimaflüchtlinge und Migration managen',
        description: 'Aufnahme-Programme, Integration, internationale Kooperation, Klimadiplomatie',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 3 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -3 },
          { metric: 'arbeitslosenquote', value: -1 }
        ]
      }
    ]
  },
  {
    id: '1000000037',
    title: 'Raumordnung und Stadtentwicklung',
    description: 'Wie soll Deutschland seine Städte und ländlichen Räume entwickeln?',
    category: 'infrastruktur',
    timeframe: 'sehr-lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000037.0001',
        title: 'Neue Städte und Megaprojekte',
        description: 'Planstädte für 1 Million Menschen, futuristische Architektur, Smart Cities',
        cost: 100000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'arbeitslosenquote', value: -5 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000037.0002',
        title: 'Ländliche Räume stärken',
        description: 'Glasfaser aufs Land, Arztpraxen, Schulen, ÖPNV, gleichwertige Lebensverhältnisse',
        cost: 60000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 20 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'arbeitslosenquote', value: -2 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      },
      {
        id: '1000000037.0003',
        title: 'Verdichtung und Nachverdichtung',
        description: 'Höhere Gebäude, weniger Flächenverbrauch, urbanes Leben, Verkehr reduzieren',
        cost: 30000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'co2EmissionReduktionPfad', value: 8 },
          { metric: 'wirtschaftswachstum', value: 3 }
        ]
      },
      {
        id: '1000000037.0004',
        title: 'Dezentrale Entwicklung und Homeoffice',
        description: 'Arbeit überall ermöglichen, Co-Working-Spaces, digitale Nomaden fördern',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      }
    ]
  },
  {
    id: '1000000038',
    title: 'Internationale Entwicklungszusammenarbeit',
    description: 'Welche Rolle soll Deutschland in der globalen Entwicklungspolitik spielen?',
    category: 'aussenpolitik',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000038.0001',
        title: 'Entwicklungshilfe auf 1% des BIP erhöhen',
        description: 'Massive Hilfe für Afrika, Bildung, Gesundheit, Infrastruktur, Marshall-Plan',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 8 }
        ]
      },
      {
        id: '1000000038.0002',
        title: 'Handel statt Hilfe',
        description: 'Märkte öffnen, Investitionen fördern, Handelsabkommen, Wirtschaftspartnerschaften',
        cost: 5000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -5 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 18 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000038.0003',
        title: 'Klimaschutz und grüne Entwicklung',
        description: 'Erneuerbare Energien exportieren, Klimaanpassung, nachhaltige Technologien',
        cost: 18000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'co2EmissionReduktionPfad', value: 5 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000038.0004',
        title: 'Entwicklungshilfe reduzieren',
        description: 'Weniger Geld ins Ausland, Deutschland first, Eigenverantwortung fördern',
        cost: -8000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -8 }
        ]
      }
    ]
  },
  {
    id: '1000000039',
    title: 'Zukunft der Arbeit und Automatisierung',
    description: 'Wie soll Deutschland mit der Automatisierung umgehen und die Arbeitswelt gestalten?',
    category: 'soziales',
    timeframe: 'lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000039.0001',
        title: 'Robotersteuer und Maschinenabgabe',
        description: 'Unternehmen zahlen für jeden Roboter, Finanzierung des Sozialstaats, Umverteilung',
        cost: -15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 12 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 25 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -20 },
          { metric: 'arbeitslosenquote', value: 1 },
          { metric: 'wirtschaftswachstum', value: -3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: -12 }
        ]
      },
      {
        id: '1000000039.0002',
        title: 'Vollautomatisierung fördern',
        description: 'Deutschland als Roboter-Nation, Effizienz maximieren, Wettbewerbsvorteil',
        cost: 40000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 20 },
          { metric: 'arbeitslosenquote', value: 5 },
          { metric: 'wirtschaftswachstum', value: 8 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 20 }
        ]
      },
      {
        id: '1000000039.0003',
        title: 'Mensch-Maschine-Kooperation',
        description: 'Augmented Workers, KI als Assistent, Weiterbildung, hybride Arbeitsplätze',
        cost: 25000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'arbeitslosenquote', value: -1 },
          { metric: 'wirtschaftswachstum', value: 5 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 15 }
        ]
      },
      {
        id: '1000000039.0004',
        title: 'Neue Arbeitsfelder schaffen',
        description: 'Care-Arbeit, Kreativität, zwischenmenschliche Dienste, Sinnökonomie',
        cost: 30000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 15 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 20 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 5 },
          { metric: 'arbeitslosenquote', value: -3 },
          { metric: 'wirtschaftswachstum', value: 2 }
        ]
      }
    ]
  },
  {
    id: '1000000040',
    title: 'Deutschlands Rolle in einer multipolaren Welt',
    description: 'Wie soll Deutschland sich in einer Welt mit mehreren Supermächten positionieren?',
    category: 'aussenpolitik',
    timeframe: 'sehr-lang',
    immediateEffects: true,
    options: [
      {
        id: '1000000040.0001',
        title: 'Westliche Allianz stärken',
        description: 'Enge Bindung an USA, NATO, G7, demokratische Werte verteidigen, Systemkonkurrenz',
        cost: 20000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: -8 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 15 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 20 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 8 }
        ]
      },
      {
        id: '1000000040.0002',
        title: 'Strategische Autonomie und Äquidistanz',
        description: 'Gleichabstand zu allen Mächten, eigene Interessen, Vermittlerrolle, Neutralität',
        cost: 10000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 8 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 12 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -5 },
          { metric: 'wirtschaftswachstum', value: 3 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 5 }
        ]
      },
      {
        id: '1000000040.0003',
        title: 'Europäische Supermacht werden',
        description: 'EU als dritte Kraft, europäische Armee, gemeinsame Außenpolitik, Weltmacht',
        cost: 35000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: 5 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 15 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: 12 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: 25 },
          { metric: 'wirtschaftswachstum', value: 2 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 12 }
        ]
      },
      {
        id: '1000000040.0004',
        title: 'Globaler Süden und neue Partnerschaften',
        description: 'BRICS beitreten, Afrika-Partnerschaft, Süd-Süd-Kooperation, Post-Westlich',
        cost: 15000000000,
        effects: [
          { metric: 'popularitaetBeiWaehlern', value: -3 },
          { metric: 'zufriedenheitSozialdemokratischerKoalitionspartner', value: 18 },
          { metric: 'zufriedenheitLiberalerKoalitionspartner', value: -8 },
          { metric: 'sicherheitVerteidigungskapazitaeten', value: -10 },
          { metric: 'wirtschaftswachstum', value: 4 },
          { metric: 'investitionsattraktivitaetDeutschlands', value: 3 }
        ]
      }
    ]
  }
];