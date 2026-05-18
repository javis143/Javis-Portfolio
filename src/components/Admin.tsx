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
  loginWithEmail,
  registerWithEmail,
  logout,
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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
  EyeOff,
  Mail,
  Key
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
  const [user, setUser] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email] = useState('chimangwejavis1@gmail.com');
  const [password, setPassword] = useState('');
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
    // We check for a local session
    const saved = localStorage.getItem('admin_session');
    if (saved === 'true') {
      setUser({ email: ADMIN_EMAIL, uid: 'hardcoded-admin' });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setUser(null);
  };

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
          <h2 className="text-2xl font-display font-bold mb-4 text-white">
            Administrator Access
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Enter your secure administrative passcode to manage the Lab Notebook.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setLoginError(null);
              // SECURITY NOTE: This is hardcoded as requested by the user.
              // In a real production app, use secured backend authentication.
              if (password === 'javis2025') {
                setUser({ email: ADMIN_EMAIL, uid: 'hardcoded-admin' });
                localStorage.setItem('admin_session', 'true');
              } else {
                setLoginError("Invalid administrative passcode. Please try again.");
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  readOnly
                  type="email" 
                  value={email}
                  className="w-full bg-surface-900/50 border border-surface-700 rounded-xl pl-12 pr-4 py-3 text-slate-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1">Secure Passcode</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  autoFocus
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-left">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:glow-blue transition-all"
            >
              Verify & Enter
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-800">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">Encrypted Session Access</p>
          </div>
          
          {user && user.email !== ADMIN_EMAIL && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              Current Session Issues
              <button onClick={handleLogout} className="ml-2 underline font-bold uppercase">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-32 pb-20 px-6 font-sans">
      <SEO title="Blog Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Blog Dashboard</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><User size={12} className="text-primary"/> {user.email}</span>
              <button onClick={handleLogout} className="text-red-400 hover:underline flex items-center gap-1 uppercase font-bold tracking-tighter">
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-4">
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
