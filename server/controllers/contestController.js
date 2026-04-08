import { Contest } from '../models/Contest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getContestStatus = (contest) => {
  const now = Date.now();
  if (now < new Date(contest.startTime).getTime()) return 'upcoming';
  if (now > new Date(contest.endTime).getTime()) return 'ended';
  return 'live';
};

export const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find().sort({ startTime: 1 });

  res.json(
    contests.map((contest) => ({
      ...contest.toObject(),
      status: getContestStatus(contest),
    }))
  );
});

export const getContestBySlug = asyncHandler(async (req, res) => {
  const contest = await Contest.findOne({ slug: req.params.slug }).populate(
    'problemIds',
    'title slug difficulty tags acceptedSubmissions totalSubmissions'
  );

  if (!contest) {
    res.status(404);
    throw new Error('Contest not found');
  }

  res.json({
    ...contest.toObject(),
    status: getContestStatus(contest),
  });
});
