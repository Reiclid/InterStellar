/**
 * ON-DEVICE SENTIMENT, TOXICITY & THREAT CLASSIFIER
 * Runs 100% offline with zero network calls. Detects aggressive language,
 * profanity, obscenity, and coercion/threat patterns.
 */

export class SentimentClassifier {
  static analyze(text) {
    if (!text) {
      return { score: 0, level: "NEUTRAL", toxicity: 0, profanity: false, threatDetected: false };
    }

    const lower = text.toLowerCase();

    // Aggression & threat lexicon
    const threatKeywords = ["kill", "attack", "destroy", "force", "die", "harm", "weapon", "bomb", "threat", "breach", "steal", "track", "hack"];
    const profanityKeywords = ["fuck", "shit", "bitch", "bastard", "damn", "asshole", "crap", "idiot", "dumb", "fool", "bitch"];
    const highEmotionKeywords = ["urgent", "immediately", "now", "warning", "danger", "emergency", "fatal", "critical"];

    let threatScore = 0;
    let profanityCount = 0;
    let emotionScore = 0;

    threatKeywords.forEach(word => {
      if (lower.includes(word)) threatScore += 25;
    });

    profanityKeywords.forEach(word => {
      if (lower.includes(word)) profanityCount++;
    });

    highEmotionKeywords.forEach(word => {
      if (lower.includes(word)) emotionScore += 15;
    });

    // Check ALL CAPS boost
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    if (text.length > 5 && upperCount / text.length > 0.6) {
      emotionScore += 20;
    }

    const totalToxicity = Math.min(100, threatScore + (profanityCount * 30) + emotionScore);

    let level = "NEUTRAL";
    if (totalToxicity >= 65) level = "HIGH RISK / THREAT";
    else if (totalToxicity >= 35) level = "MODERATE / AGGRESSIVE";
    else if (totalToxicity >= 15) level = "ELEVATED TONE";

    return {
      toxicityScore: totalToxicity,
      level,
      profanityDetected: profanityCount > 0,
      threatDetected: threatScore >= 25,
      emotionScore
    };
  }
}
