import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// Define the shape of our Blog Post
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

const parser = new Parser();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Uses Gemini by default, but you can configure other APIs (e.g. OpenAI/NVIDIA) as needed

// Helper to slugify a string
function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function generateContent() {
  console.log("Fetching trending topics from Google Trends...");
  // Replace with your specific Google Trends RSS feed URL (e.g. for a specific country or topic)
  // This is the global trending searches RSS for the US as an example
  const feed = await parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=US');
  
  if (feed.items.length === 0) {
    console.log("No trending topics found today.");
    return;
  }

  // Get the top trend
  const topTrend = feed.items[0];
  const topic = topTrend.title || "Technology";
  
  console.log(`Top trend identified: ${topic}`);
  console.log("Generating blog article using AI...");

  try {
    const prompt = `Write an engaging, technical blog post about the trending topic: "${topic}". 
The post should be structured with headings, an introduction, and a conclusion. 
Focus on the implications of this topic in the fields of technology, AI, or engineering if possible. 
Return the response in raw Markdown format without any markdown code blocks wrapper.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "Failed to generate content.";
    
    // Generate a short excerpt
    const excerptResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a 2-sentence summary/excerpt for this article:\n\n${content}`,
    });
    const excerpt = excerptResponse.text || `${topic} is currently trending in the news.`;

    const post: BlogPost = {
      id: slugify(topic),
      title: `Trending: ${topic}`,
      date: new Date().toISOString(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: [topic.split(' ')[0], "Trending", "AI Insights"]
    };

    // Save to the blog data directory
    const dataDir = path.join(process.cwd(), 'src', 'data', 'blog');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, `${post.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    
    console.log(`Successfully generated and saved blog post: ${filePath}`);
    
    // Update the index file
    updateBlogIndex(dataDir);
    
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

function updateBlogIndex(dataDir: string) {
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file !== 'index.json');
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const post = JSON.parse(content);
    return {
      id: post.id,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags
    };
  });
  
  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'data', 'blog_index.json'), 
    JSON.stringify(posts, null, 2)
  );
  console.log("Updated blog index.");
}

generateContent();
