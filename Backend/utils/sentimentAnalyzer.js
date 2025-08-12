import vader from "vader-sentiment";
import natural from "natural";
const tokenizer = new natural.WordTokenizer();
const stopwords = natural.stopwords;

export const analyzeSentiment = (text) => {
  // Clean and tokenize text
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const tokens = tokenizer.tokenize(cleanedText);
  const finalWords = tokens.filter((word) => !stopwords.includes(word));

  // Perform sentiment analysis
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);

  return {
    sentiment:
      intensity.compound <= -0.05
        ? "negative"
        : intensity.compound >= 0.05
        ? "positive"
        : "neutral",
    compoundScore: intensity.compound,
  };
};
