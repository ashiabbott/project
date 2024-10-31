import firebase from 'firebase/app';
import 'firebase/firestore';
import * as tf from '@tensorflow/tfjs';

interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface UserBehavior {
  userId: string;
  notificationInteractions: {
    [notificationType: string]: {
      totalSent: number;
      totalRead: number;
      lastInteraction: Date;
    };
  };
}

const notificationModel = await tf.loadLayersModel(
  'https://yourfinanceapp.com/notification-model/model.json',
);

export const generateNotification = async (
  userId: string,
  type: string,
  content: string,
): Promise<void> => {
  const userBehavior = await getUserBehavior(userId);

  const shouldSend = await predictNotificationRelevance(userBehavior, type);

  if (shouldSend) {
    const notification: Omit<Notification, 'id'> = {
      userId,
      type,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    await firebase.firestore().collection('notifications').add(notification);
  }
};

const getUserBehavior = async (userId: string): Promise<UserBehavior> => {
  const doc = await firebase
    .firestore()
    .collection('userBehaviors')
    .doc(userId)
    .get();
  return doc.data() as UserBehavior;
};

const predictNotificationRelevance = async (
  userBehavior: UserBehavior,
  notificationType: string,
): Promise<boolean> => {
  const interactionData = userBehavior.notificationInteractions[
    notificationType
  ] || {
    totalSent: 0,
    totalRead: 0,
    lastInteraction: new Date(0),
  };

  const inputData = [
    interactionData.totalSent,
    interactionData.totalRead,
    Date.now() - interactionData.lastInteraction.getTime(),
  ];

  const inputTensor = tf.tensor2d([inputData]);
  const prediction = notificationModel.predict(inputTensor) as tf.Tensor;
  const relevanceScore = (await prediction.data())[0];

  return relevanceScore > 0.5; // Threshold for sending notification
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  await firebase
    .firestore()
    .collection('notifications')
    .doc(notificationId)
    .update({
      isRead: true,
    });
};

export const getUnreadNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  const snapshot = await firebase
    .firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .where('isRead', '==', false)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as Notification,
  );
};
