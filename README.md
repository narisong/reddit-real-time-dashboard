# Reddit real-time dashboard

## Specs

- A chart that shows the total number of comments of new posts on nba and soccer subreddit
- Refreshes every minute
- Shows a moving window of 1 day worth of data

## Tech stack

- Frontend: react with TypeScript
- Backend: Firebase Functions. Scheduled jobs to query reddit API and clean up database
- Hosting: Firebase Hosting
- Database: Firebase Firestore

## File structure

- Frontend: /src, /public
- Backend: /functions
- Deployment: /firebase.json

## Deployment

- Frontend:

  ``` bash
  npm build
  firebase deploy --only hosting
  ```

- Backend:

  ``` bash
  firebase deploy --only functions
  ```

- Both:

  ``` bash
  firebase deploy
  ```

## Local testing

- Frontend:

  ``` bash
  npm start
  ```

- Backend: Firebase functions allows for local testing, but in this project, since the backend consists only of simple scheduled jobs, we only need to test the interaction with the Reddit API. For this purpose, I have created an `apiPlayground.ts` file to test the Reddit APIs. The integration with the frontend is tested directly against the deployed Firebase functions.

  ``` bash
  cd functions
  npx ts-node apiPlayground.ts
  ```

## Tasks

Stack Rank: higher ranked tasks (larger numeric value) have dependencies on lower ranked tasks

| Task | Stack Rank | Status |
| --- | --- | --- |
| creat-react-app and deploy to firebase hosting | 0 | Done |
| a scheduled firebase function to query reddit api (new post) | 0 | Done |
| save reddit api results to firebase firestore | 1 | Done |
| a scheduled firebase function to clean up old comments | 1 | Done |
| access saved data from client side | 2 | Todo |
| visualize data with plotly | 3 | Todo |

## Scalability

My implementation is tied to Firebase Firestore which has its limitations. For example, it has a soft limit of 1 million concurrent connections, which can be exceeded but performance penalties will occur. The cost also increases dramatically as the number of users increases.

But I think firebase is a good choice for quick prototyping. It's important to deliver something to users quickly and start iterating.

That being said, if we were to implement this in the more "traditional" way, for example node js + postgres, I think there are a few things we can consider

- Load balancing. Regardless of what we use for deployment (vm or k8s), having a load balancing layer will help distribute traffic
- Caching. Having a caching layer such as Redis can reduce the response time and the load on database
- Client side (browser) caching. If we know there is no data change bewteen client's requests, we can leverage client side caching.
- CDN. We can also leverage CDN to increase response time and reduce load on our backend

We can chat more about these.

## References

- reddit api new posts: <http://www.reddit.com/r/subreddit/new.json?sort=new>. the newest 25 (default) posts. [ref](https://www.reddit.com/dev/api/#GET_new)
- firebase cli supports `--debug`
