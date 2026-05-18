/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Cpu, 
  Sun, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Users, 
  Code, 
  Wrench, 
  ChevronRight,
  ChevronLeft,
  Camera,
  Menu,
  X,
  ExternalLink,
  Award,
  BookOpen,
  Send,
  Binary
} from "lucide-react";

// --- Asset Imports ---
import solarTrackerImg from "./assets/images/solar_tracker_prototype_1779117783309.png";
import iotDashboardImg from "./assets/images/iot_smart_dashboard_1779117805974.png";
import labBenchImg from "./assets/images/embedded_lab_bench_1779117825873.png";
import rfidLockImg from "./assets/images/rfid_lock_system_1779117848821.png";
import { useState, useEffect, MouseEvent } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { SEO } from "./components/SEO";
import { Blog } from "./components/Blog";
import { Admin } from "./components/Admin";

// --- Components ---

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", hash: "#home" },
    { name: "About", href: "/", hash: "#about" },
    { name: "Skills", href: "/", hash: "#skills" },
    { name: "Projects", href: "/", hash: "#projects" },
    { name: "Leadership", href: "/", hash: "#leadership" },
    { name: "Blog", href: "/blog" },
  ];

  const handleNavClick = (link: any) => {
    setMobileMenuOpen(false);
    if (link.hash) {
      if (pathname === '/') {
        const el = document.querySelector(link.hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + link.hash);
      }
    } else {
      navigate(link.href);
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-surface-900/80 backdrop-blur-xl border-b border-surface-700 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-display font-bold tracking-tighter cursor-pointer"
          onClick={() => navigate('/')}
        >
          JAVIS<span className="text-primary">.TECH</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.name}
              onClick={() => handleNavClick(link)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`transition-colors hover:glow-sm ${
                (pathname === link.href) ? "text-primary" : "text-slate-400 hover:text-primary"
              }`}
            >
              {link.name}
            </motion.button>
          ))}
          <motion.a
            href="/#contact"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold hover:glow-blue transition-all"
          >
            LET'S TALK
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-800 border-b border-surface-700 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-lg font-display text-slate-300 hover:text-primary"
                >
                  {link.name}
                </button>
              ))}
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-400 font-mono flex items-center gap-2 mt-4"
              >
                <ShieldCheck size={12} /> Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ... rest of the existing functional components (Hero, About, Skills, etc.) 
// Note: I will keep them but wrap them in a Home component

