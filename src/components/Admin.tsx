import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Lock, 
  LogOut, 
  PenTool, 
  Tag as TagIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from './SEO';

const ADMIN_EMAIL = "chimangwejavis1@gmail.com";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: any;
  authorName: string;
  tags: string[];
}

export function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or post ID
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    tags: [],
    authorName: 'Javis'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
        setPosts(postsData);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'blog_posts'));
      return () => unsub();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (isEditing === 'new') {
        await addDoc(collection(db, 'blog_posts'), {
          ...formData,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else if (isEditing) {
        await updateDoc(doc(db, 'blog_posts', isEditing), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      }
      setIsEditing(null);
      setFormData({ title: '', content: '', excerpt: '', published: false, tags: [], authorName: 'Javis' });
    } catch (error) {
      handleFirestoreError(error, isEditing === 'new' ? OperationType.CREATE : OperationType.UPDATE, 'blog_posts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blog_posts/${id}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface-900" />;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900 px-6">
        <SEO title="Admin Login" />
        <div className="glass-card p-12 rounded-3xl max-w-md w-full text-center border border-surface-700">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 text-white">Admin Access</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Only the site administrator can access the blog management dashboard.
          </p>
          <button 
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (error: any) {
                console.error("Login failed:", error);
                if (error.code === 'auth/unauthorized-domain') {
                  alert(`Login failed: This domain is not authorized in Firebase. \n\n1. Go to Firebase Console > Authentication > Settings > Authorized Domains.\n2. Add: ${window.location.hostname}\n3. Wait 2-5 minutes and try again.`);
                } else {
                  alert(`Login failed: ${error.message}. Try opening the app in a new tab if you're inside an iframe.`);
                }
              }
            }}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:glow-blue transition-all"
          >
            Sign in with Google
          </button>
          
          {user && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              Signed in as {user.email}. This account does not have admin privileges.
              <button onClick={() => signOut(auth)} className="ml-2 underline font-bold uppercase">Logout</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const seedSampleData = async () => {
    if (!window.confirm("This will add 5 sample blog posts to your portfolio. Continue?")) return;
    
    const samples = [
      {
        title: "The Future of Solar: Dual-Axis Tracking Systems",
        content: "Solar energy is most efficient when the panels are perpendicular to the sun's rays. In this post, we explore how a dual-axis tracker using LDR sensors and an Arduino can increase yield by up to 40% compared to fixed systems.\n\n### Key Components\n- LDR Sensors (4x)\n- Servo Motors (2x)\n- Arduino Uno / Nano\n- Custom 3D Printed Frame\n\n### Theoretical Yield\nBy following the sun precisely from dawn to dusk, the system maximizes the photon absorption rate throughout the day. We used astronomical calculations merged with real-time sensor feedback to ensure the panels never 'hunt' for light during cloudy intervals.",
        excerpt: "Learn how dual-axis solar trackers significantly improve efficiency by following the sun's path throughout the day.",
        published: true,
        tags: ["Solar", "Arduino", "CleanTech"],
        authorName: "Javis"
      },
      {
        title: "Securing the Edge: RFID & ESP32 Integration",
        content: "Security systems are moving towards smart integration. This project demonstrates how to build a robust RFID-based door lock using the ESP32 for cloud logging and centralized access control.\n\n```cpp\n// Sample ESP32 RFID Auth logic\nif (uid == authorizedUID) {\n  digitalWrite(RELAY_PIN, HIGH);\n  logAccessToFirebase(uid);\n}\n```\n\nWe discuss the challenges of relay debounce and secure Wi-Fi credential management in embedded contexts. The system also features a breakdown of the RC522 module interface via SPI.",
        excerpt: "Exploring building secure, IoT-connected access control systems using ESP32 and RFID technology.",
        published: true,
        tags: ["Security", "ESP32", "IoT"],
        authorName: "Javis"
      },
      {
        title: "Building a Better Breadboard: Prototyping Best Practices",
        content: "Prototyping is an art. From cable management to power distribution, how you build your initial circuits determines how fast you can debug them.\n\n1. **Color Coding**: Always use Red for VCC and Black for GND.\n2. **Short Jumper Wires**: Keeps the layout clean and reduces parasitic capacitance.\n3. **Decoupling Capacitors**: Essential for stable power delivery to microcontrollers.\n\nIn this guide, I share my personal workflow for going from schematic to a functional prototype ready for PCB layout. We also look at common pitfalls like floating pins and noisy power rails.",
        excerpt: "A guide for engineering students on effective circuit prototyping and debugging techniques.",
        published: true,
        tags: ["Electronics", "Prototyping", "Hardware"],
        authorName: "Javis"
      },
      {
        title: "Introduction to MQTT for Smart Home Labs",
        content: "Message Queuing Telemetry Transport (MQTT) is the backbone of modern IoT. In this entry, we set up a local Mosquitto broker and connect multiple ESP32 nodes to share sensor data.\n\n### Why MQTT?\n- Lightweight overhead\n- Publish/Subscribe model\n- Ideal for low-bandwidth embedded devices\n\nWe walk through setting up topics like `home/livingroom/temp` and how to handle 'Last Will and Testament' messages for device offline monitoring.",
        excerpt: "Understanding the lightweight communication protocol that powers the modern Internet of Things.",
        published: true,
        tags: ["IoT", "MQTT", "Networking"],
        authorName: "Javis"
      },
      {
        title: "Sustainable Innovation: My Journey in Green Tech",
        content: "Engineering isn't just about building things; it's about building things that last and preserve our environment. This philosophical post covers my personal journey into renewable energy projects.\n\nFrom building small scale wind turbines to optimizing battery storage for off-grid lighting, I believe the future of engineering lies at the intersection of efficiency and sustainability.",
        excerpt: "Reflections on the role of engineers in driving global sustainability through technical innovation.",
        published: true,
        tags: ["Sustainability", "Engineering", "Career"],
        authorName: "Javis"
      }
    ];

    try {
      for (const sample of samples) {
        await addDoc(collection(db, 'blog_posts'), {
          ...sample,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      alert("Sample blogs added successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'blog_posts');
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 pt-32 pb-20 px-6 font-sans">
      <SEO title="Blog Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Blog Dashboard</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><User size={12} className="text-primary"/> {user.email}</span>
              <button onClick={() => signOut(auth)} className="text-red-400 hover:underline flex items-center gap-1 uppercase font-bold tracking-tighter">
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={seedSampleData}
              className="px-6 py-3 bg-surface-800 text-slate-300 border border-surface-700 font-bold rounded-xl flex items-center gap-2 hover:bg-surface-700 transition-all"
            >
              <PenTool size={18} /> Seed Lab Data
            </button>
            <button 
              onClick={() => { setIsEditing('new'); setFormData({ title: '', content: '', excerpt: '', published: false, tags: [], authorName: 'Javis' }); }}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:glow-blue transition-all"
            >
              <Plus size={20} /> Create New Post
            </button>
          </div>
        </div>

        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-3xl border border-primary/20 bg-surface-800"
          >
            <div className="flex justify-between items-center mb-8 border-b border-surface-700 pb-6">
              <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                <PenTool size={20} className="text-primary" />
                {isEditing === 'new' ? 'New Blog Post' : 'Edit Post'}
              </h3>
              <button onClick={() => setIsEditing(null)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1">Title</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter post title..."
                    className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1">Exerpt (SEO)</label>
                  <input 
                    type="text" 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Short summary for SEO..."
                    className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1">Content (Markdown)</label>
                <textarea 
                  required
                  rows={15}
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Support markdown here..."
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm placeholder:text-slate-600 resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-surface-700">
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox"
                        className="sr-only"
                        checked={formData.published}
                        onChange={e => setFormData({...formData, published: e.target.checked})}
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${formData.published ? 'bg-primary' : 'bg-surface-700'}`} />
                      <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${formData.published ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                      {formData.published ? 'Publicly Published' : 'Save as Draft'}
                    </span>
                  </label>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-900 rounded-lg border border-surface-700">
                    <TagIcon size={14} className="text-primary" />
                    <input 
                      type="text" 
                      placeholder="Tags (comma separated)"
                      className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-32"
                      value={formData.tags?.join(', ')}
                      onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(null)}
                    className="px-6 py-3 border border-surface-700 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-surface-700 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:glow-blue transition-all"
                  >
                    <Save size={18} /> {isEditing === 'new' ? 'Build Post' : 'Update Content'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {posts.length === 0 ? (
              <div className="text-center py-32 glass-card rounded-3xl border border-dashed border-surface-700">
                <div className="text-slate-600 mb-4 inline-block p-4 bg-surface-800 rounded-2xl"><PenTool size={32} /></div>
                <p className="text-slate-500">Your lab notebook is empty. Start a new project entry.</p>
              </div>
            ) : posts.map(post => (
              <div 
                key={post.id}
                className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-700 hover:border-surface-600 transition-all"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-white leading-tight">{post.title}</h4>
                    {post.published ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase">
                        <Eye size={10} /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-surface-900 px-2 py-0.5 rounded border border-surface-700 uppercase">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                    <span>CREATED: {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Pending...'}</span>
                    <span>TAGS: {post.tags?.join(', ') || 'None'}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => { setIsEditing(post.id); setFormData(post); }}
                    className="p-3 bg-surface-900 border border-surface-700 rounded-xl text-slate-400 hover:text-primary hover:border-primary group transition-all"
                    title="Edit Post"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-3 bg-surface-900 border border-surface-700 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 group transition-all"
                    title="Delete Post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function User(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
