import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface Article {
  title: string;
  excerpt: string;
  url: string;
}

export async function generateWeeklyTheme(
  articles: Article[],
  weekStart: Date,
  weekEnd: Date
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are analyzing a weekly digest of Black tech news articles. Given the following ${articles.length} articles from the week of ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}, generate a compelling 2-3 paragraph theme that:

1. Identifies the major trends and patterns across these articles
2. Highlights the most significant developments in Black tech this week
3. Provides insightful analysis connecting the stories

Articles:
${articles.map((a, i) => `${i + 1}. ${a.title}\n   ${a.excerpt || 'No excerpt available'}`).join('\n\n')}

Write a concise, engaging theme that captures the essence of this week in Black tech news. Focus on the "why this matters" rather than just summarizing what happened.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No response from Gemini API');
  }

  return text;
}

export async function generateMonthlyTheme(
  articles: Article[],
  monthStart: Date,
  monthEnd: Date
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prompt = `You are creating the "State of Black Tech" monthly executive summary. Given the following ${articles.length} top articles from ${monthName}, generate a comprehensive 3-4 paragraph executive summary that:

1. Provides a high-level overview of the month's most significant developments
2. Identifies major trends, themes, and patterns in Black tech and innovation
3. Offers strategic insights about what these developments mean for the ecosystem
4. Highlights breakthrough achievements and important milestones

Articles:
${articles.map((a, i) => `${i + 1}. ${a.title}\n   ${a.excerpt || 'No excerpt available'}`).join('\n\n')}

Write an authoritative, forward-looking executive summary that positions this as "The State of Black Tech" for ${monthName}. Think big picture - what story does this month tell about Black innovation and technology?`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No response from Gemini API');
  }

  return text;
}
