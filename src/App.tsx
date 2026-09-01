import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Sun, Moon, Mail, Linkedin, ExternalLink, 
  CheckCircle2, Plus, Trash2, AlertCircle, Loader2, 
  Send, Database, BookOpen, Heart, Info, RefreshCw, ChevronRight, 
  Clipboard, Check, MessageSquare, Key, Eye, EyeOff, Code
} from "lucide-react";
import { useTranslation } from "./lib/i18n";
import Markdown from 'react-markdown';
import { Admin } from "./components/Admin";
import { Blog } from "./components/Blog";
import { SolarTrackerSandbox } from "./components/SolarTrackerSandbox";
import blogIndex from "./data/blog_index.json";

import esp32Journey from "./data/blog/esp32-journey.json";
import multiTenant from "./data/blog/multi-tenant-architecture.json";
import solarTracking from "./data/blog/solar-tracking-optimization.json";
import embeddedFuture from "./data/blog/embedded-systems-future.json";

const BLOG_ARTICLES: Record<string, any> = {
  "esp32-journey": esp32Journey,
  "multi-tenant-architecture": multiTenant,
  "solar-tracking-optimization": solarTracking,
  "embedded-systems-future": embeddedFuture
};

// Custom mechatronics/embedded engineering projects
const PROJECTS = [
  {
    id: "solar-tracker",
    title: "Dual-Axis Solar Tracker",
    image: "/images/solar_tracker_project.jpg",
    tags: ["ESP32", "Renewable Energy", "PID Control", "IoT Telemetry"],
    shortDesc: "Precise astronomical solar tracking array using low-power dual-core ESP32 algorithms to maximize PV solar collection yield by up to 40%.",
    caseStudy: {
      problem: "Static solar panels lose significant energy absorption efficiency (up to 40%) as the sun moves across the sky at varying seasonal inclinations.",
      solution: "Designed a lightweight, dual-axis solar tracking mechanical system. Equipped with light-dependent resistors (LDRs), servo drive actuators, and an ESP32 microcontroller acting as the real-time mathematical controller.",
      implementation: [
        "Coded a non-blocking PID loop tracking algorithm in C++ to align the solar panel directly perpendicular to incoming light rays.",
        "Integrated active Wi-Fi telemetry broadcasting real-time angle coordinates and electrical solar voltage data.",
        "Created a web-based SVG data dashboard demonstrating live orientation, current status, and daily accumulation statistics."
      ],
      components: ["ESP32 Dev Board", "LDR Photodetectors", "Micro Servo Drive Units", "Mini Solar PV Panel (12V)", "ADC Noise Filters"]
    }
  },
  {
    id: "smart-socket",
    title: "Smart Socket & Overcurrent Protection",
    image: "/images/smart_socket_protection.jpg",
    tags: ["Arduino", "Hardware Security", "Current Sensing", "Relays"],
    shortDesc: "IoT power monitoring outlet equipped with high-speed current monitoring, optocoupled logic isolation, and automatic overcurrent protective trip relays.",
    caseStudy: {
      problem: "Inexpensive domestic electronics lack dedicated overcurrent safety trips, leading to frequent appliance failures and potential fire hazards.",
      solution: "Developed a robust, smart energy socket plug with integrated real-time current-sensing, galvanic optical logic isolation, and automated rapid trip relays.",
      implementation: [
        "Wired a precise non-invasive ACS712 current transducer and applied low-pass RC filtering to condition the sensor's raw analog output.",
        "Configured high-speed microcontroller thresholds to isolate high-voltage mains loads under 20ms of load current surge.",
        "Implemented secure optocoupler circuits to completely isolate the sensitive microcontroller's 5V DC power boundary from AC mains voltage."
      ],
      components: ["Arduino Nano", "ACS712 Current Transducer", "Optocoupler Isolators", "10A Mechanical Trip Relay", "OLED Status Display"]
    }
  },
  {
    id: "propeller-clock",
    title: "Propeller LED POV Clock",
    image: "/images/propeller_led_clock.jpg",
    tags: ["Embedded C", "PCB Design", "Brushless Motors", "Sensor Sync"],
    shortDesc: "A persistence of vision (POV) analog clock using a custom spinning PCB, high-speed LED sync, and Hall effect position alignment.",
    caseStudy: {
      problem: "Creating a completely mechanical or standard matrix dynamic visual clock requires complex, bulky, and expensive arrays.",
      solution: "Engineered a high-speed rotating Persistence of Vision (POV) single-line LED clock. Uses optical illusion timing to paint an analog/digital clock face in mid-air.",
      implementation: [
        "Designed and fabricated a custom double-sided balanced PCB on EasyEDA, perfectly weighted to spin smoothly at 2500 RPM.",
        "Utilized a Hall effect sensor as a high-precision hardware trigger input to synchronize the exact zero-degree starting point of each spin.",
        "Programmed a 16-bit Timer interrupt with sub-microsecond precision in raw C++ to toggle an array of 8 high-brightness LEDs on/off."
      ],
      components: ["ATmega328P MCU", "Hall Effect Magnetic Trigger", "Custom Balanced PCB", "Brushless DC Motor", "Lithium Battery Ring Controller"]
    }
  },
  {
    id: "greenhouse-poultry",
    title: "Smart Poultry & Greenhouse Automation",
    image: "/images/smart_poultry_automation.jpg",
    tags: ["ESP32", "Agriculture", "Climate Control", "Sensors"],
    shortDesc: "Automated climate control, animal feed dispensers, and multi-sensor environmental telemetry system designed for agricultural enclosures.",
    caseStudy: {
      problem: "Small-scale agricultural enclosures experience high livestock mortality or lower crop yield due to sudden, unmonitored climate swings.",
      solution: "Engineered an intelligent, multi-zone micro-climate controller utilizing combined heating/cooling control loops and automated food dispensers.",
      implementation: [
        "Integrated a high-accuracy temperature and humidity sensor array with solid-state relay coils powering fans and heating lamps.",
        "Programmed continuous agricultural telemetry data collection with localized fail-safe SD Card backup storage.",
        "Built a dual-screw motorized food dispenser scheduled via real-time clock (RTC) registers."
      ],
      components: ["ESP32-WROOM-32", "DHT22 Climate Probes", "RTC Timing Chip", "Dual Motor Actuators", "Relay Control Enclosure"]
    }
  },
  {
    id: "vital-signs",
    title: "Vital Signs Telemetry Monitor",
    image: "/images/vital_signs_monitor.jpg",
    tags: ["BLE", "Wearables", "Medical Sensors", "Low Power"],
    shortDesc: "Low-power medical tracking unit measuring heart rate, oxygen levels, and temperature, with real-time Bluetooth Low Energy broadcasting.",
    caseStudy: {
      problem: "Bulkier clinical medical monitors limit consumer portability and consume high power, making remote outpatient tracking difficult.",
      solution: "Constructed an ultra-compact, battery-powered wearable monitoring band using optimized Bluetooth Low Energy (BLE) profiles.",
      implementation: [
        "Interfaced a MAX30102 pulse oximetry sensor and applied ambient-light cancellation algorithms to capture clear photoplethysmogram (PPG) waveforms.",
        "Coded ESP32 deep sleep algorithms to cycle the processor down during inactive intervals, extending battery duration to 7 days.",
        "Broadcasted standard GATT healthcare profiles directly to a paired smartphone client application."
      ],
      components: ["ESP32-PICO-D4", "MAX30102 Oximeter", "Rechargeable LiPo Cell", "Active Power Management IC", "Compact 3D Printed Case"]
    }
  },
  {
    id: "embedded-lab",
    title: "Embedded Systems Lab Controller",
    image: "/images/pcb_board_design.jpg",
    tags: ["PCB Layout", "Industrial", "I2C / SPI Buses", "Safety"],
    shortDesc: "An industrial-grade computer automation console that aggregates multi-protocol I2C/SPI sensor feeds and commands modular actuator arrays.",
    caseStudy: {
      problem: "Educational and research labs spend substantial time configuring messy wiring connections, leading to short circuits and faulty testing.",
      solution: "Engineered a professional, metal-enclosed modular laboratory controller that exposes protected digital and analog bus terminals.",
      implementation: [
        "Laid out a 4-layer PCB with dedicated ground planes to minimize electromagnetic interference (EMI) on high-speed data lanes.",
        "Integrated active TVS diode electrostatic discharge protection across all user-facing testing terminals.",
        "Equipped the controller with SPI/I2C galvanic signal isolation chips to prevent connected testing loads from damaging the processor."
      ],
      components: ["STM32F4 Core board", "TVS ESD Protection Diodes", "Digital Bus Multiplexers", "Galvanic Optoisolators", "Extruded Aluminum Enclosure"]
    }
  }
];

