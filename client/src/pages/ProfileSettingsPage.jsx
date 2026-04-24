import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const MAX_AVATAR_SIZE = 200 * 1024; // 200KB

const PROFILE_FIELDS = ['fullName', 'gender', 'location', 'birthday', 'websites', 'github', 'linkedin', 'x', 'readme', 'work', 'education', 'skills', 'avatarUrl'];

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // File input ref for avatar
  const fileInputRef = useRef(null);

  // Profile completion
  const profile = user?.profile || {};
  const filledCount = PROFILE_FIELDS.filter(f => profile[f]).length;
  const completionPercent = Math.round((filledCount / PROFILE_FIELDS.length) * 100);

  const handleEditClick = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setUploadError('');
    setEditValue(currentValue || '');
  };

  const handleCloseModal = () => {
    setEditingField(null);
    setEditValue('');
    setUploadError('');
  };

  const handleSaveModal = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateProfile({ [editingField]: editValue });
      setEditingField(null);
    } catch (err) {
      console.error('Failed to update profile field', err);
      alert('Failed to update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setUploadError(`Image too large. Max size: ${MAX_AVATAR_SIZE / 1024}KB. Try a smaller image.`);
      return;
    }

    setUploadError('');
    setIsUpdating(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        setEditValue(base64);
        try {
          await updateProfile({ avatarUrl: base64 });
          setEditingField(null);
        } catch (err) {
          console.error('Failed to upload avatar', err);
          setUploadError('Failed to save avatar. Please try again.');
        } finally {
          setIsUpdating(false);
        }
      };
      reader.onerror = () => {
        setUploadError('Failed to read file. Please try again.');
        setIsUpdating(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUpdating(false);
      setUploadError('Unexpected error. Please try again.');
    }
  };

  const removeAvatar = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({ avatarUrl: '' });
      setEditingField(null);
    } catch (err) {
      console.error('Failed to remove avatar', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  // Get field label for modal title
  const getFieldLabel = (key) => {
    const labels = {
      name: 'Display Name', fullName: 'Full Legal Name', gender: 'Gender',
      location: 'Location', birthday: 'Birthday', websites: 'Website',
      github: 'GitHub', linkedin: 'LinkedIn', x: 'X / Twitter',
      readme: 'About Me', work: 'Work', education: 'Education',
      skills: 'Skills', avatarUrl: 'Profile Photo',
    };
    return labels[key] || key;
  };

  // Get field placeholder
  const getFieldPlaceholder = (key) => {
    const placeholders = {
      name: 'Enter your display name', fullName: 'Enter your full legal name',
      location: 'e.g. Mumbai, India', birthday: '',
      websites: 'https://your-website.com', github: 'https://github.com/username',
      linkedin: 'https://linkedin.com/in/username', x: 'https://x.com/username',
      readme: 'Write a short bio about yourself...', work: 'e.g. Software Engineer at Google',
      education: 'e.g. B.Tech CSE, IIT Delhi', skills: 'e.g. React, Node.js, Python',
    };
    return placeholders[key] || `Enter your ${key}`;
  };

  // Detect current location via GPS
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.county || '';
          const state = addr.state || '';
          const country = addr.country || '';
          const parts = [city, state, country].filter(Boolean);
          setEditValue(parts.join(', '));
        } catch {
          setLocationError('Could not determine your location. Please type it manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) {
          setLocationError('Location access denied. Please enable it in your browser settings, or type manually.');
        } else {
          setLocationError('Could not get location. Please type it manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Get field description for modal
  const getFieldDescription = (key) => {
    const descriptions = {
      name: 'This is how other developers will see you on the platform.',
      fullName: 'Your legal name for certificates and verification.',
      gender: 'Select your gender identity.',
      location: 'Detect your location automatically or type it manually.',
      birthday: 'Select your date of birth from the calendar.',
      websites: 'Your personal website or portfolio URL.',
      github: 'Link your GitHub profile to showcase your work.',
      linkedin: 'Connect your LinkedIn for professional networking.',
      x: 'Add your X (formerly Twitter) profile.',
      readme: 'A short bio that appears on your profile. Tell others about yourself.',
      work: 'Your current company or job title.',
      education: 'Your educational background.',
      skills: 'Comma-separated list of your technical skills.'
    };
    return descriptions[key] || '';
  };

  // Get field icon for modal
  const getFieldIcon = (key) => {
    const icons = {
      name: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
      fullName: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      gender: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      location: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      birthday: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      work: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      education: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
      skills: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    };
    return icons[key] || <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
  };

  const renderSettingRow = (icon, label, fieldKey, fallbackValue) => {
    const currentValue = fieldKey === 'name' ? user?.name : user?.profile?.[fieldKey];
    const displayValue = currentValue || fallbackValue;
    const isFilled = Boolean(currentValue);

    return (
      <div 
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-indigo-500/10 h-full flex flex-col"
        onClick={() => handleEditClick(fieldKey, currentValue)}
      >
        <div className="absolute top-4 right-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-indigo-400 translate-y-1 group-hover:translate-y-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </div>
        
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
            {icon}
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1 pr-6">
            <h3 className="text-sm font-bold text-slate-200">{label}</h3>
            {displayValue ? (
               <p className={`text-[13px] leading-relaxed truncate ${isFilled ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 italic'}`}>
                 {fieldKey === 'birthday' && currentValue ? new Date(currentValue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : displayValue}
               </p>
            ) : null}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 border-t border-slate-800/50 pt-3">
          {isFilled ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">Completed</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">Action Required</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center pb-20 relative">
      <div className="w-full max-w-[1020px] flex flex-col pt-4">
        
        {/* TOP BAR */}
        <header className="flex items-center justify-between px-6 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg mb-8 mx-6 backdrop-blur-xl">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5 text-sm font-semibold group">
             <svg className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Dashboard
          </Link>
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950/80 text-slate-200 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors w-[240px]"
                />
             </div>
             
             <button onClick={toggleTheme} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-xl hover:bg-slate-700 border border-slate-700/30">
                {theme === 'dark' ? (
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
             </button>
             
             <div className="h-9 w-9 rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-sm cursor-pointer hover:border-indigo-500 transition-colors">
               {user?.profile?.avatarUrl ? (
                 <img src={user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                   {user?.name?.charAt(0).toUpperCase() || 'U'}
                 </div>
               )}
             </div>
          </div>
        </header>

        {/* PROFILE HERO SECTION */}
        <div className="mx-6 mb-10 relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Gradient Cover */}
          <div className="h-36 sm:h-44 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-brand-600 to-purple-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
          
          <div className="px-6 sm:px-8 pb-8 pt-4 flex flex-col items-center text-center relative z-10">
            {/* Avatar — centered over gradient border */}
            <div className="-mt-20 mb-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => handleEditClick('avatarUrl', user?.profile?.avatarUrl)}
              >
                <div className="h-32 w-32 rounded-[2rem] bg-slate-900 p-1.5 shadow-2xl transition-transform group-hover:scale-105 mx-auto relative group">
                   {/* Animated border glow */}
                   <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-500 animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="h-full w-full rounded-[1.6rem] bg-slate-800 flex items-center justify-center overflow-hidden relative z-10">
                     {user?.profile?.avatarUrl ? (
                       <img src={user.profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                         <span className="text-4xl font-black tracking-tighter">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                       </div>
                     )}
                   </div>
                   
                   {/* Online indicator */}
                   <div className="absolute top-2 right-2 h-[18px] w-[18px] rounded-full bg-emerald-500 border-2 border-slate-900 z-20 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                   
                   {/* Hover overlay */}
                   <div className="absolute inset-1.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.6rem] flex flex-col items-center justify-center backdrop-blur-sm z-30">
                     <svg className="h-7 w-7 text-white mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     <span className="text-[11px] font-black text-white tracking-widest uppercase">Change</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{user?.name || 'Developer'}</h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400 mb-6 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {user?.email}
                </span>
                {memberSince && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Joined {memberSince}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Profile completion bar */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 px-5 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300">Profile Completion</span>
                <span className={`text-sm font-bold ${completionPercent >= 80 ? 'text-emerald-400' : completionPercent >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {completionPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${completionPercent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : completionPercent >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'}`}
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{filledCount} of {PROFILE_FIELDS.length} fields completed</p>
            </div>
          </div>
        </div>

        {/* SETTINGS LIST */}
        <div className="px-6 flex flex-col gap-10 max-w-[840px] mx-auto w-full">
      {/* ====== PREMIUM EDIT MODAL ====== */}
      {editingField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={handleCloseModal}>
          <div 
            className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-800/95 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            {/* Subtle gradient top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500" />
            
            {/* Close button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-700/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {getFieldIcon(editingField)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{getFieldLabel(editingField)}</h3>
                  {getFieldDescription(editingField) && (
                    <p className="text-xs text-slate-400 mt-0.5">{getFieldDescription(editingField)}</p>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="mt-5">
                {editingField === 'avatarUrl' ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* Preview */}
                    <div className="h-28 w-28 rounded-2xl bg-slate-900 border-2 border-slate-700/50 overflow-hidden flex items-center justify-center shadow-lg">
                      {(editValue || user?.profile?.avatarUrl) ? (
                        <img src={editValue || user.profile.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                      )}
                    </div>

                    {uploadError && (
                      <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 w-full">
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        {uploadError}
                      </div>
                    )}

                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarFileChange} className="hidden" />
                    <div className="flex gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUpdating}
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {isUpdating ? 'Uploading...' : 'Choose Photo'}
                      </button>
                      {user?.profile?.avatarUrl && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          disabled={isUpdating}
                          className="rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50 border border-rose-500/20"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">JPG, PNG, GIF, WebP — Max 200KB</p>
                  </div>
                ) : editingField === 'gender' ? (
                  <div className="space-y-2">
                    {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
                          editValue === option 
                            ? 'border-indigo-500/50 bg-indigo-500/10 text-white' 
                            : 'border-slate-700/30 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition ${
                          editValue === option ? 'border-indigo-500' : 'border-slate-600'
                        }`}>
                          {editValue === option && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                        </div>
                        <span className="text-sm font-medium">{option}</span>
                        <input type="radio" name="gender" value={option} checked={editValue === option} onChange={(e) => setEditValue(e.target.value)} className="hidden" />
                      </label>
                    ))}
                  </div>
                ) : editingField === 'birthday' ? (
                  <div>
                    <input 
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      min="1940-01-01"
                      className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    />
                    {editValue && (
                      <p className="mt-2 text-xs text-slate-400">
                        Selected: {new Date(editValue).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                ) : editingField === 'readme' ? (
                  <textarea 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    rows={4}
                    className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500 transition-all resize-none"
                    placeholder={getFieldPlaceholder(editingField)}
                  />
                ) : editingField === 'location' ? (
                  <div className="space-y-3">
                    {/* Use my location button */}
                    <button
                      type="button"
                      onClick={detectCurrentLocation}
                      disabled={locationLoading}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-60"
                    >
                      {locationLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Detecting your location...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Use My Current Location
                        </>
                      )}
                    </button>

                    {locationError && (
                      <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        {locationError}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-700/50" />
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">or type manually</span>
                      <div className="h-px flex-1 bg-slate-700/50" />
                    </div>

                    <input 
                      type="text"
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500 transition-all"
                      placeholder="e.g. Mumbai, Maharashtra, India"
                    />
                    {editValue && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {editValue}
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type={['github', 'linkedin', 'x', 'websites'].includes(editingField) ? 'url' : 'text'} 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500 transition-all"
                    placeholder={getFieldPlaceholder(editingField)}
                  />
                )}
              </div>

              {/* Modal Footer */}
              {editingField !== 'avatarUrl' && (
                <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-700/30">
                  <button 
                    onClick={handleCloseModal}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveModal}
                    disabled={isUpdating}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 shadow-md shadow-indigo-500/20"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettingsPage;
