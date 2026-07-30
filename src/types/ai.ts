export interface StylometryMetrics {
  wordCount: number;
  uniqueWords: number;
  ttr: number;
  capsRatio: number;
  punctDensity: number;
  avgSentenceLen: number;
  typoFrequency: number;
}

export interface SentimentAnalysis {
  toxicityScore: number;
  level: string;
  profanityDetected: boolean;
  threatDetected: boolean;
  emotionScore: number;
}

export interface AiMetrics {
  stylometry: StylometryMetrics;
  sentiment: SentimentAnalysis;
  wpm: number;
}
