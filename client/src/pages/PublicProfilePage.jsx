import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi, submissionApi } from '../services/api';
import { Card, Badge, Button, ActivityHeatmap } from '../components/ui';

const PublicProfilePage = () => {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, submissionsRes] = await Promise.all([
          userApi.getProfile(token),
          submissionApi.getRecent(token)
        ]);
        setProfileData(profileRes);
        setRecentSubmissions(submissionsRes || []);
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
        <p className="text-slate-400 mb-6">{error || "Could not load the requested profile."}</p>
        <Link to="/dashboard">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const { name, username, email, bio, avatar, github, linkedin, problemsSolved, rank, acceptanceRate, activityHeatmap, achievements } = profileData;

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'first_problem': return <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>;
      case '50_problems': return <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>;
      case '100_problems': return <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;
      case '7_day_streak': return <svg className="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 12.5c0 3.03-2.47 5.5-5.5 5.5s-5.5-2.47-5.5-5.5c0-1.84.92-3.48 2.33-4.48L12 5.5l3.17 2.52c1.41 1 2.33 2.64 2.33 4.48zM12 2l-1.42 1.42C8.61 5.38 7.37 7.79 7.37 10.5c0 2.55 2.07 4.62 4.63 4.62s4.63-2.07 4.63-4.62c0-2.71-1.24-5.12-3.21-7.08L12 2z"/></svg>;
      default: return <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>;
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const getVerdictBadge = (status, label) => {
    switch(status) {
      case 'accepted': return <Badge variant="success">{label}</Badge>;
      case 'wrong_answer': return <Badge variant="error">{label}</Badge>;
      case 'time_limit_exceeded': return <Badge variant="warning">TLE</Badge>;
      default: return <Badge variant="default">{label}</Badge>;
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'hard': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validGithub = github && isValidUrl(github) ? github : null;
  const validLinkedin = linkedin && isValidUrl(linkedin) ? linkedin : null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Info */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <Card className="flex flex-col items-center text-center p-8 border-t-4 border-t-brand-500">
            <div className="relative mb-6">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-xl shadow-brand-500/10">
                {avatar ? (
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-purple-600 text-4xl font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white tracking-tight">{name}</h1>
            <p className="text-brand-400 font-medium mb-1">@{username}</p>
            <p className="text-slate-400 text-sm mb-6">{email}</p>

            <Link to="/settings" className="w-full mb-6">
              <Button variant="secondary" className="w-full shadow-sm">Edit Profile</Button>
            </Link>

            <div className="w-full flex justify-center gap-3">
              {validGithub && (
                <a href={validGithub} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-brand-500 hover:-translate-y-1 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              )}
              {validLinkedin && (
                <a href={validLinkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-brand-500 hover:-translate-y-1 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Content - Stats & Bio */}
        <div className="md:w-2/3 flex flex-col gap-6">
          <Card hoverable className="p-0 overflow-hidden">
            <div className="bg-slate-800/50 p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Platform Stats
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-800/50">
              <div className="bg-[#111827] p-6 text-center">
                <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Rank</p>
                <div className="text-3xl font-bold text-white mb-2">{rank}</div>
                <Badge variant="gradient">Global</Badge>
              </div>
              
              <div className="bg-[#111827] p-6 text-center">
                <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Solved</p>
                <div className="text-3xl font-bold text-brand-400 mb-2">{problemsSolved}</div>
                <Badge variant="success">Problems</Badge>
              </div>

              <div className="bg-[#111827] p-6 text-center">
                <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Acceptance</p>
                <div className="text-3xl font-bold text-emerald-400 mb-2">{acceptanceRate}%</div>
                <Badge variant="info">Average</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
            {(!achievements || achievements.length === 0) ? (
              <p className="text-slate-400 text-center py-6">No achievements earned yet. Start solving problems!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <div key={ach.type} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-brand-500/50 transition-colors">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-900 text-brand-400 flex items-center justify-center border border-brand-500/30 shadow-[0_0_15px_rgba(79,124,255,0.15)]">
                      {getAchievementIcon(ach.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{ach.title}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Submission Activity</h2>
            <ActivityHeatmap data={activityHeatmap || []} />
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Recent Submissions</h2>
            {recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-slate-400 mb-4">No submissions.</p>
                <Link to="/problems">
                  <Button variant="primary">Start solving problems</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div className="flex flex-col gap-1">
                      <Link to={`/problems/${sub.problem?.slug}`} className="text-white font-medium hover:text-brand-400 transition-colors">
                        {sub.problem?.title || 'Unknown Problem'}
                      </Link>
                      <span className={`text-xs font-semibold ${getDifficultyColor(sub.problem?.difficulty)}`}>
                        {sub.problem?.difficulty || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getVerdictBadge(sub.status, sub.verdictLabel)}
                      <span className="text-xs text-slate-500">{timeAgo(sub.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default PublicProfilePage;
