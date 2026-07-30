/**
 * STYLOMETRY & "TEXT CALLIGRAPHY" ANALYZER
 * Measures linguistic markers: TTR (Type-Token Ratio), punctuation density,
 * capitalization ratio, typography patterns, and sentence length variance.
 */

export class StylometryAnalyzer {
  static analyzeText(text) {
    if (!text || text.trim().length === 0) {
      return {
        wordCount: 0,
        uniqueWords: 0,
        ttr: 0,
        capsRatio: 0,
        punctDensity: 0,
        avgSentenceLen: 0,
        typoFrequency: 0
      };
    }

    const cleanText = text.trim();
    const words = cleanText.split(/\s+/);
    const wordCount = words.length;

    // Type-Token Ratio (Vocabulary Richness)
    const uniqueSet = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/gi, '')));
    const uniqueWords = uniqueSet.size;
    const ttr = (uniqueWords / Math.max(1, wordCount)).toFixed(2);

    // Capitalization Ratio (ALL CAPS usage)
    const upperChars = (cleanText.match(/[A-Z]/g) || []).length;
    const totalChars = cleanText.length;
    const capsRatio = ((upperChars / totalChars) * 100).toFixed(1);

    // Punctuation Density (punctuation marks per 100 characters)
    const punctMarks = (cleanText.match(/[!?,.:;'"\-\(\)]/g) || []).length;
    const punctDensity = ((punctMarks / totalChars) * 100).toFixed(1);

    // Sentence length
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLen = (wordCount / Math.max(1, sentences.length)).toFixed(1);

    // Simple typo / repeat key heuristic (e.g. "soooo", "!!!", "??")
    const repeatPatterns = (cleanText.match(/(.)\1{2,}/g) || []).length;
    const typoFrequency = repeatPatterns;

    return {
      wordCount,
      uniqueWords,
      ttr: parseFloat(ttr),
      capsRatio: parseFloat(capsRatio),
      punctDensity: parseFloat(punctDensity),
      avgSentenceLen: parseFloat(avgSentenceLen),
      typoFrequency
    };
  }
}
