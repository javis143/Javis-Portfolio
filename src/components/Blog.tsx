import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User, ChevronRight } from 'lucide-react';
import { SEO } from './SEO';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: any;
  authorName: string;
  tags?: string[];
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'blog_posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'blog_posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (selectedPost) {
    return (
      <article className="min-h-screen bg-surface-900 pt-32 pb-20 px-6">
        <SEO 
          title={selectedPost.title} 
          description={selectedPost.excerpt || selectedPost.content.substring(0, 160)} 
        />
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setSelectedPost(null)}
            className="text-primary text-sm font-bold flex items-center gap-2 mb-8 hover:underline"
          >
            ← Back to Blog
          </button>
          
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {selectedPost.createdAt?.toDate ? format(selectedPost.createdAt.toDate(), 'MMMM dd, yyyy') : 'Loading...'}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                {selectedPost.authorName || 'Javis'}
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-blue max-w-none prose-p:text-slate-400 prose-headings:text-white prose-a:text-primary">
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="min-h-screen bg-surface-900 pt-32 pb-20 px-6">
      <SEO title="Blog" description="Latest insights on embedded systems, IoT, and renewable energy by Chimangwe Javis." />
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Tech Insights</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Exploring the intersection of hardware, software, and sustainable innovation.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-surface-800 rounded-3xl border border-surface-700">
            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl flex flex-col h-full border border-surface-700 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="text-xs font-mono text-primary uppercase tracking-widest mb-4">
                  {post.tags?.[0] || 'Uncategorized'}
                </div>
                <h3 className="text-xl font-display font-bold mb-4 line-clamp-2 leading-tight flex-grow">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                  {post.excerpt || post.content.substring(0, 120) + '...'}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-surface-700/50">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    {post.createdAt?.toDate ? format(post.createdAt.toDate(), 'MMM d, yyyy') : 'Loading...'}
                  </span>
                  <div className="text-primary flex items-center gap-1 text-xs font-bold uppercase">
                    Read More <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
