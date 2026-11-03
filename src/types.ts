export type MuscleId = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'core'
  | 'calves';

export interface MuscleGroup {
  id: MuscleId;
  nameFa: string;
  nameEn: string;
  anatomicalName: string;
  category: 'upper' | 'lower' | 'core';
  descriptionFa: string;
  primaryAction: string;
  leverType: string;
  torqueProfile: string;
  exercisesCount: number;
}

export interface ExerciseBiomechanical {
  id: string;
  nameFa: string;
  nameEn: string;
  muscleId: MuscleId;
  secondaryMuscles: string[];
  leverClass: string;
  jointInvolved: string;
  momentArmInfo: string;
  resistanceCurve: string;
  correctiveCues: string[];
  commonMistakes: string[];
  injuryRisks: string[];
  optimalRepTempo: string;
  svgPathType: string;
}

export interface WorkoutSet {
  setNumber: number;
  weight: number; // in kg
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseNameFa: string;
  date: string;
  sets: WorkoutSet[];
}

export interface PowerBadge {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'strength' | 'biomechanics' | 'consistency';
}

export interface LeitnerCard {
  id: string;
  box: number; // 1 to 5
  questionFa: string;
  answerFa: string;
  biomechanicsCategory: string;
  nextReviewDate: string;
}

export interface TeaserScene {
  id: number;
  startTime: number;
  endTime: number;
  visualFa: string;
  visualTitle: string;
  speakerTextFa: string;
  soundFoleyFa: string;
  posterKey: 'fibers' | 'teaser' | 'book';
  bgGradient: string;
}

// Script #1 Types: Nutrition & Foundations
export interface NutritionProfile {
  bodyWeightKg: number;
  goal: 'hypertrophy' | 'fat_loss' | 'strength_health';
  targetProteinGrams: number;
  dailyEggWhites: number;
  yolksAllowed: number;
  boiledPotatoesGrams: number;
  dailyWaterLiters: number;
  sodiumMg: number;
  potassiumMg: number;
  magnesiumMg: number;
}

export interface ScriptOneState {
  hasReadMentalPrep: boolean;
  hasCalculatedNutrition: boolean;
  torquePrincipleAcknowledged: boolean;
  neutralSpineAcknowledged: boolean;
  tripodFootAcknowledged: boolean;
  badgeUnlocked: boolean;
}
