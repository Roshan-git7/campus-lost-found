const Item = require('../models/Item');

// Common English stopwords to ignore in keyword extraction
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'my', 'i', 'near', 'inside', 'outside', 'found', 'lost'
]);

function extractKeywords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function calculateKeywordScore(tokensA, tokensB) {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let matches = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      matches++;
    }
  }
  const minLen = Math.min(setA.size, setB.size);
  if (minLen === 0) return 0;
  // Overlap ratio capped at 30 points
  const ratio = Math.min(matches / minLen, 1.0);
  return Math.round(ratio * 30);
}

function calculateLocationScore(locA, locB) {
  if (!locA || !locB) return 0;
  const a = locA.toLowerCase().trim();
  const b = locB.toLowerCase().trim();
  if (a === b) return 20;
  if (a.includes(b) || b.includes(a)) return 16;

  const tokensA = extractKeywords(a);
  const tokensB = extractKeywords(b);
  const common = tokensA.filter((t) => tokensB.includes(t));
  if (common.length > 0) return 14;

  return 0;
}

function calculateDateScore(dateA, dateB) {
  if (!dateA || !dateB) return 0;
  const diffTime = Math.abs(new Date(dateA) - new Date(dateB));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) return 20;
  if (diffDays <= 7) return 15;
  if (diffDays <= 14) return 10;
  if (diffDays <= 30) return 5;
  return 0;
}

/**
 * Finds potential matching items from MongoDB for a given item.
 * @param {Object} targetItem - Mongoose item document
 * @param {Number} minScore - Minimum score to include in results (default: 25)
 * @returns {Array} List of matching items with score and breakdown
 */
async function findPotentialMatches(targetItem, minScore = 25) {
  // If target item is 'Lost', match with 'Found' items, and vice versa
  const oppositeType = targetItem.type === 'Lost' ? 'Found' : 'Lost';

  const candidates = await Item.find({
    _id: { $ne: targetItem._id },
    type: oppositeType,
    status: { $in: ['Open', 'Claim Pending'] },
  }).populate('reportedBy', 'name email');

  const targetTokens = extractKeywords(`${targetItem.title} ${targetItem.description}`);

  const scoredMatches = candidates.map((candidate) => {
    // 1. Category Score (30 pts max)
    const categoryScore = targetItem.category === candidate.category ? 30 : 0;

    // 2. Keyword Score (30 pts max)
    const candidateTokens = extractKeywords(`${candidate.title} ${candidate.description}`);
    const keywordScore = calculateKeywordScore(targetTokens, candidateTokens);

    // 3. Location Score (20 pts max)
    const locationScore = calculateLocationScore(targetItem.location, candidate.location);

    // 4. Date Proximity Score (20 pts max)
    const dateScore = calculateDateScore(targetItem.date, candidate.date);

    const totalScore = categoryScore + keywordScore + locationScore + dateScore;

    return {
      item: candidate,
      score: totalScore,
      breakdown: {
        categoryScore,
        keywordScore,
        locationScore,
        dateScore,
      },
    };
  });

  // Filter and sort by score descending
  return scoredMatches
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  findPotentialMatches,
  extractKeywords,
  calculateKeywordScore,
  calculateLocationScore,
  calculateDateScore,
};

