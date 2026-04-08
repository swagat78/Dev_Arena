import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const MOCK_LOCATIONS = {
  India: {
    Odisha: ['Jeypore', 'Bhubaneswar', 'Cuttack'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  },
  USA: {
    California: ['Los Angeles', 'San Francisco'],
    Texas: ['Austin', 'Houston'],
  }
};

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // For cascading location
  const [locCountry, setLocCountry] = useState('India');
  const [locState, setLocState] = useState('Odisha');
  const [locCity, setLocCity] = useState('Jeypore');
  const [showCountrySearch, setShowCountrySearch] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const handleEditClick = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    if (fieldKey === 'location') {
      const parts = (currentValue || 'India, Odisha, Jeypore').split(', ').map(s => s.trim());
      setLocCountry(parts[0] || 'India');
      setLocState(parts[1] || 'Odisha');
      setLocCity(parts[2] || 'Jeypore');
    } else {
      setEditValue(currentValue || '');
    }
  };

  const handleCloseModal = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveModal = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      let finalValue = editValue;
      if (editingField === 'location') {
        finalValue = `${locCountry}, ${locState}, ${locCity}`;
      }
      await updateProfile({ [editingField]: finalValue });
      setEditingField(null);
    } catch (err) {
      console.error('Failed to update profile field', err);
      alert('Failed to update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderSettingRow = (icon, label, fieldKey, fallbackValue) => {
    const currentValue = fieldKey === 'name' ? user?.name : user?.profile?.[fieldKey];
    const displayValue = currentValue || fallbackValue;

    return (
      <div 
        className="group flex cursor-pointer items-center justify-between w-full border-b border-slate-800/80 px-6 py-4 last:border-b-0 hover:bg-slate-800/30 transition-colors min-h-[72px]"
        onClick={() => handleEditClick(fieldKey, currentValue)}
      >
        <div className="flex items-center gap-5">
          <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">{icon}</div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="text-[15px] font-semibold text-slate-200">{label}</span>
            {displayValue && <span className="text-[13.5px] text-slate-400 font-medium">{displayValue}</span>}
          </div>
        </div>
        <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center pb-20 relative">
      <div className="w-full max-w-[1020px] flex flex-col pt-4">
        
        {/* TOP BAR / HEADER representing Photo 2 Header */}
        <header className="flex items-center justify-between px-6 py-4 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl mb-10 mx-6">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Dashboard
          </Link>
          <div className="flex items-center gap-5">
             <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 text-slate-200 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors w-[260px] shadow-inner"
                />
             </div>
             
             <button onClick={toggleTheme} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2.5 rounded-full hover:bg-slate-700">
                {theme === 'dark' ? (
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
             </button>
             
             <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-700 shadow-sm cursor-pointer hover:border-indigo-500 transition-colors">
               {user?.profile?.avatarUrl ? (
                 <img src={user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                   {user?.name?.charAt(0).toUpperCase() || 'U'}
                 </div>
               )}
             </div>
          </div>
        </header>

        {/* PROFILE AVATAR BLOCK */}
        <div className="flex justify-center mb-12">
          <div className="relative group cursor-pointer rounded-3xl" onClick={() => handleEditClick('avatarUrl', user?.profile?.avatarUrl)}>
            <div className="h-36 w-36 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
               {user?.profile?.avatarUrl ? (
                 <img src={user.profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full w-full bg-slate-800 text-slate-500">
                   <svg className="h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                 </div>
               )}
            </div>
            {/* Edit Avatar Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm border border-slate-700">
               <svg className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               <span className="text-xs font-bold text-white tracking-wide">Edit Avatar</span>
            </div>
          </div>
        </div>

        {/* SETTINGS LIST */}
        <div className="px-6 flex flex-col gap-10 max-w-[840px] mx-auto w-full">
          
          <section>
             <h2 className="text-lg font-bold text-slate-100 tracking-wide">General</h2>
             <p className="text-sm text-slate-400 mb-4 mt-1">Manage your basic profile information.</p>
             <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
                {renderSettingRow(<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>, "Display Name", "name", "Not set")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, "Full Legal Name", "fullName", "")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>, "Gender", "gender", "Not set")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, "Location", "location", "Not set")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, "Birthday", "birthday", "Not set")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, "Websites", "websites", "Add a link")}
                {renderSettingRow(<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>, "Github", "github", "Add GitHub URL")}
                {renderSettingRow(<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, "LinkedIn", "linkedin", "Add LinkedIn URL")}
                {renderSettingRow(<span className="font-bold text-[16px]">𝕏</span>, "X / Twitter", "x", "Add X URL")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, "ReadMe", "readme", "Write a short intro")}
             </div>
          </section>

          <section className="mb-12">
             <h2 className="text-lg font-bold text-slate-100 tracking-wide">Experience</h2>
             <p className="text-sm text-slate-400 mb-4 mt-1">Share your growth from learning to career.</p>
             <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, "Work", "work", "Add company")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>, "Education", "education", "Add school or university")}
                {renderSettingRow(<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, "Skills", "skills", "List your top skills")}
             </div>
          </section>

        </div>
      </div>

      {/* POPUP MODAL ENHANCEMENT */}
      {editingField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition bg-slate-900 rounded-full p-1"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="flex items-center gap-2 text-indigo-400 mb-6">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <h3 className="text-xl font-bold text-white tracking-wide">
                Update {editingField.charAt(0).toUpperCase() + editingField.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>

            <div className="mb-8">
              {editingField === 'gender' ? (
                <div className="relative">
                  <select 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-600 bg-slate-900 px-5 py-3.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Not Prefer to say">Not Prefer to say</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              ) : editingField === 'location' ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
                  <div className="relative flex-1">
                     <select value={locCountry} onChange={(e) => setLocCountry(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                       {Object.keys(MOCK_LOCATIONS).map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                  </div>
                  <div className="relative flex-1">
                     <select value={locState} onChange={(e) => setLocState(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                       {locCountry && Object.keys(MOCK_LOCATIONS[locCountry] || {}).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                  </div>
                  <div className="relative flex-1">
                     <select value={locCity} onChange={(e) => setLocCity(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                       {locState && (MOCK_LOCATIONS[locCountry]?.[locState] || []).map(city => <option key={city} value={city}>{city}</option>)}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                  </div>
                </div>
              ) : (
                <input 
                  type={['github', 'linkedin', 'x', 'websites', 'avatarUrl'].includes(editingField) ? 'url' : 'text'} 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  className="w-full rounded-2xl border border-slate-600 bg-slate-900 px-5 py-3.5 text-sm text-white shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                  placeholder={['github', 'linkedin', 'x', 'websites'].includes(editingField) ? `https://...` : `Enter your ${editingField}...`}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={handleCloseModal}
                className="rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-600 shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveModal}
                disabled={isUpdating}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-500/30"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsPage;
