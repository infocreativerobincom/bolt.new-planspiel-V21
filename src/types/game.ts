export interface GameState {
  id: string;
  playerId: string;
  currentYear: number;
  currentDecision: number;
  completedDecisions: CompletedDecision[];
  metrics: GameMetrics;
  availableDecisions: string[];
  triggeredEvents: TriggeredEvent[];
  partyPolls: PartyPolls;
  budget: BudgetState;
  coalitionStatus: CoalitionStatus;
  timeProgress?: {
    monthsElapsed: number;
    complexityAccumulated: number;
    realTimeStart?: number;
    currentMonth: number;
    totalElapsedTime: number;
    isPaused: boolean;
  };
  gameOver?: {
    reason: string;
    description: string;
  };
  shownYearlyEvaluations?: number[];
  shownLegislatureEvaluations?: number[];
}

export interface GameMetrics {
  popularitaetBeiWaehlern: number;
  zufriedenheitSozialdemokratischerKoalitionspartner: number;
  zufriedenheitLiberalerKoalitionspartner: number;
  arbeitslosenquote: number;
  wirtschaftswachstum: number;
  investitionsattraktivitaetDeutschlands: number;
  entwicklungRealeinkommenMedian: number;
  schulden: number;
  zinskosten: number;
  sicherheitVerteidigungskapazitaeten: number;
  energiesicherheit: number;
  co2EmissionReduktionPfad: number;
  co2ReduktionTonnen: number;
  gesamtbewertung: number;
}

export interface PartyPolls {
  linke: number;
  liberale: number;
  sozialdemokraten: number;
  progressiven: number; // Spielerpartei
  konservative: number;
  rechte: number;
  gruene: number;
  sonstige: number;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  options: DecisionOption[];
  prerequisites?: string[];
  excludedBy?: string[];
  unlocks?: string[];
  timeframe: TimeFrame;
  immediateEffects: boolean;
  delayedEffects?: DelayedEffect[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  effects: MetricEffect[];
  delayedEffects?: DelayedEffect[];
  eventTriggers?: EventTrigger[];
  stakeholderReactions?: StakeholderReaction[];
  conflicts?: string[]; // IDs von Optionen, die sich widersprechen
}

export interface MetricEffect {
  metric: keyof GameMetrics;
  value: number;
  duration?: number;
  multiplier?: number;
  conditional?: ConditionalEffect;
}

export interface DelayedEffect {
  yearsDelay: number;
  effect: MetricEffect;
  description: string;
}

export interface EventTrigger {
  eventId: string;
  probability: number;
  conditions?: TriggerCondition[];
}

export interface TriggerCondition {
  metric: keyof GameMetrics;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface ConditionalEffect {
  condition: TriggerCondition;
  multiplier: number;
}

export interface StakeholderReaction {
  stakeholder: string;
  reaction: 'positive' | 'negative' | 'neutral';
  description: string;
  effects?: MetricEffect[];
}

export interface CompletedDecision {
  decisionId: string;
  optionIds: string[];
  year: number;
  effects: MetricEffect[];
  cost: number;
  decisionTitle?: string;
  selectedOptionTitles?: string[];
}

export interface TriggeredEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  effects: MetricEffect[];
  stakeholder?: string;
  triggerReason?: string;
}

export interface BudgetState {
  availableBudgetCurrentPeriod: number;
  totalSpentCurrentPeriod: number;
  totalDebt: number;
  annualInterestCosts: number;
  currentPeriod: number;
  periods: BudgetPeriod[];
}

export interface BudgetPeriod {
  id: number;
  years: string;
  budget: number;
  spent: number;
  remaining: number;
}

export interface CoalitionStatus {
  leftPartnerSatisfaction: number;
  liberalPartnerSatisfaction: number;
  stabilityRisk: 'low' | 'medium' | 'high';
  crisisEvents: string[];
}

export type DecisionCategory = 
  | 'nationale-politik'
  | 'globale-politik'
  | 'innenpolitik'
  | 'aussenpolitik'
  | 'umweltpolitik'
  | 'bildung'
  | 'wirtschaft'
  | 'verteidigung'
  | 'migration'
  | 'technologie'
  | 'digitalisierung'
  | 'infrastruktur'
  | 'rente'
  | 'soziales';

export type TimeFrame = 'sofort' | 'kurz' | 'mittel' | 'lang' | 'sehr-lang';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'crisis' | 'opportunity' | 'stakeholder' | 'external';
  triggerConditions: TriggerCondition[];
  probability: number;
  effects: MetricEffect[];
  decisions?: Decision[];
  stakeholder?: string;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'instructor';
  gameHistory: GameState[];
  currentGame?: string;
  groupId?: string;
}

export interface GameGroup {
  id: string;
  name: string;
  instructorId: string;
  players: string[];
  gameSettings: GameSettings;
  created: Date;
}

export interface GameSettings {
  maxDecisions: number;
  evaluationIntervals: number;
  randomEventsProbability: number;
  difficultyModifier: number;
  enableCoalitionMode: boolean;
}