import axios from 'axios';

const getCommentsCount = async (subreddit: string) => {
  const result = await axios.get(`http://www.reddit.com/r/${subreddit}/new.json?sort=new`);

  return result.data.data.children.reduce((accu: any, curr: { data: { num_comments: number } }) => accu + curr.data.num_comments, 0);
};

(async () => {
  const nbaComments = await getCommentsCount('nba');
  console.log('nba', nbaComments);
  const soccerComments = await getCommentsCount('soccer');
  console.log('soccer', soccerComments);
})();
