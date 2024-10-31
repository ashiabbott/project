import firebase from 'firebase/app';
import 'firebase/firestore';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface UserAchievement {
  userId: string;
  achievementId: string;
  dateEarned: firebase.firestore.Timestamp;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointCost: number;
}

const achievements: Achievement[] = [
  {
    id: 'save-first-100',
    name: 'First $100 Saved',
    description: 'Save your first $100',
    points: 50,
  },
  {
    id: 'budget-streak-30',
    name: 'Budget Master',
    description: 'Stick to your budget for 30 days straight',
    points: 100,
  },
  {
    id: 'investment-starter',
    name: 'Investment Starter',
    description: 'Make your first investment',
    points: 75,
  },
  {
    id: 'goal-achiever',
    name: 'Goal Achiever',
    description: 'Achieve a financial goal',
    points: 150,
  },
  {
    id: 'consistent-saver-7',
    name: 'Consistent Saver',
    description: 'Save money for 7 consecutive days',
    points: 80,
  },
  {
    id: 'big-saver-1000',
    name: 'Big Saver',
    description: 'Accumulate $1,000 in savings',
    points: 200,
  },
  {
    id: 'budget-streak-90',
    name: 'Budget Guru',
    description: 'Stick to your budget for 90 days straight',
    points: 300,
  },
  // Additional achievements can be added here
];

const rewards: Reward[] = [
  {
    id: 'premium-1-month',
    name: '1 Month Premium',
    description: 'Access premium features for 1 month',
    pointCost: 500,
  },
  {
    id: 'financial-consultation',
    name: 'Expert Consultation',
    description: '30-minute consultation with a financial expert',
    pointCost: 1000,
  },
  {
    id: 'gift-card-50',
    name: '$50 Gift Card',
    description: 'Receive a $50 gift card',
    pointCost: 1500,
  },
  {
    id: 'premium-12-month',
    name: '1 Year Premium',
    description: 'Access premium features for 1 year',
    pointCost: 5000,
  },
  // Additional rewards can be added here
];

/**
 * Checks for new achievements for a user.
 * @param userId - The user's ID.
 * @returns A promise that resolves to an array of newly earned achievements.
 */