interface Task {
  id: string;
  title: string;
  category: 'PCB' | 'Firmware' | 'Hardware' | 'Testing';
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  createdAt: string;
}

interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  repoName: string;
  repoUrl: string;
  commitUrl: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function App() {
  const { locale, setLocale, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'home' | 'blog' | 'tasks' | 'whoami' | 'admin'>('home');
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // --- Dynamic Blog Integration ---
  const [dynamicBlogIndex, setDynamicBlogIndex] = useState<any[]>([]);
  const [loadedArticles, setLoadedArticles] = useState<Record<string, any>>({});

  // --- AI Blogging Sandbox & Settings States ---
  const [showApiKey, setShowApiKey] = useState(false);
  const [blogApiKey, setBlogApiKey] = useState("javis_secret_blog_token");
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Deep Tutorial/Walkthrough");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);
  const [isPublishingGenerated, setIsPublishingGenerated] = useState(false);

  const fetchBlogIndex = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDynamicBlogIndex(data);
          return;
        }
      }
      setDynamicBlogIndex(blogIndex);
    } catch (err) {
      console.error("Error fetching blog index from API, falling back to static:", err);
      setDynamicBlogIndex(blogIndex);
    }
  };

  const fetchArticleDetails = async (id: string) => {
    if (loadedArticles[id]) return;
    try {
      const res = await fetch(`/api/blog/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLoadedArticles(prev => ({ ...prev, [id]: data }));
      } else {
        const staticArt = BLOG_ARTICLES[id];
        if (staticArt) {
          setLoadedArticles(prev => ({ ...prev, [id]: staticArt }));
        }
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
      const staticArt = BLOG_ARTICLES[id];
      if (staticArt) {
        setLoadedArticles(prev => ({ ...prev, [id]: staticArt }));
      }
    }
  };

  useEffect(() => {
    fetchBlogIndex();
  }, []);

  useEffect(() => {
    const activeId = selectedBlogId || (dynamicBlogIndex[0]?.id) || "esp32-journey";
    if (activeId) {
      fetchArticleDetails(activeId);
    }
  }, [selectedBlogId, dynamicBlogIndex]);

  // Theme support (synchronised with the index.html inline script and CSS variables)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyText = (text: string, successMsg: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(successMsg);
  };

  // --- Task Planner State & Effects ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("javis_tasks");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "task-1",
        title: "Calibrate dual-axis solar tracker photoresistor array thresholds",
        category: "Hardware",
        priority: "High",
        status: "In Progress",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString()
      },
      {
        id: "task-2",
        title: "Refactor ESP32 battery telemetry Wi-Fi deep-sleep routine",
        category: "Firmware",
        priority: "High",
        status: "To Do",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1).toISOString()
      },
      {
        id: "task-3",
        title: "Draft 4-layer power distribution network schematic for laboratory controller",
        category: "PCB",
        priority: "Medium",
        status: "Completed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("javis_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>("Firmware");
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>("Medium");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const taskItem: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      status: "To Do",
      createdAt: new Date().toISOString()
    };
    setTasks([taskItem, ...tasks]);
    setNewTaskTitle("");
    triggerToast("Task added successfully!");
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus: Task['status'] = 
          t.status === 'To Do' ? 'In Progress' : 
          t.status === 'In Progress' ? 'Completed' : 'To Do';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    triggerToast("Task deleted.");
  };

  // --- GitHub Commits Feed State & Effects ---
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [commitsError, setCommitsError] = useState(false);

  const fetchCommits = async () => {
    setCommitsLoading(true);
    setCommitsError(false);
    try {
      const res = await fetch("/api/github-commits");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCommits(data);
    } catch (err) {
      console.error("Error fetching commits:", err);
      setCommitsError(true);
    } finally {
      setCommitsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  // --- AI Chatbot State & Effects ---
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Initialize welcome message dynamically on locale change
  useEffect(() => {
    setChatMessages([
      {
        id: "welcome-msg",
        sender: "bot",
        text: t("chatbot.welcome") || "Hello! I'm Javis's interactive AI assistant. Ask me anything about my Mechatronics qualifications, ESP32/Arduino projects, EasyEDA board layouts, or custom automation networks!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [locale]);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || chatLoading) return;

    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    // Auto scroll
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const res = await fetch("/api/portfolio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatMessages.slice(-8)
        })
      });

      if (!res.ok) throw new Error("Failed to chat");
      const data = await res.json();

      const newBotMessage: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorBotMessage: Message = {
        id: `msg-bot-err-${Date.now()}`,
        sender: "bot",
        text: "I'm having a bit of trouble reaching my knowledge base. But Javis is always available for custom mechatronics and hardware integration work! You can email him at chimangwejavis1@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // --- Admin Dashboard State ---
  const [adminBlogDraftTitle, setAdminBlogDraftTitle] = useState("");
  const [adminBlogDraftTags, setAdminBlogDraftTags] = useState("");
  const [adminBlogDraftContent, setAdminBlogDraftContent] = useState("");
  const mockStats = {
    views: 1240,
    submissions: 12,
    apiLatency: "45ms",
    pipelineStatus: "Active"
  };

  const handlePublishDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminBlogDraftTitle.trim() || !adminBlogDraftContent.trim()) {
      triggerToast("Please provide a title and markdown content.");
      return;
    }
    try {
      const res = await fetch("/api/blog/publish", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${blogApiKey}`
        },
        body: JSON.stringify({
          title: adminBlogDraftTitle,
          content: adminBlogDraftContent,
          tags: adminBlogDraftTags,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Publish failed");
      }

      triggerToast(`Draft titled "${adminBlogDraftTitle}" published successfully!`);
      setAdminBlogDraftTitle("");
      setAdminBlogDraftTags("");
      setAdminBlogDraftContent("");
      await fetchBlogIndex(); // Refresh the list
    } catch (err: any) {
      console.error("Publish draft error:", err);
      triggerToast(`Failed to publish: ${err.message}`);
    }
  };

  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setAiGenerating(true);
    setGeneratedArticle(null);
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, style: aiStyle })
      });
      if (!res.ok) throw new Error("Failed to generate article");
      const data = await res.json();
      setGeneratedArticle(data);
      triggerToast("AI article drafted successfully! Review below.");
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      triggerToast("AI generation failed. Make sure your GEMINI_API_KEY is configured.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishGenerated = async () => {
    if (!generatedArticle) return;
    setIsPublishingGenerated(true);
    try {
      const res = await fetch("/api/blog/publish", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${blogApiKey}`
        },
        body: JSON.stringify({
          title: generatedArticle.title,
          content: generatedArticle.content,
          tags: generatedArticle.tags,
          excerpt: generatedArticle.excerpt
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to publish");
      }

      triggerToast("Article published to live portfolio blog!");
      setGeneratedArticle(null);
      setAiTopic("");
      await fetchBlogIndex(); // Reload list
    } catch (err: any) {
      console.error("Failed to publish AI post:", err);
      triggerToast(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishingGenerated(false);
    }
  };

  return (
    <div id="portfolio-app-root" className="min-h-screen flex flex-col bg-surface-50 text-surface-900 dark:bg-surface-900 dark:text-surface-50 transition-colors duration-300 font-sans">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold border border-indigo-500/30"
          >
            <CheckCircle2 className="h-5 w-5 text-indigo-100" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-100 dark:border-surface-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Developer Brand Signature */}
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">Javis</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Mechatronics Core</p>
            </div>
          </div>

          {/* Desktop Tab Selector */}
          <nav className="hidden md:flex items-center space-x-1 bg-surface-100/50 dark:bg-surface-800/50 p-1.5 rounded-xl border border-surface-100/30 dark:border-surface-800/30">
            {([
              { id: 'home', label: t('nav.home') },
              { id: 'blog', label: t('nav.blog') },
              { id: 'tasks', label: t('nav.tasks') },
              { id: 'whoami', label: t('nav.whoami') },
              { id: 'admin', label: t('nav.admin') }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedBlogId(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 relative ${
                  activeTab === tab.id 
                    ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-surface-900 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-surface-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Utility Toolbar (Languages + Theme Switcher) */}
          <div className="flex items-center space-x-3">
            {/* Multilingual Selector */}
            <div className="flex items-center space-x-1 bg-surface-100/40 dark:bg-surface-800/40 p-1 rounded-xl border border-surface-100/30 dark:border-surface-800/30">
              {[
                { code: 'en', label: 'EN' },
                { code: 'fr', label: 'FR' },
                { code: 'sw', label: 'SW' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all duration-150 ${
                    locale === lang.code 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-gray-500 hover:text-surface-900 dark:hover:text-surface-50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 text-gray-500 dark:text-gray-300 border border-surface-100 dark:border-surface-800 transition-all duration-150"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <nav className="md:hidden sticky top-20 z-30 bg-surface-50/95 dark:bg-surface-900/95 border-b border-surface-100 dark:border-surface-800 px-4 py-2.5 overflow-x-auto flex space-x-2 scrollbar-none transition-colors duration-300">
        {([
          { id: 'home', label: t('nav.home') },
          { id: 'blog', label: t('nav.blog') },
          { id: 'tasks', label: t('nav.tasks') },
          { id: 'whoami', label: t('nav.whoami') },
          { id: 'admin', label: t('nav.admin') }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedBlogId(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === tab.id 
                ? "bg-indigo-600 text-white"
                : "bg-surface-100 dark:bg-surface-800 text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME (PORTFOLIO VIEW) */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-16 animate-fade-in"
            >
              
              {/* HERO SECTION */}
              <section className="relative overflow-hidden rounded-3xl bg-radial from-indigo-900/10 via-transparent to-transparent py-12 md:py-20 border border-surface-100 dark:border-surface-800 bg-surface-100/20 dark:bg-surface-800/10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl space-y-6">
                  {/* Banner tag */}
                  <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                    <span>{t('hero.banner')}</span>
                  </span>

                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    {t('hero.title')}
                  </h2>

                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {t('hero.tagline')}
                  </p>

                  {/* Actions bar */}
                  <div className="flex flex-wrap gap-3.5 pt-2">
                    <button
                      onClick={() => setActiveTab('whoami')}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/15 flex items-center space-x-2 transition-all duration-150"
                    >
                      <Info className="h-4.5 w-4.5" />
                      <span>{t('hero.whoami')}</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(window.location.href, t('hero.copied') || "Link copied!")}
                      className="px-6 py-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 rounded-xl text-xs font-extrabold border border-surface-100 dark:border-surface-800 flex items-center space-x-2 transition-all duration-150 text-gray-700 dark:text-gray-300"
                    >
                      <Clipboard className="h-4.5 w-4.5" />
                      <span>{t('hero.share')}</span>
                    </button>
                  </div>
                </div>

                {/* Animated visual telemetry deck */}
                <div className="w-full md:w-80 h-48 bg-surface-100 dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-800/80 p-5 flex flex-col justify-between shrink-0 shadow-lg relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Database className="h-4 w-4 text-indigo-500 animate-bounce" />
                      <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Live Sensor Mesh</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Wired</span>
                  </div>

                  <div className="space-y-4 my-3">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                        <span>Solar Tracking Yaw Angle</span>
                        <span className="text-indigo-400 font-black">142.5°</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-50 dark:bg-surface-900 rounded-full overflow-hidden border border-surface-100 dark:border-surface-800/60">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                        <span>ACS712 Load Current</span>
                        <span className="text-indigo-400 font-black">3.12 A</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-50 dark:bg-surface-900 rounded-full overflow-hidden border border-surface-100 dark:border-surface-800/60">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black text-gray-500 border-t border-surface-50 dark:border-surface-900 pt-3">
                    <span>MCU: ESP32-WROOM</span>
                    <span className="text-green-500">SYS_OK</span>
                  </div>
                </div>
              </section>

              {/* INTERACTIVE PROJECTS GRID */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">{t('projects.title')}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('projects.interactive_grid')}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-xl border border-surface-100 dark:border-surface-800">
                    {PROJECTS.length} Core Systems
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className="group bg-white dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden shadow-md hover:shadow-xl dark:shadow-none hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Canvas */}
                        <div className="h-44 overflow-hidden relative bg-surface-50 dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800/40">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                            {proj.tags.slice(0, 1).map((tag) => (
                              <span key={tag} className="px-2.5 py-1 bg-surface-900/85 text-white text-[9px] font-black uppercase tracking-wider rounded-lg backdrop-blur-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Project Brief */}
                        <div className="p-5 space-y-3.5">
                          <h4 className="font-extrabold text-sm tracking-tight text-indigo-600 dark:text-indigo-400">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                            {proj.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Case Study Entry Trigger */}
                      <div className="px-5 pb-5 pt-1">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="w-full py-2.5 bg-surface-100 dark:bg-surface-900/50 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-extrabold border border-surface-100 dark:border-surface-800 flex items-center justify-center space-x-2 transition-all duration-150 group-hover:border-indigo-500/20"
                        >
                          <span>{t('projects.view_case_study')}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* DUAL SECTION: CERTIFICATION + LIVE GITHUB LOG */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                
                {/* Dassault Certification Segment */}
                <section className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="h-6 w-6" />
                      <h3 className="font-black tracking-tight text-lg text-surface-900 dark:text-surface-50">
                        {t('certifications.title')}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {/* Certification 1 */}
                      <div className="p-4 bg-surface-50 dark:bg-surface-900/60 rounded-2xl border border-surface-100 dark:border-surface-800/80 flex items-start space-x-4 transition-all duration-200 hover:border-indigo-500/20">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 border border-surface-100 dark:border-surface-800 shadow-sm">
                          <img 
                            src="/images/certified_project_planner_enovia_associate.jpg" 
                            alt="Project Planner Enovia Associate Badge" 
                            className="h-full w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-surface-900 dark:text-surface-50 leading-snug">
                            {t('certifications.badge_title_1')}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Dassault Systèmes
                          </p>
                        </div>
                      </div>

                      {/* Certification 2 */}
                      <div className="p-4 bg-surface-50 dark:bg-surface-900/60 rounded-2xl border border-surface-100 dark:border-surface-800/80 flex items-start space-x-4 transition-all duration-200 hover:border-indigo-500/20">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 border border-surface-100 dark:border-surface-800 shadow-sm">
                          <img 
                            src="/images/certified_3dexperience_3dswymer_associate.jpg" 
                            alt="3DSwymer Associate Badge" 
                            className="h-full w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-surface-900 dark:text-surface-50 leading-snug">
                            {t('certifications.badge_title_2')}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Dassault Systèmes
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      {t('whoami.cert_desc')}
                    </p>
                  </div>

                  <a
                    href="https://www.credly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-surface-100 dark:bg-surface-900 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-extrabold border border-surface-100 dark:border-surface-800 transition-all duration-150 text-center text-gray-700 dark:text-gray-300"
                  >
                    <span>{t('certifications.view_credential')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </section>

                {/* GitHub Sync Feed Segment */}
                <section className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-black tracking-tight">{t('commits.title')}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">GitHub Live Sync</p>
                    </div>
                    <button
                      onClick={fetchCommits}
                      disabled={commitsLoading}
                      className="p-2 bg-surface-100 dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 hover:bg-surface-100/80 dark:hover:bg-surface-900/80 transition-all text-gray-500 disabled:opacity-50"
                      title={t('commits.refresh')}
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${commitsLoading ? 'animate-spin text-indigo-500' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-3.5 min-h-48 flex flex-col justify-center">
                    {commitsLoading ? (
                      <div className="flex flex-col items-center justify-center space-y-2 py-8 text-xs text-gray-500 font-bold">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                        <span>{t('commits.loading')}</span>
                      </div>
                    ) : commitsError || commits.length === 0 ? (
                      <div className="text-center py-6 space-y-2 border border-dashed border-surface-100 dark:border-surface-800 rounded-2xl bg-surface-50/50 dark:bg-surface-900/30">
                        <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                        <h4 className="text-xs font-extrabold text-gray-500">{t('commits.error')}</h4>
                        
                        {/* Static offline mock fallback layout */}
                        <div className="max-w-xs mx-auto text-left text-[10px] text-gray-400 dark:text-gray-500 space-y-2 pt-3 border-t border-surface-100 dark:border-surface-800">
                          <div className="flex items-center justify-between font-bold">
                            <span>solar-tracking-PID</span>
                            <span className="font-mono text-indigo-500">a5c3e7f</span>
                          </div>
                          <p className="truncate font-semibold text-gray-500">feat: optimize solar tracking PID loop coefficients</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {commits.map((commit, idx) => (
                          <div
                            key={commit.sha + idx}
                            className="p-3 bg-surface-50 dark:bg-surface-900/60 rounded-xl border border-surface-100 dark:border-surface-800/80 flex items-start space-x-3 text-xs"
                          >
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-40">{commit.repoName}</span>
                                <a 
                                  href={commit.commitUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="font-mono text-gray-400 hover:text-indigo-400 underline"
                                >
                                  {commit.sha}
                                </a>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 truncate font-semibold leading-relaxed">
                                {commit.message}
                              </p>
                              <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold">
                                <span>Author: {commit.author}</span>
                                <span>{new Date(commit.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE BLOG */}
          {activeTab === 'blog' && (
            <Blog />
          )}

          {/* TAB 3: TASKS PLANNER */}
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 animate-fade-in"
            >
              
              <div className="border-b border-surface-100 dark:border-surface-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t('tasks.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">{t('tasks.tagline')}</p>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-600/10 dark:bg-indigo-400/10 px-3.5 py-2 rounded-xl">
                    {tasks.filter(t => t.status === 'Completed').length} / {tasks.length} Done
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Input Console */}
                <div className="lg:col-span-4 bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 flex flex-col justify-between">
                  <form onSubmit={handleAddTask} className="space-y-5">
                    <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50 tracking-tight pb-3 border-b border-surface-50 dark:border-surface-900">
                      {t('tasks.add')}
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Task Title / Requirement</label>
                      <input
                        type="text"
                        required
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g., Lay out custom SPI isolator terminals"
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">System Domain</label>
                      <select
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value as any)}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-bold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                      >
                        <option value="Firmware">Firmware Development</option>
                        <option value="Hardware">Hardware Schematics</option>
                        <option value="PCB">PCB Layout Design</option>
                        <option value="Testing">Calibration & Testing</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('tasks.priority')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Low', 'Medium', 'High'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewTaskPriority(p as any)}
                            className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border transition ${
                              newTaskPriority === p 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-surface-50 dark:bg-surface-900 text-gray-500 border-surface-100 dark:border-surface-800"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/15 flex items-center justify-center space-x-2 transition"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Log Item</span>
                    </button>
                  </form>

                  <div className="pt-6 mt-6 border-t border-surface-50 dark:border-surface-900/60 text-[10px] text-gray-400 font-semibold space-y-1.5">
                    <p className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      <span>Click checkboxes to step through task statuses.</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      <span>Tasks auto-saved securely to local storage.</span>
                    </p>
                  </div>
                </div>

                {/* Right: Active Board Panel */}
                <div className="lg:col-span-8 bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                      <Check className="h-10 w-10 text-green-500 mx-auto" />
                      <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50">Clear Board!</h3>
                      <p className="text-xs text-gray-400 font-semibold">No active embedded development logs registered.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                            task.status === 'Completed'
                              ? "bg-surface-50/55 dark:bg-surface-900/20 border-surface-100/50 dark:border-surface-850/20 opacity-60"
                              : "bg-surface-50 dark:bg-surface-900/40 border-surface-100 dark:border-surface-800"
                          }`}
                        >
                          <div className="flex items-start space-x-3.5 min-w-0">
                            {/* Interactive toggle block */}
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className={`mt-0.5 h-5.5 w-5.5 rounded-xl border flex items-center justify-center transition shrink-0 ${
                                task.status === 'Completed'
                                  ? "bg-green-500 border-green-500 text-white"
                                  : task.status === 'In Progress'
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-gray-300 dark:border-surface-700 hover:border-indigo-500"
                              }`}
                            >
                              {task.status === 'Completed' && <Check className="h-3 w-3" />}
                              {task.status === 'In Progress' && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
                            </button>

                            <div className="space-y-1.5 min-w-0">
                              <h4 className={`text-xs font-extrabold tracking-tight ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-surface-900 dark:text-surface-50'}`}>
                                {task.title}
                              </h4>
                              
                              {/* Metadata indicators */}
                              <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                <span className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold">
                                  {task.category}
                                </span>
                                <span className={`px-2 py-0.5 rounded-lg ${
                                  task.priority === 'High' ? 'text-red-500 bg-red-500/10' :
                                  task.priority === 'Medium' ? 'text-orange-500 bg-orange-500/10' :
                                  'text-gray-400 bg-surface-100 dark:bg-surface-800'
                                }`}>
                                  {task.priority} Priority
                                </span>
                                <span className="font-bold">
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 4: WHO AM I & CHATBOT */}
          {activeTab === 'whoami' && (
            <motion.div
              key="whoami-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-12 animate-fade-in"
            >
              
              {/* BIOGRAPHY AREA */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Biography Texts */}
                <div className="lg:col-span-7 bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest bg-indigo-600/10 dark:bg-indigo-400/10 px-3 py-1 rounded-xl inline-block">
                      {t('whoami.tag')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t('whoami.title')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">{t('whoami.tagline')}</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{t('whoami.journey_p1')}</p>
                    <p>{t('whoami.journey_p2')}</p>
                    <p>{t('whoami.journey_p3')}</p>
                    <p>{t('whoami.journey_p4')}</p>
                  </div>

                  {/* Core specialty matrix */}
                  <div className="space-y-3 pt-4 border-t border-surface-50 dark:border-surface-900/60">
                    <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('whoami.qualifications')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-surface-50 dark:bg-surface-900/55 rounded-xl border border-surface-100 dark:border-surface-800/80">
                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider block mb-0.5">{t('whoami.bachelors')}</span>
                        <h5 className="text-xs font-extrabold text-surface-900 dark:text-surface-50 leading-snug">{t('whoami.bachelors_field')}</h5>
                      </div>
                      <div className="p-3.5 bg-surface-50 dark:bg-surface-900/55 rounded-xl border border-surface-100 dark:border-surface-800/80">
                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider block mb-0.5">{t('whoami.hnd')}</span>
                        <h5 className="text-xs font-extrabold text-surface-900 dark:text-surface-50 leading-snug">{t('whoami.hnd_field')}</h5>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Mission statement card */}
                <div className="lg:col-span-5 bg-gradient-to-tr from-indigo-900/10 via-indigo-900/5 to-transparent bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-black text-lg text-indigo-600 dark:text-indigo-400 flex items-center space-x-2.5">
                      <Heart className="h-5 w-5 animate-pulse" />
                      <span>{t('whoami.mission_title')}</span>
                    </h3>
                    <blockquote className="border-l-4 border-indigo-600 pl-4 text-xs italic font-semibold text-gray-500 dark:text-gray-400 leading-relaxed py-1.5">
                      {t('whoami.mission_quote')}
                    </blockquote>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t('whoami.mission_p1')}
                    </p>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t('whoami.mission_p2')}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-surface-50 dark:border-surface-900/60 flex items-center justify-between text-[11px] font-black uppercase text-gray-400">
                    <span>Engineering Goal</span>
                    <span className="text-indigo-500">Zero-Overload Efficiency</span>
                  </div>
                </div>

              </section>

              {/* INTEGRATED CHATBOT INTERFACE */}
              <section className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 overflow-hidden flex flex-col h-144">
                
                {/* Chat header */}
                <div className="px-6 py-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-surface-50/50 dark:bg-surface-900/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-surface-900 dark:text-surface-50">{t('chatbot.title')}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('chatbot.tagline')}</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="AI Core Connected"></span>
                </div>

                {/* Messages scroller */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface-50/20 dark:bg-surface-900/10">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xl rounded-2xl p-4 text-xs font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/5"
                          : "bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50 border border-surface-100 dark:border-surface-800/80 rounded-tl-none"
                      }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[8px] font-black block mt-2.5 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400 uppercase tracking-widest'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800/80 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                        <span>Generating answer...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Chat footer preset chips & input bar */}
                <div className="p-5 border-t border-surface-100 dark:border-surface-800 bg-surface-50/30 dark:bg-surface-900/10 space-y-4">
                  {/* Shortcut queries chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: "ESP32 Experience", query: "Tell me about your ESP32 microcontroller experience." },
                      { label: "Portfolio Projects", query: "What are your core mechatronics projects?" },
                      { label: "Credentials", query: "What are your academic and engineering qualifications?" },
                      { label: "Project Availability", query: "Are you open to contract or freelance hardware work?" }
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        disabled={chatLoading}
                        onClick={() => handleSendMessage(chip.query)}
                        className="px-3.5 py-2 bg-white dark:bg-surface-900 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-surface-100 dark:border-surface-800 transition disabled:opacity-50 text-gray-500"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Typing inputs */}
                  <div className="flex space-x-3.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t('chatbot.input_placeholder') || "Ask me about my qualifications..."}
                      className="flex-1 px-4 py-3 bg-white dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim() || chatLoading}
                      className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </section>

            </motion.div>
          )}

          {/* TAB 5: ADMIN SYSTEM CONFIG */}
          {activeTab === 'admin' && (
            <Admin />
          )}

          {/* REMOVED INLINE CONFIG */}
          {false && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 animate-fade-in"
            >
              
              <div className="border-b border-surface-100 dark:border-surface-800 pb-5">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t('admin.title')}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Configure Claude Webhooks & Generate Dynamic Posts</p>
              </div>

              {/* Grid with statistics cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Live Site Views", val: mockStats.views, unit: "Unique Hits" },
                  { label: "Inbox Submissions", val: mockStats.submissions, unit: "Contact Messages" },
                  { label: "API Handshake Latency", val: mockStats.apiLatency, unit: "Client-to-Gemini" },
                  { label: "External Blog Webhooks", val: "Online", unit: "Claude / API Endpoint" },
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 bg-white dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-800 flex flex-col justify-between h-28 shadow-sm">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                    <div className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400">{stat.val}</div>
                    <span className="text-[9px] text-gray-400 font-semibold leading-none">{stat.unit}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Webhook Setup & Manual Draft */}
                <div className="lg:col-span-6 space-y-8">
                  
                  {/* Claude & External AI Connection Center */}
                  <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b border-surface-50 dark:border-surface-900">
                      <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50 tracking-tight leading-tight">
                          Claude / External LLM Webhook Setup
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Integrate External AI Agents programmatically</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      You can authorize Claude, ChatGPT, or custom scripts to programmatically publish mechatronics articles directly to this portfolio blog.
                    </p>

                    {/* API Secret Input with Toggle */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Your Security Token (Authorization Header)</label>
                      <div className="flex items-center space-x-2 bg-surface-50 dark:bg-surface-900 p-1.5 rounded-xl border border-surface-100 dark:border-surface-800">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={blogApiKey}
                          onChange={(e) => setBlogApiKey(e.target.value)}
                          placeholder="Secret token"
                          className="flex-1 bg-transparent border-none text-xs font-mono px-2.5 py-1.5 focus:outline-none focus:ring-0 text-surface-900 dark:text-surface-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 text-gray-400 hover:text-indigo-500 transition"
                          title="Show/Hide Token"
                        >
                          {showApiKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(blogApiKey, "API Token copied!")}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          title="Copy Token"
                        >
                          <Clipboard className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Webhook API URL */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Dynamic Webhook URL</label>
                      <div className="flex items-center space-x-2 bg-surface-50 dark:bg-surface-900 p-1.5 rounded-xl border border-surface-100 dark:border-surface-800">
                        <span className="flex-1 text-xs font-mono px-2.5 py-1.5 select-all overflow-x-auto whitespace-nowrap text-indigo-600 dark:text-indigo-400 font-bold">
                          {window.location.origin}/api/blog/publish
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${window.location.origin}/api/blog/publish`, "Webhook URL copied!")}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          title="Copy URL"
                        >
                          <Clipboard className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Copyable Claude JSON tool Schema */}
                    <div className="space-y-2.5 pt-3 border-t border-surface-50 dark:border-surface-900/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Claude Projects Tool definition (JSON Schema)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(JSON.stringify({
                            name: "publish_blog_post",
                            description: "Publish a deep technical blog post directly to Javis's mechatronics and embedded systems portfolio blog.",
                            input_schema: {
                              type: "object",
                              properties: {
                                title: { type: "string", description: "The title of the article" },
                                content: { type: "string", description: "The complete, rich article written in Markdown format with code blocks" },
                                tags: { type: "array", items: { type: "string" }, description: "List of relevant tags (e.g. ['ESP32', 'Firmware'])" },
                                excerpt: { type: "string", description: "Snappy 1-2 sentence article summary" }
                              },
                              required: ["title", "content"]
                            }
                          }, null, 2), "Claude Tool Schema copied!")}
                          className="text-[10px] text-indigo-500 hover:text-indigo-600 font-extrabold flex items-center space-x-1"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          <span>Copy Schema</span>
                        </button>
                      </div>
                      <div className="p-3 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 text-[10px] font-mono text-gray-400 max-h-36 overflow-y-auto leading-normal">
                        <pre>{JSON.stringify({
                          name: "publish_blog_post",
                          description: "Publish a deep technical blog post directly to Javis's mechatronics and embedded systems portfolio blog.",
                          input_schema: {
                            type: "object",
                            properties: {
                              title: { type: "string", description: "The title of the article" },
                              content: { type: "string", description: "The complete, rich article written in Markdown format with code blocks" },
                              tags: { type: "array", items: { type: "string" }, description: "List of relevant tags (e.g. ['ESP32', 'Firmware'])" },
                              excerpt: { type: "string", description: "Snappy 1-2 sentence article summary" }
                            },
                            required: ["title", "content"]
                          }
                        }, null, 2)}</pre>
                      </div>
                    </div>

                    {/* Copyable Claude System Prompt Instructions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Claude System Prompt Instructions</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`You are an expert mechatronics writer connected to Javis's website. Draft a high-fidelity, deep technical walkthrough about [Topic]. Make sure to include detailed hardware schematics specifications and firmware routines. Once complete, call the publish_blog_post tool using: URL: "${window.location.origin}/api/blog/publish" with Bearer Authorization token: "${blogApiKey}"`, "Claude Instructions copied!")}
                          className="text-[10px] text-indigo-500 hover:text-indigo-600 font-extrabold flex items-center space-x-1"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          <span>Copy prompt</span>
                        </button>
                      </div>
                      <p className="bg-surface-50 dark:bg-surface-900 p-3 rounded-xl border border-surface-100 dark:border-surface-800 text-[10px] text-gray-400 leading-relaxed font-semibold">
                        "You are an expert mechatronics writer connected to Javis's website. Draft a high-fidelity, deep technical walkthrough about [Topic] and call the publish_blog_post tool..."
                      </p>
                    </div>

                  </div>

                  {/* Manual Technical Post Composer */}
                  <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-5">
                    <div className="flex items-center space-x-3 pb-3 border-b border-surface-50 dark:border-surface-900">
                      <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl">
                        <Code className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50 tracking-tight leading-tight">
                          Draft a Technical Post (Markdown Sandbox)
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Write and compile manual logs</p>
                      </div>
                    </div>

                    <form onSubmit={handlePublishDraft} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Article Title</label>
                          <input
                            type="text"
                            required
                            value={adminBlogDraftTitle}
                            onChange={(e) => setAdminBlogDraftTitle(e.target.value)}
                            placeholder="e.g., Designing PCB Low-Noise Ground Planes"
                            className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={adminBlogDraftTags}
                            onChange={(e) => setAdminBlogDraftTags(e.target.value)}
                            placeholder="PCB, Hardware, Grounding"
                            className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Markdown Content</label>
                        <textarea
                          rows={8}
                          value={adminBlogDraftContent}
                          onChange={(e) => setAdminBlogDraftContent(e.target.value)}
                          placeholder="## Introduction..."
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/15 transition"
                      >
                        Publish Manual Post Live
                      </button>
                    </form>
                  </div>

                </div>

                {/* Right Column: Direct AI Blogger Sandbox & Status */}
                <div className="lg:col-span-6 space-y-8">
                  
                  {/* Direct AI Blogging Sandbox (Gemini powered) */}
                  <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b border-surface-50 dark:border-surface-900">
                      <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl">
                        <Cpu className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50 tracking-tight leading-tight">
                          Interactive AI Article Writer Sandbox
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Let Gemini draft premium mechatronics columns</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      Test Javis's exact blogging persona instantly. Choose a mechatronics topic (e.g. "ESP32 SPI telemetry arrays", "Sizing H-Bridge MOSFET gates") and style to generate a rich markdown post.
                    </p>

                    <form onSubmit={handleGenerateWithAI} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Generate Topic</label>
                          <input
                            type="text"
                            required
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="e.g. ESP32 interrupts & safety gates"
                            className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Writing Style</label>
                          <select
                            value={aiStyle}
                            onChange={(e) => setAiStyle(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 text-xs font-semibold rounded-xl border border-surface-100 dark:border-surface-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition"
                          >
                            <option value="Deep Tutorial/Walkthrough">Deep Tutorial/Walkthrough</option>
                            <option value="Hardware Architecture Review">Hardware Architecture Review</option>
                            <option value="Firmware Walkthrough & Snippets">Firmware Walkthrough & Snippets</option>
                            <option value="Industry Perspective Column">Industry Perspective Column</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={aiGenerating || !aiTopic.trim()}
                        className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/15 transition flex items-center justify-center space-x-2.5 disabled:opacity-50"
                      >
                        {aiGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Gemini Drafting Post...</span>
                          </>
                        ) : (
                          <>
                            <Cpu className="h-4 w-4" />
                            <span>Draft Article with Gemini</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Render AI Draft Preview if exists */}
                    {generatedArticle && (
                      <div className="pt-4 border-t border-surface-50 dark:border-surface-900/60 space-y-4 animate-fade-in">
                        <div className="p-4 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-600/10 dark:bg-indigo-400/10 px-2.5 py-1 rounded-xl">
                              Generated Draft Preview
                            </span>
                            <button
                              type="button"
                              onClick={() => setGeneratedArticle(null)}
                              className="text-[10px] text-gray-400 hover:text-red-500 font-extrabold"
                            >
                              Discard
                            </button>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-surface-900 dark:text-surface-50">{generatedArticle.title}</h4>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                              Tags: {generatedArticle.tags?.join(", ")}
                            </p>
                          </div>

                          <div className="p-3.5 bg-white dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-900/60 max-h-48 overflow-y-auto text-[11px] prose dark:prose-invert leading-relaxed font-medium">
                            <Markdown>{generatedArticle.content}</Markdown>
                          </div>

                          <button
                            type="button"
                            onClick={handlePublishGenerated}
                            disabled={isPublishingGenerated}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition shadow-lg shadow-green-600/15 disabled:opacity-50"
                          >
                            {isPublishingGenerated ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Publishing to Live Blog...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Publish Live to Portfolio Blog</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* System Status Monitor */}
                  <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-800 p-6 md:p-8 flex flex-col justify-between shadow-sm">
                    <div className="space-y-5">
                      <div className="flex items-center space-x-3 pb-3 border-b border-surface-50 dark:border-surface-900">
                        <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl">
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-surface-900 dark:text-surface-50 tracking-tight leading-tight">
                            System Status Monitor
                          </h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Real-time gateway diagnostics</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: "Express server.ts", val: "Online", clr: "text-green-500" },
                          { label: "Blog Index Controller", val: "Operational (File-system read/write)", clr: "text-green-500" },
                          { label: "Blogger Sync API Gate", val: `/api/blog/publish`, clr: "text-indigo-500 font-mono" },
                          { label: "Gemini SDK Core", val: "@google/genai (Dynamic)", clr: "text-indigo-500" },
                          { label: "Firebase Handshake", val: "Connected", clr: "text-green-500" },
                          { label: "Gatt Bluetooth Mock API", val: "Operational", clr: "text-green-500" }
                        ].map((sys, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs border-b border-surface-50 dark:border-surface-900/60 pb-2.5">
                            <span className="text-gray-500 font-semibold">{sys.label}</span>
                            <span className={`font-black ${sys.clr}`}>{sys.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-surface-50 dark:border-surface-900/60 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span>Build Environment</span>
                      <span className="text-indigo-500">Node JS / Vite 6</span>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-100 dark:border-surface-800 py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-sm font-black text-surface-900 dark:text-surface-50">
              {t('footer.title')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleCopyText("chimangwejavis1@gmail.com", t('footer.copied') || "Copied!")}
              className="px-4 py-2.5 bg-surface-50 dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-[10px] font-black uppercase tracking-wider border border-surface-100 dark:border-surface-800 flex items-center space-x-2 transition text-gray-600 dark:text-gray-300"
            >
              <Mail className="h-4 w-4" />
              <span>{t('footer.copy_email')}</span>
            </button>

            <button
              onClick={() => handleCopyText("https://linkedin.com", t('footer.copied') || "Copied!")}
              className="px-4 py-2.5 bg-surface-50 dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-[10px] font-black uppercase tracking-wider border border-surface-100 dark:border-surface-800 flex items-center space-x-2 transition text-gray-600 dark:text-gray-300"
            >
              <Linkedin className="h-4 w-4" />
              <span>Copy LinkedIn</span>
            </button>
          </div>
        </div>
      </footer>

      {/* DETAILED PROJECT CASE STUDY DIALOG MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            
            {/* Dark modal overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal card container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col"
            >
              
              {/* Header image banner */}
              <div className="h-52 w-full overflow-hidden relative border-b border-surface-100 dark:border-surface-700 bg-surface-100 dark:bg-surface-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-surface-900/80 text-white rounded-xl hover:bg-surface-900 transition backdrop-blur-sm text-xs font-bold px-3 py-2"
                >
                  Close Case Study
                </button>
              </div>

              {/* Modal scroll contents */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Title */}
                <div className="space-y-3.5 border-b border-surface-50 dark:border-surface-900 pb-5">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-600/10 dark:bg-indigo-400/10 px-2.5 py-1 rounded-xl">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-3xl font-black tracking-tight text-surface-900 dark:text-surface-50 leading-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Mechatronics Case Study Analysis
                  </p>
                </div>

                {/* Subsections */}
                <div className="space-y-6 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                  
                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tracking-tight uppercase tracking-wide">
                      The Engineering Problem
                    </h4>
                    <p className="bg-surface-50 dark:bg-surface-900/60 p-4 rounded-xl border border-surface-100 dark:border-surface-700/80">
                      {selectedProject.caseStudy.problem}
                    </p>
                  </div>

                  {/* Solution Outline */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tracking-tight uppercase tracking-wide">
                      Proposed Solution & System Architecture
                    </h4>
                    <p>
                      {selectedProject.caseStudy.solution}
                    </p>
                  </div>

                  {/* Implementation Details */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tracking-tight uppercase tracking-wide">
                      Technical Implementation
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedProject.caseStudy.implementation.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Components Sizing */}
                  <div className="space-y-2 pt-4 border-t border-surface-50 dark:border-surface-900/60">
                    <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Engineering Component Sizing
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {selectedProject.caseStudy.components.map(comp => (
                        <span key={comp} className="px-3 py-1.5 bg-surface-50 dark:bg-surface-900/55 rounded-lg border border-surface-100 dark:border-surface-700/60 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Physical Hardware Sandbox Section for Solar Tracker */}
                  {selectedProject.id === "solar-tracker" && (
                    <SolarTrackerSandbox />
                  )}

                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
