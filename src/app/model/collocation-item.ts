export class CollocationItem {
  positiveFilter: string | null = null;
  negativeFilter: string | null = null;
  word: string | null = null;
  concurrenceCount: number | null = null;
  candidateCount: number | null = null;
  tscore: number | null = null;
  mi: number | null = null;
  mi3: number | null = null;
  logLikelihood: number | null = null;
  minSensitivity: number | null = null;
  logDice: number | null = null;
  miLogF: number | null = null;
}