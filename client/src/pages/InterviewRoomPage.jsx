import { Link, useParams } from 'react-router-dom';

const InterviewRoomPage = () => {
  const { roomId } = useParams();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
        <p className="text-sm text-slate-400">Interview Room</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Room ID: {roomId}</h1>
        <p className="mt-4 text-slate-300">
          Realtime interview room is scaffolded. You can continue using the LeetCode clone module
          from the dashboard.
        </p>
        <Link
          to="/problems"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          Go to Problems
        </Link>
      </div>
    </div>
  );
};

export default InterviewRoomPage;
