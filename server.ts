import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

// Initialize Gemini API
// Make sure GEMINI_API_KEY is available in process.env
const getAi = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

export function configureApp(app: express.Express) {
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // GitHub Commits API Cache & Logic
  interface GitHubCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
    repoName: string;
    repoUrl: string;
    commitUrl: string;
  }

  let commitsCache: { data: GitHubCommit[]; timestamp: number } | null = null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fallbackCommits: GitHubCommit[] = [
    {
      sha: "a5c3e7f",
      message: "feat: optimize dual-axis solar tracking PID loop parameters",
      author: "javis143",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 days ago
      repoName: "dual-axis-solar-tracker",
      repoUrl: "https://github.com/javis143/dual-axis-solar-tracker",
      commitUrl: "https://github.com/javis143/dual-axis-solar-tracker"
    },
    {
      sha: "b8d2a1c",
      message: "refactor: integrate robust ESP32 Deep Sleep and battery telemetry profiles",
      author: "javis143",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString(), // 5 days ago
      repoName: "smart-greenhouse-iot",
      repoUrl: "https://github.com/javis143/smart-greenhouse-iot",
      commitUrl: "https://github.com/javis143/smart-greenhouse-iot"
    },
    {
      sha: "e3f1b4a",
      message: "docs: publish comprehensive wiring diagrams and PCB schematic walkthroughs",
      author: "javis143",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 8).toISOString(), // 8 days ago
      repoName: "smart-home-telemetry",
      repoUrl: "https://github.com/javis143/smart-home-telemetry",
      commitUrl: "https://github.com/javis143/smart-home-telemetry"
    }
  ];

  app.get("/api/github-commits", async (req, res) => {
    try {
      // 1. Check Cache
      const now = Date.now();
      if (commitsCache && now - commitsCache.timestamp < CACHE_DURATION) {
        return res.json(commitsCache.data);
      }

      const username = "javis143";
      const headers: Record<string, string> = {
        "User-Agent": "javis-portfolio-app",
        "Accept": "application/vnd.github.v3+json",
      };

      if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
      }

      // Attempt 1: Fetch public events
      const response = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
      
      if (response.ok) {
        const events = (await response.json()) as any[];
        const commits: GitHubCommit[] = [];

        for (const event of events) {
          if (commits.length >= 3) break;

          if (event.type === "PushEvent" && event.payload && event.payload.commits) {
            const repoName = event.repo.name.replace(`${username}/`, ""); // Simplify name
            const repoUrl = `https://github.com/${event.repo.name}`;
            
            for (const commit of event.payload.commits) {
              if (commits.length >= 3) break;
              
              commits.push({
                sha: commit.sha.substring(0, 7),
                message: commit.message,
                author: commit.author.name || username,
                date: event.created_at,
                repoName,
                repoUrl,
                commitUrl: `${repoUrl}/commit/${commit.sha}`
              });
            }
          }
        }

        if (commits.length > 0) {
          commitsCache = { data: commits, timestamp: now };
          return res.json(commits);
        }
      }

      // Attempt 2: Fetch recently updated repos and get their commits
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`, { headers });
      if (reposResponse.ok) {
        const repos = (await reposResponse.json()) as any[];
        const fallbackList: GitHubCommit[] = [];

        for (const repo of repos) {
          if (fallbackList.length >= 3) break;
          
          const commitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=3`, { headers });
          if (commitsResponse.ok) {
            const repoCommits = (await commitsResponse.json()) as any[];
            for (const commitObj of repoCommits) {
              if (fallbackList.length >= 3) break;
              
              fallbackList.push({
                sha: commitObj.sha.substring(0, 7),
                message: commitObj.commit.message,
                author: commitObj.commit.author?.name || username,
                date: commitObj.commit.author?.date || repo.updated_at,
                repoName: repo.name,
                repoUrl: repo.html_url,
                commitUrl: commitObj.html_url
              });
            }
          }
        }

        if (fallbackList.length > 0) {
          commitsCache = { data: fallbackList, timestamp: now };
          return res.json(fallbackList);
        }
      }

      // If both fail, use offline fallback (but don't cache permanently, try again next time or use shorter cache)
      return res.json(fallbackCommits);
    } catch (error) {
      console.error("Error fetching GitHub commits:", error);
      // Return fallback list on any exception
      return res.json(fallbackCommits);
    }
  });

  // Portfolio AI Assistant Chatbot API
  app.post("/api/portfolio/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = getAi();
      if (!ai) {
        return res.json({ response: "Hello! I am Javis's AI assistant. My connection to the live Gemini model is currently in offline mode, but I can tell you that Javis is a highly skilled Mechatronics and Embedded Systems Engineer who specializes in ESP32, Arduino, PCB design, and IoT automation!" });
      }

      const systemInstruction = `
You are the AI assistant for Javis's Personal Embedded Systems & Mechatronics Portfolio.
Your goal is to answer questions about Javis's background, qualifications, mechatronics projects, and professional availability.

Here is information about Javis:
- **Profile**: Javis is a Mechatronics & Automation Engineer specializing in custom automation, IoT, embedded systems, and hardware design.
- **Qualifications**:
  - Bachelor's Degree in Mechatronics Engineering.
  - Higher National Diploma (HND) in Industrial Computer Automation.
  - Dassault Systèmes Certified 3DEXPERIENCE Project Planner (Associate) with a strong foundation in mechanical structures, motion control, and embedded telemetry.
- **Core Technical Expertise**: Embedded hardware & software, PCB layout (EasyEDA, etc.), IoT hubs, sensor integrations, microcontrollers (ESP32, Arduino, STM32), low-level programming, and industrial computer automation.
- **Featured Projects**:
  1. **Dual-Axis Solar Tracker**: A precise tracker using LDRs and servo motors with ESP32-based PID loop control and Wi-Fi data telemetry monitoring dashboard.
  2. **Smart Socket & Overcurrent Protection**: An IoT smart plug with active current sensing, optocoupler logic isolation, and automatic safety trip relays.
  3. **Propeller LED Clock**: A persistence of vision (POV) rotating analog clock with high-speed LED sync, Hall effect positioning, and custom PCB.
  4. **Smart Poultry/Greenhouse Automation**: Agricultural climate control, food/water dispensers, and telemetry node built on ESP32.
  5. **Vital Signs SpO2 Monitor**: A low-power wearable monitor using BLE pairing to broadcast oxygen levels, heart rate, and temperature.
  6. **Modular Lab Controller**: An industrial automation gateway that aggregates SPI/I2C sensor feeds and commands modular actuator arrays.
- **Personality**: Professional, highly competent, creative hardware tinkerer, enthusiast for technical education and sharing knowledge. Speak clearly, concisely, and with technical accuracy.
- **Multilingual**: Javis and his assistant speak English, Français, and Kiswahili. Answer in the same language as the user's prompt.

Ensure your responses are friendly, informative, technical, and directly answer the user's questions about Javis's credentials or mechatronics projects. Keep your answers concise (1-2 short paragraphs) so they fit nicely in a chat screen.
      `;

      const formattedContents = [
        { role: 'user', parts: [{ text: `System context: ${systemInstruction}` }] },
        ...(history || []).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
      });

      res.json({ response: response.text || "I'm sorry, I couldn't process that response." });
    } catch (error: any) {
      console.error("Portfolio Chat API Error:", error);
      res.json({ response: "Hello! I encountered a small network issue, but I can confirm that Javis is a fantastic Mechatronics Engineer available for IoT, PCB, and firmware projects!" });
    }
  });

  // Helper to check BLOG_API_KEY authentication
  const checkBlogAuth = (req: any) => {
    const expectedKey = process.env.BLOG_API_KEY || "javis_secret_blog_token";
    const authHeader = req.headers.authorization;
    let providedKey = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      providedKey = authHeader.substring(7);
    } else {
      providedKey = req.body.secret_key || req.query.secret_key || "";
    }
    return providedKey === expectedKey;
  };

  // 1. GET all blog index items
  app.get("/api/blog", (req, res) => {
    try {
      const indexPath = path.join(process.cwd(), "src/data/blog_index.json");
      if (fs.existsSync(indexPath)) {
        const raw = fs.readFileSync(indexPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.json([]);
    } catch (err) {
      console.error("GET /api/blog error:", err);
      return res.status(500).json({ error: "Failed to read blog index" });
    }
  });

  // 2. GET specific blog article contents
  app.get("/api/blog/:id", (req, res) => {
    try {
      const { id } = req.params;
      const safeId = id.replace(/[^a-zA-Z0-9-_]/g, "");
      const postPath = path.join(process.cwd(), `src/data/blog/${safeId}.json`);
      if (fs.existsSync(postPath)) {
        const raw = fs.readFileSync(postPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.status(404).json({ error: "Blog post not found" });
    } catch (err) {
      console.error("GET /api/blog/:id error:", err);
      return res.status(500).json({ error: "Failed to read blog post" });
    }
  });

  // 3. POST publish a blog post (external endpoint)
  app.post("/api/blog/publish", (req, res) => {
    try {
      if (!checkBlogAuth(req)) {
        return res.status(401).json({ error: "Unauthorized. Invalid secret API key." });
      }

      const { title, content, tags, excerpt, coverImage } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields: title and content are required." });
      }

      // Generate id slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const blogDir = path.join(process.cwd(), "src/data/blog");
      if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
      }

      const processedTags = Array.isArray(tags) 
        ? tags 
        : typeof tags === "string" 
          ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : ["General"];

      const cleanExcerpt = excerpt || content
        .replace(/[#*`_\[\]()\-]/g, "")
        .substring(0, 160)
        .trim() + "...";

      const defaultImages = [
        "/images/esp32_hero_banner.jpg",
        "/images/solar_tracker_project.jpg",
        "/images/smart_socket_protection.jpg",
        "/images/future_embedded.jpg"
      ];
      const cleanCover = coverImage || defaultImages[Math.floor(Math.random() * defaultImages.length)];
      const articleDate = new Date().toISOString();

      const fullPost = {
        id: slug,
        title,
        date: articleDate,
        excerpt: cleanExcerpt,
        content,
        tags: processedTags,
        coverImage: cleanCover
      };

      // Write individual blog article JSON file
      const postPath = path.join(blogDir, `${slug}.json`);
      fs.writeFileSync(postPath, JSON.stringify(fullPost, null, 2), "utf-8");

      // Update blog index JSON file
      const indexPath = path.join(process.cwd(), "src/data/blog_index.json");
      let indexData: any[] = [];
      if (fs.existsSync(indexPath)) {
        try {
          indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
        } catch (e) {
          indexData = [];
        }
      }

      // Prevent duplicates by removing previous item with matching ID
      indexData = indexData.filter((item: any) => item.id !== slug);

      // Prepend metadata
      indexData.unshift({
        id: slug,
        title,
        date: articleDate,
        excerpt: cleanExcerpt,
        tags: processedTags,
        coverImage: cleanCover
      });

      fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), "utf-8");

      return res.json({ 
        success: true, 
        message: "Article published successfully", 
        article: { id: slug, title, date: articleDate, excerpt: cleanExcerpt, tags: processedTags } 
      });
    } catch (err: any) {
      console.error("POST /api/blog/publish error:", err);
      return res.status(500).json({ error: "Failed to publish article", details: err.message });
    }
  });

  // 4. POST generate blog content using Gemini AI
  app.post("/api/blog/generate", async (req, res) => {
    try {
      const { topic, style } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const ai = getAi();
      if (!ai) {
        return res.status(500).json({ error: "Gemini AI connection is unavailable" });
      }

      const prompt = `
You are writing a professional, deeply technical blog post for Javis's Mechatronics & Embedded Systems Portfolio blog.
Write an authentic, highly detailed, and engaging article about this topic: "${topic}".
The style/format of the post should be a: "${style || "Deep Tutorial/Walkthrough"}".

Instructions:
1. Come up with a catchy, professional title.
2. Structure the content using beautiful Markdown layout: headings (H2, H3), lists, code blocks with syntax highlighting (e.g., C++ for ESP32/Arduino, Python, etc.), and emphasis.
3. Write in Javis's exact professional, highly knowledgeable voice. Highlight practical problems (like noise, power stability, routing, firmware interrupts, decoupling caps, etc.) and direct engineering solutions.
4. Keep the article complete, technical, and rich (around 600-1000 words). Do not put placeholders or mock stubs like "[Write more here]".
5. Generate a short, snappy 1-2 sentence excerpt summarizing the article.
6. Provide 3-4 highly relevant tags (e.g., ESP32, Firmware, PCB, CAD, Robotics).

Return your response ONLY as a JSON object with this exact structure:
{
  "title": "Your Title",
  "tags": ["Tag1", "Tag2"],
  "excerpt": "A professional summary of the article",
  "content": "Full markdown content starting with a nice introduction..."
}

Ensure the output is valid JSON and not wrapped in markdown block syntax.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content from Gemini model");
      }

      const articleData = JSON.parse(responseText.trim());
      return res.json(articleData);
    } catch (err: any) {
      console.error("POST /api/blog/generate error:", err);
      return res.status(500).json({ error: "Failed to generate blog article", details: err.message });
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  configureApp(app);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
