const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="glass w-full max-w-sm rounded-2xl p-8 text-center shadow-card">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
