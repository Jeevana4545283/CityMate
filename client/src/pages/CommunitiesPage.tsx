import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HeartHandshake,
  HelpCircle,
  Plus,
  MessageCircle,
  Users,
  Send,
  X
} from 'lucide-react';
import { ICommunity, IPost } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const CommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') === 'qa' ? 'qa' : 'communities';
  const [activeTab, setActiveTab] = useState<'communities' | 'qa'>(initialTab);

  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post / Question Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postType, setPostType] = useState<'Discussion' | 'Question'>('Question');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [commData, postData] = await Promise.all([
        api.getCommunities(),
        api.getPosts(activeTab === 'qa' ? 'Question' : undefined)
      ]);
      setCommunities(commData);
      setPosts(postData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (commId: string) => {
    try {
      const updated = await api.joinCommunity(commId);
      setCommunities(communities.map((c) => (c._id === commId ? updated : c)));
      showToast('Joined community group!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost = await api.createPost({
        type: postType,
        title: postTitle,
        content: postContent,
        city,
        area
      });
      setPosts([newPost, ...posts]);
      setIsPostModalOpen(false);
      setPostTitle('');
      setPostContent('');
      showToast(postType === 'Question' ? 'Question asked in Ask Your City forum!' : 'Discussion post published!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text) return;

    try {
      const updatedPost = await api.addComment(postId, text);
      setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
      setCommentInputs({ ...commentInputs, [postId]: '' });
      showToast('Answer / comment added!');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <HeartHandshake className="w-7 h-7 text-neutral-900" />
              <span>Communities & Ask Your City</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Join groups in <span className="text-neutral-900 font-semibold">{city}</span> or ask local questions answered by locals.
            </p>
          </div>

          <button
            onClick={() => {
              setPostType(activeTab === 'qa' ? 'Question' : 'Discussion');
              setIsPostModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'qa' ? 'Ask a Question' : 'Create New Post'}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-3 mb-8 border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'communities'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Local Communities ({communities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'qa'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask Your City Q&A</span>
          </button>
        </div>

        {/* TAB 1: COMMUNITIES GRID */}
        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((comm) => (
              <div key={comm._id} className="glass-card rounded-3xl overflow-hidden border border-neutral-200 flex flex-col justify-between group">
                <div>
                  <div className="h-40 relative">
                    <img src={comm.image} alt={comm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold text-neutral-900 border border-neutral-200">
                      {comm.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{comm.description}</p>

                    <div className="mt-4 flex items-center space-x-2 text-xs text-neutral-600">
                      <Users className="w-4 h-4 text-neutral-900" />
                      <span className="font-bold">{comm.members.length} Members</span>
                      <span className="text-neutral-400">• {comm.city} ({comm.area})</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => handleJoinCommunity(comm._id)}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                  >
                    Join Community Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ASK YOUR CITY Q&A FORUM */}
        {activeTab === 'qa' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {posts.map((post) => {
              const authorName = typeof post.author === 'object' ? post.author.name : 'Local User';
              const authorPhoto = typeof post.author === 'object' ? post.author.profilePhoto : '';

              return (
                <div key={post._id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={authorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{authorName}</div>
                        <div className="text-[11px] text-neutral-500">{post.area}, {post.city}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-[10px] font-bold">
                      {post.type}
                    </span>
                  </div>

                  {post.title && <h3 className="text-base font-extrabold text-neutral-900">{post.title}</h3>}
                  <p className="text-xs text-neutral-700 leading-relaxed">&quot;{post.content}&quot;</p>

                  {/* Answers & Comments */}
                  <div className="pt-4 border-t border-neutral-100 space-y-3">
                    <h4 className="text-xs font-bold text-neutral-500 flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5 text-neutral-900" />
                      <span>{post.comments.length} Local Answers</span>
                    </h4>

                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                        <div className="font-bold text-neutral-900 mb-0.5">{comment.authorName}</div>
                        <div className="text-neutral-700">{comment.content}</div>
                      </div>
                    ))}

                    {/* Add Comment / Answer Input */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a helpful local answer..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Post / Ask Question Modal */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2 mb-4">
                <HelpCircle className="w-5 h-5 text-neutral-900" />
                <span>{postType === 'Question' ? 'Ask Your City a Question' : 'Post to Community'}</span>
              </h3>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Title / Question Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Which area is best for affordable PGs near Gachibowli?"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide additional details so locals can give clear recommendations..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
