import { Submission } from '../models/Submission.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyCodingStats = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id }).select(
    'status runtimeMs problem createdAt'
  );

  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter((item) => item.status === 'accepted').length;
  const solvedProblemIds = new Set(
    submissions.filter((item) => item.status === 'accepted').map((item) => item.problem.toString())
  );

  const avgRuntimeMs = totalSubmissions
    ? Math.round(submissions.reduce((acc, item) => acc + (item.runtimeMs || 0), 0) / totalSubmissions)
    : 0;

  const recentActivity = submissions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((item) => ({
      _id: item._id,
      status: item.status,
      runtimeMs: item.runtimeMs,
      createdAt: item.createdAt,
    }));

  res.json({
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate: totalSubmissions
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0,
    solvedProblems: solvedProblemIds.size,
    avgRuntimeMs,
    recentActivity,
  });
});

export const getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Submission.aggregate([
    {
      $group: {
        _id: '$user',
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: {
            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0],
          },
        },
        avgRuntimeMs: { $avg: '$runtimeMs' },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$acceptedSubmissions', 10] },
            { $multiply: ['$totalSubmissions', 2] },
          ],
        },
      },
    },
    { $sort: { score: -1, acceptedSubmissions: -1, avgRuntimeMs: 1 } },
    { $limit: 50 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        totalSubmissions: 1,
        acceptedSubmissions: 1,
        acceptanceRate: {
          $round: [
            {
              $multiply: [
                {
                  $cond: [
                    { $eq: ['$totalSubmissions', 0] },
                    0,
                    { $divide: ['$acceptedSubmissions', '$totalSubmissions'] },
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },
        avgRuntimeMs: { $round: ['$avgRuntimeMs', 0] },
        score: 1,
      },
    },
  ]);

  res.json(leaderboard);
});

export const getUserLoginInsights = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email createdAt lastLoginAt loginCount')
    .sort({ createdAt: -1 });

  const totalUsers = users.length;
  const loggedInAtLeastOnce = users.filter((user) => (user.loginCount || 0) > 0).length;

  res.json({
    totalUsers,
    loggedInAtLeastOnce,
    users,
  });
});
