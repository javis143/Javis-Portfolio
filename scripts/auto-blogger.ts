import { GoogleGenAI } from '@google/genai';
import Parser from 'rss-parser';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Define your domain of specialty keywords here
const DOMAIN_KEYWORDS = ['tech', 'hardware', 'solar', 'engineering', 'ai', 'robotics', 'software', 'energy', 'innovation', 'google'];

// Initialize Google Trends RSS parser
const parser = new Parser();

// Initialize Gemini AI (Requires GEMINI_API_KEY in .env)
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

async function fetchTrendingTopics() {
  console.log('Fetching Google Trends...');
  try {
    // Fetch trending searches for the US (you can change the geo code)
    const feed = await parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=US');
    
    const trendingTopics = feed.items.map(item => ({
      title: item.title,
      description: item.contentSnippet || '',
      link: item.link
    }));

    return trendingTopics;
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return [];
  }
}

function filterRelevantTopics(topics: any[]) {
  console.log('Filtering topics based on domain keywords...');
  return topics.filter(topic => {
    const text = `${topic.title} ${topic.description}`.toLowerCase();
    return DOMAIN_KEYWORDS.some(keyword => text.includes(keyword));
  });
}

async function generateArticle(topic: any) {
  if (!ai) {
    console.warn('Skipping article generation. GEMINI_API_KEY is not set.');
    return null;
  }

  console.log(`Generating article for topic: ${topic.title}...`);
  
  const prompt = `
    You are an expert tech and engineering blogger. 
    Write an engaging, SEO-optimized blog post about the trending topic: "${topic.title}".
    Context: ${topic.description}
    
    Make the article relevant to audiences interested in Mechatronics, Hardware, AI, or Software Engineering.
    Include an engaging title, an introduction, main points, and a conclusion.
    Format the output in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return {
      title: topic.title,
      content: response.text,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return null;
  }
}

function saveArticle(article: { title: string; content: string; date: string }) {
  const outputDir = path.join(process.cwd(), 'src', 'data', 'generated-blog');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeTitle = article.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filePath = path.join(outputDir, `${safeTitle}.md`);

  const fileContent = `---
title: "${article.title}"
date: "${article.date}"
---

${article.content}
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`✅ Article saved: ${filePath}`);
}

async function runAutoBlogger() {
  console.log('--- Starting Auto-Blogger Pipeline ---');
  
  const topics = await fetchTrendingTopics();
  if (topics.length === 0) {
    console.log('No trending topics found today.');
    return;
  }

  const relevantTopics = filterRelevantTopics(topics);
  
  // If no strictly relevant topics, just take the top tech-adjacent one
  const targetTopics = relevantTopics.length > 0 ? relevantTopics : [topics[0]];
  
  console.log(`Found ${targetTopics.length} topics to write about.`);

  for (const topic of targetTopics) {
    const article = await generateArticle(topic);
    if (article) {
      saveArticle(article);
    }
  }
  
  console.log('--- Auto-Blogger Pipeline Complete ---');
}

runAutoBlogger();
