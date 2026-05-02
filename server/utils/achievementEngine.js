import { Achievement } from '../models/Achievement.js';
import { Submission } from '../models/Submission.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const checkAndAwardAchievements = async (userId) => {
  try {
    // 1. Fetch user's existing achievements to avoid re-awarding
    const existingAchievements = await Achievement.find({ user: userId }).select('type');
    const earnedTypes = new Set(existingAchievements.map(a => a.type));

    // 2. Fetch all accepted submissions for the user
    const acceptedSubmissions = await Submission.find({ 
      user: userId, 
      status: 'accepted' 
    }).sort({ createdAt: 1 });

    const newAchievements = [];
    const problemsSolvedSet = new Set(acceptedSubmissions.map(s => s.problem.toString()));
    const problemsSolvedCount = problemsSolvedSet.size;

    // --- RULE 1: Solve first problem ---
    if (problemsSolvedCount >= 1 && !earnedTypes.has('first_problem')) {
      newAchievements.push({
        user: userId,
        type: 'first_problem',
        title: 'Getting Started',
        description: 'Solved your very first problem on the platform.',
      });
    }

    // --- RULE 2: 50 problems ---
    if (problemsSolvedCount >= 50 && !earnedTypes.has('50_problems')) {
      newAchievements.push({
        user: userId,
        type: '50_problems',
        title: 'Consistency',
        description: 'Solved 50 distinct problems.',
      });
    }

    // --- RULE 3: 100 problems ---
    if (problemsSolvedCount >= 100 && !earnedTypes.has('100_problems')) {
      newAchievements.push({
        user: userId,
        type: '100_problems',
        title: 'Algorithm Master',
        description: 'Solved 100 distinct problems.',
      });
    }

    // --- RULE 4: 7-day streak ---
    if (!earnedTypes.has('7_day_streak')) {
      // Calculate max streak
      const activeDates = new Set(
        acceptedSubmissions.map(s => s.createdAt.toISOString().split('T')[0])
      );
      
      const sortedDates = Array.from(activeDates).sort();
      let maxStreak = 0;
      let currentStreak = 0;
      let previousDate = null;

      for (const dateStr of sortedDates) {
        const currentDate = new Date(dateStr);
        if (!previousDate) {
          currentStreak = 1;
        } else {
          const diffTime = Math.abs(currentDate - previousDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        }
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
        previousDate = currentDate;
      }

      if (maxStreak >= 7) {
        newAchievements.push({
          user: userId,
          type: '7_day_streak',
          title: 'Streak Starter',
          description: 'Solved at least one problem for 7 consecutive days.',
        });
      }
    }

    // Insert any new achievements
    if (newAchievements.length > 0) {
      await Achievement.insertMany(newAchievements);
      
      const notifications = newAchievements.map(ach => ({
        user: userId,
        type: 'achievement_unlocked',
        title: 'Achievement Unlocked 🏆',
        message: ach.title,
        link: '/profile',
      }));
      await Notification.insertMany(notifications);
    }

    // Always update the User's `problemsSolved` count accurately
    await User.findByIdAndUpdate(userId, { problemsSolved: problemsSolvedCount });

  } catch (error) {
    console.error('Achievement Engine Error:', error);
  }
};
