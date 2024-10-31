import firebase from 'firebase/app';
import 'firebase/firestore';

interface SharedGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  participants: string[];
  dueDate: Date;
}

interface FinancialTip {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  userId: string;
  content: string;
  timestamp: Date;
}

export const createSharedGoal = async (
  goal: Omit<SharedGoal, 'id'>,
): Promise<string> => {
  const goalRef = await firebase
    .firestore()
    .collection('sharedGoals')
    .add(goal);
  return goalRef.id;
};

export const updateSharedGoal = async (
  goalId: string,
  update: Partial<SharedGoal>,
): Promise<void> => {
  await firebase
    .firestore()
    .collection('sharedGoals')
    .doc(goalId)
    .update(update);
};

export const getSharedGoals = async (userId: string): Promise<SharedGoal[]> => {
  const snapshot = await firebase
    .firestore()
    .collection('sharedGoals')
    .where('participants', 'array-contains', userId)
    .get();
  return snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as SharedGoal,
  );
};

export const shareTip = async (
  tip: Omit<FinancialTip, 'id' | 'likes' | 'comments'>,
): Promise<string> => {
  const tipRef = await firebase
    .firestore()
    .collection('financialTips')
    .add({
      ...tip,
      likes: 0,
      comments: [],
    });
  return tipRef.id;
};

export const likeTip = async (tipId: string): Promise<void> => {
  await firebase
    .firestore()
    .collection('financialTips')
    .doc(tipId)
    .update({
      likes: firebase.firestore.FieldValue.increment(1),
    });
};

export const commentOnTip = async (
  tipId: string,
  comment: Omit<Comment, 'timestamp'>,
): Promise<void> => {
  await firebase
    .firestore()
    .collection('financialTips')
    .doc(tipId)
    .update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        ...comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    });
};
