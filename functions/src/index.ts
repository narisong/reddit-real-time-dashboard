import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import axios from 'axios';
import { firestore } from "firebase-admin";

admin.initializeApp();

const getCommentsCount = async (subreddit: string) => {
  const result = await axios.get(`http://www.reddit.com/r/${subreddit}/new.json?sort=new`);

  return result.data.data.children.reduce((accu: any, curr: { data: { num_comments: number } }) => accu + curr.data.num_comments, 0);
};

// every minute
// TODO: extract subreddits to an array so we can easily extend this to any number of subreddits
exports.scheduledNewPosts = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  try {
    const nbaComments = await getCommentsCount('nba');
    const soccerComments = await getCommentsCount('soccer');

    await admin.firestore().collection('comments').doc().set({
      timestamp: firestore.Timestamp.now(),
      nba: nbaComments,
      soccer: soccerComments,
    });

    functions.logger.info('Successfully got new posts and saved to firestore');
  } catch (e) {
    functions.logger.error('Failed to get new posts and save to firestore.', { error: e });
  }
});

// every minute
// clean up data that's older than 1 day
exports.scheduledCleanup = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  try {
    const timeThreshold = new Date();
    timeThreshold.setDate(timeThreshold.getDate() - 1);
    const docs = await admin.firestore().collection('comments').where('timestamp', '<', timeThreshold).get();
    const batch = admin.firestore().batch();
    docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.commit();

    functions.logger.info('Successfully deleted old comments', {
      orderThan: timeThreshold,
      deleted: docs.docs.length,
    });
  } catch (e) {
    functions.logger.error('Failed to delete old comments', { error: e });
  }
});