function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-6">
            <Zap size={12} /> Embedded Systems Explorer
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold leading-[0.9] mb-6 tracking-tighter">
            Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Future</span> of IoT.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed font-sans">
            Technology enthusiast specializing in <span className="text-slate-200">ESP32 microcontrollers</span>, 
            renewable energy innovation, and smart automation systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white text-sm sm:text-base font-bold rounded-lg hover:glow-blue transition-all flex items-center gap-2 group">
              View My Work <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="px-6 py-3 sm:px-8 sm:py-4 glass-card text-white text-sm sm:text-base font-bold rounded-lg hover:bg-surface-700 transition-all">
              Learn More
            </a>
          </div>
        </motion.div>

        <div className="relative hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="aspect-square glass-card rounded-3xl p-6 flex items-center justify-center relative z-10"
          >
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              {[
                { img: solarTrackerImg, label: "Solar Tracking" },
                { img: rfidLockImg, label: "RFID Security" },
                { img: iotDashboardImg, label: "IoT Controller" },
                { img: labBenchImg, label: "R&D Lab" }
              ].map((item, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-surface-700 hover:border-primary/50 transition-all cursor-default">
                  <img 
                    src={item.img} 
                    alt={item.label}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Floating tag */}
            <div className="absolute -bottom-6 -right-6 p-4 glass-card rounded-2xl shadow-2xl animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <span className="block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Current Status</div>
                  <div className="text-sm font-bold text-slate-200">Innovating @ Home Lab</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon?: any }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4">
        {Icon && <Icon size={14} />} {subtitle}
      </div>
      <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function About() {
  const profiles = [
    {
      title: "The Professional",
      icon: Cpu,
      content: "I am a motivated and innovative technology enthusiast with strong interests in embedded systems, automation, renewable energy, and smart security solutions. My experience spans ESP32 microcontrollers, RFID systems, Arduino programming, and solar tracking systems."
    },
    {
      title: "The Student",
      icon: BookOpen,
      content: "Dedicated student with a strong passion for electronics, programming, and engineering innovation. Recognized for leadership abilities, teamwork, creativity, and a commitment to delivering tangible results through functional prototypes."
    },
    {
      title: "The Leader",
      icon: Users,
      content: "A proactive and responsible leader with experience coordinating project activities, organizing budgets, and preparing strategic plans. I focus on motivating team members toward successful project realization and technical innovation."
    }
  ];

  return (
    <section id="about" className="py-24 px-6 bg-surface-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Profile & Vision" 
          subtitle="Identity" 
          icon={Award}
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-10 rounded-2xl group hover:border-primary/50 transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-900 border border-surface-700 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <profile.icon size={24} />
              </div>
              <h3 className="text-xl font-display font-bold mb-4">{profile.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">{profile.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-2xl text-center md:text-left">
            <h4 className="text-lg font-bold mb-2">My Motivation</h4>
            <p className="text-sm text-slate-400 italic">"I am passionate about solving real-world problems through technology and practical engineering solutions. Turning ideas into functional prototypes is my core drive."</p>
          </div>
          <div className="flex gap-4">
            {['Creative', 'Ambitious', 'Disciplined', 'Adaptive'].map(trait => (
              <span key={trait} className="px-3 py-1 bg-surface-900 rounded-md border border-surface-700 text-[10px] uppercase font-bold text-slate-500">
                {trait}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  const categories = [
    {
      name: "Core Hardware",
      skills: ["ESP32 / Arduino", "Embedded Systems", "Sensors & Actuators", "Relay Control Systems"]
    },
    {
      name: "Integration",
      skills: ["RFID Systems", "Keypad & LCD", "IoT Systems", "Solar Tracking"]
    },
    {
      name: "Software & Digital",
      skills: ["C++ / Arduino IDE", "Digital Innovation", "Basic Web Tools", "System Design"]
    },
    {
      name: "Management",
      skills: ["Project Planning", "Budgeting", "Team Coordination", "Troubleshooting"]
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Technical Stack" subtitle="Expertise" icon={Zap} />
        
        <div className="grid md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <h4 className="font-mono text-[10px] text-primary uppercase tracking-widest px-4 border-l border-primary/30 ml-2 mb-4">
                {cat.name}
              </h4>
              <div className="flex flex-col gap-2">
                {cat.skills.map((skill) => (
                  <div key={skill} className="px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-sm text-slate-300 font-medium hover:bg-surface-700 transition-colors">
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: any) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = project.images && project.images.length > 0 ? project.images : [];

  const nextImg = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl overflow-hidden group border border-surface-700 hover:border-primary/40 transition-all flex flex-col h-full"
    >
      <div className="h-56 bg-surface-900 relative overflow-hidden group/img">
        {images.length > 0 ? (
          <>
            <motion.img
              key={currentImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[currentImg]}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-900/80 border border-surface-700 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-primary"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-900/80 border border-surface-700 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-primary"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? "bg-primary w-4" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-surface-700">
            <Camera size={48} strokeWidth={1} />
            <span className="text-[10px] font-mono uppercase tracking-widest">No Images Provided</span>
          </div>
        )}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 bg-surface-900/80 backdrop-blur-md rounded border border-surface-700 text-[10px] text-slate-300 font-mono">
          {project.category}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-display font-bold mb-3">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] font-mono text-primary/70">{`#${tag}`}</span>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-primary group/btn hover:underline">
          Project Documentation <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function Projects() {
  const projects = [
    {
      title: "Dual-Axis Solar Tracker",
      category: "Renewable Energy",
      description: "Designed a system to optimize solar energy absorption using LDR sensors and servo motors controlled via Arduino. Increased efficiency by following the sun's trajectory.",
      tags: ["Arduino", "Servo Motors", "LDR Sensors", "Calculus"],
      images: [
        solarTrackerImg,
        "https://images.unsplash.com/photo-1509391366360-fe5bb58488b5?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "RFID Smart Access Security",
      category: "Smart Security",
      description: "Developed an automated security system using ESP32, RFID modules, and relay control for door lock mechanisms. Features centralized database logging.",
      tags: ["ESP32", "RFID RC522", "Relays", "Security"],
      images: [
        rfidLockImg,
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "IoT Home Control Dashboard",
      category: "Automation",
      description: "Built a remote-access automation system for controlling household appliances using digital interfaces and sensors. Real-time feedback via Wi-Fi.",
      tags: ["IoT", "WebSockets", "Home Assistant", "System Integration"],
      images: [iotDashboardImg]
    }
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-surface-900 border-y border-surface-800">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Recent Projects" subtitle="Showcase" icon={Code} />
        
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section id="leadership" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeading title="Team Leadership & Project Management" subtitle="Soft Skills" icon={Users} />
            <p className="text-slate-400 leading-relaxed mb-8">
              Leadership isn't just about technical expertise; it's about coordination, motivation, and vision. 
              I have hands-on experience in:
            </p>
            <ul className="space-y-4">
              {[
                "Coordinating class and group activities across multiple disciplines",
                "Organizing and managing project budgets and resources",
                "Preparing detailed project execution plans and timelines",
                "Motivating team members toward collaborative success"
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary mt-1 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight size={14} />
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Successful Realizations", value: "10+", icon: Award },
              { label: "Budgets Managed", value: "Verified", icon: Zap },
              { label: "Team Members", value: "Local/Global", icon: Users },
              { label: "Coordination", value: "End-to-End", icon: Wrench }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group transition-all hover:bg-primary/5"
              >
                <stat.icon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-2xl font-display font-bold text-slate-100">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-surface-900 border-t border-surface-800">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading title="Connect for Collaboration" subtitle="Contact" icon={Mail} />
        <p className="text-slate-400 mb-12">
          I am always looking for opportunities to learn, collaborate, and contribute to impactful technology projects. 
          Whether you have a technical query or a leadership proposal, feel free to reach out.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 sm:p-8 rounded-3xl grid md:grid-cols-2 gap-8 items-center overflow-hidden"
        >
          <div className="text-left space-y-6 w-full overflow-hidden">
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-full bg-surface-900 border border-surface-700 flex items-center justify-center text-primary shrink-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Email Address</div>
                <div className="text-slate-200 font-bold text-xs sm:text-sm break-all">chimangwejavisnyamekong@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-full bg-surface-900 border border-surface-700 flex items-center justify-center text-primary shrink-0">
                <Linkedin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Personal Profile</div>
                <div className="text-slate-200 font-bold text-xs sm:text-sm break-all">linkedin.com/in/chimangwe javis</div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <a 
              href="mailto:chimangwejavisnyamekong@gmail.com" 
              className="w-full py-3 sm:py-4 bg-primary text-white text-sm sm:text-base font-bold rounded-xl flex items-center justify-center gap-3 hover:glow-blue transition-all"
            >
              <Send size={18} /> <span className="truncate">Send Message</span>
            </a>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-4">Usually responds within 24 hours</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-surface-800 bg-surface-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-display font-bold">JAVIS<span className="text-primary">.TECH</span></div>
          <p className="text-xs text-slate-500 font-mono">Building systems for a smarter tomorrow.</p>
        </div>

        <div className="flex gap-4">
          {[
            { icon: Github, href: "https://github.com/javis143" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/chimangwe-javis-a4893932b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
            { icon: Mail, href: "mailto:chimangwejavis1@gmail.com" }
          ].map((social, i) => (
            <a 
              key={i} 
              href={social.href}
              className="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Javis Portfolio. Made by <a target="_blank" href="https://2bigdev.vercel.app">2BigDev</a>.
          </div>
          <Link to="/admin" className="text-[8px] text-slate-700 hover:text-slate-400 font-mono uppercase tracking-widest transition-colors">
            System Console
          </Link>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <SEO />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Leadership />
      <Contact />
    </>
  );
}

// --- App Entry ---

export default function App() {
  return (
    <Router>
      <div className="selection:bg-primary/30 selection:text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