export const checkAchievements = async (
  userId: string,
): Promise<Achievement[]> => {
  const newAchievements: Achievement[] = [];

  try {
    // Get user's total savings
    const savingsSnapshot = await firebase
      .firestore()
      .collection('accounts')
      .where('userId', '==', userId)
      .where('type', '==', 'savings')
      .get();

    const totalSavings = savingsSnapshot.docs.reduce(
      (total, doc) => total + doc.data().balance,
      0,
    );

    // Check for 'save-first-100' achievement
    if (totalSavings >= 100) {
      const achievement = achievements.find(a => a.id === 'save-first-100');
      if (achievement) {
        await awardAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    // Check for 'big-saver-1000' achievement
    if (totalSavings >= 1000) {
      const achievement = achievements.find(a => a.id === 'big-saver-1000');
      if (achievement) {
        await awardAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    // Check for 'investment-starter' achievement
    const investmentsSnapshot = await firebase
      .firestore()
      .collection('investments')
      .where('userId', '==', userId)
      .get();

    if (!investmentsSnapshot.empty) {
      const achievement = achievements.find(a => a.id === 'investment-starter');
      if (achievement) {
        await awardAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    // Check for 'goal-achiever' achievement
    const goalsSnapshot = await firebase
      .firestore()
      .collection('goals')
      .where('userId', '==', userId)
      .where('isAchieved', '==', true)
      .get();

    if (!goalsSnapshot.empty) {
      const achievement = achievements.find(a => a.id === 'goal-achiever');
      if (achievement) {
        await awardAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    // Check for 'consistent-saver-7' achievement
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const savingsTransactionsSnapshot = await firebase
      .firestore()
      .collection('transactions')
      .where('userId', '==', userId)
      .where('type', '==', 'savings')
      .where('date', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
      .get();

    const datesSaved = new Set<string>();
    savingsTransactionsSnapshot.docs.forEach(doc => {
      const date = doc.data().date.toDate().toDateString();
      datesSaved.add(date);
    });

    if (datesSaved.size >= 7) {
      const achievement = achievements.find(a => a.id === 'consistent-saver-7');
      if (achievement) {
        await awardAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    // Check for 'budget-streak-30' and 'budget-streak-90' achievements
    const budgetStreaksSnapshot = await firebase
      .firestore()
      .collection('budgetStreaks')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!budgetStreaksSnapshot.empty) {
      const streakData = budgetStreaksSnapshot.docs[0].data();

      if (streakData.streakLength >= 30) {
        const achievement = achievements.find(a => a.id === 'budget-streak-30');
        if (achievement) {
          await awardAchievement(userId, achievement.id);
          newAchievements.push(achievement);
        }
      }

      if (streakData.streakLength >= 90) {
        const achievement = achievements.find(a => a.id === 'budget-streak-90');
        if (achievement) {
          await awardAchievement(userId, achievement.id);
          newAchievements.push(achievement);
        }
      }
    }

    // Additional achievement checks can be added here
  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  return newAchievements;
};

/**
 * Awards an achievement to a user.
 * @param userId - The user's ID.
 * @param achievementId - The achievement's ID.
 */
export const awardAchievement = async (
  userId: string,
  achievementId: string,
): Promise<void> => {
  try {
    const existing = await firebase
      .firestore()
      .collection('userAchievements')
      .where('userId', '==', userId)
      .where('achievementId', '==', achievementId)
      .get();

    if (existing.empty) {
      await firebase.firestore().collection('userAchievements').add({
        userId,
        achievementId,
        dateEarned: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error awarding achievement:', error);
  }
};

/**
 * Gets the total points for a user.
 * @param userId - The user's ID.
 * @returns The user's total points.
 */
export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('userAchievements')
      .where('userId', '==', userId)
      .get();

    const userAchievements = snapshot.docs.map(
      doc => doc.data() as UserAchievement,
    );

    const totalPoints = userAchievements.reduce((total, ua) => {
      const achievement = achievements.find(a => a.id === ua.achievementId);
      return total + (achievement ? achievement.points : 0);
    }, 0);

    return totalPoints;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
};

/**
 * Redeems a reward for a user.
 * @param userId - The user's ID.
 * @param rewardId - The reward's ID.
 * @returns True if redemption was successful, false otherwise.
 */
export const redeemReward = async (
  userId: string,
  rewardId: string,
): Promise<boolean> => {
  try {
    const userPoints = await getUserPoints(userId);
    const reward = rewards.find(r => r.id === rewardId);

    if (!reward || userPoints < reward.pointCost) {
      return false;
    }

    // Check if user already has the reward (if applicable)
    const existing = await firebase
      .firestore()
      .collection('userRewards')
      .where('userId', '==', userId)
      .where('rewardId', '==', rewardId)
      .get();

    if (!existing.empty) {
      // User already redeemed this reward
      return false;
    }

    // Deduct points and add reward to user
    await firebase.firestore().runTransaction(async transaction => {
      const userRef = firebase.firestore().collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const newPointBalance = (userData?.points || 0) - reward.pointCost;

      if (newPointBalance < 0) {
        throw new Error('Insufficient points');
      }

      transaction.update(userRef, { points: newPointBalance });

      transaction.set(firebase.firestore().collection('userRewards').doc(), {
        userId,
        rewardId,
        dateRedeemed: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });

    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return false;
  }
};

/**
 * Fetches the list of rewards available.
 * @returns An array of rewards.
 */
export const getAvailableRewards = async (): Promise<Reward[]> => {
  return rewards;
};

/**
 * Fetches the user's redeemed rewards.
 * @param userId - The user's ID.
 * @returns An array of rewards the user has redeemed.
 */
export const getUserRewards = async (userId: string): Promise<Reward[]> => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('userRewards')
      .where('userId', '==', userId)
      .get();

    const userRewards = snapshot.docs.map(
      doc => doc.data() as { rewardId: string },
    );

    const rewardsRedeemed = userRewards
      .map(ur => rewards.find(r => r.id === ur.rewardId))
      .filter(r => r != null) as Reward[];

    return rewardsRedeemed;
  } catch (error) {
    console.error('Error getting user rewards:', error);
    return [];
  }
};
