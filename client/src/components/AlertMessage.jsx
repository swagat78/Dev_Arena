const STYLE_MAP = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-200',
  info: 'border-sky-500/50 bg-sky-500/10 text-sky-200',
};

const AlertMessage = ({ type = 'info', message }) => {
  if (!message) return null;

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${STYLE_MAP[type] || STYLE_MAP.info}`}>
      {message}
    </div>
  );
};

export default AlertMessage;
