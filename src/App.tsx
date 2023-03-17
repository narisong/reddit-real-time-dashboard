import { collection, limit, onSnapshot, orderBy, query } from '@firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { firestore } from './firebase';

interface ChartData {
  x: number[];
  y1: number[];
  y2: number[];
}

export default function App() {
  const [data, setData] = useState<ChartData>({
    x: [],
    y1: [],
    y2: [],
  });

  // Firebase Firestore uses websockets to provide real-time updates
  useEffect(() => onSnapshot(query(collection(firestore, 'comments'), orderBy('timestamp')), snapshot => {
    // TODO: we could improve this by only querying the new data, i.e. data after last retrieval and just append new data
    const newData = snapshot.docs.map(doc => doc.data());
    setData({
      x: newData.map(data => data.timestamp.toDate()),
      y1: newData.map(data => data.nba),
      y2: newData.map(data => data.soccer),
    });

    /* TODO
     I tried to show a simple animation like a flashing on the chart to indicate the data has refreshed.
     I think that helps with user experience. But after a brief research I couldn't find a simple way to do it.
     So I just added this console log for you to easily notice a data refresh.
     */
    console.log('new data', newData[newData.length - 1].timestamp.toDate());
  }), []);

  return (
    <>
      <Plot
        className='plot'
        data={[
          { x: data.x, y: data.y1, name: 'nba', mode: 'lines+markers' },
          { x: data.x, y: data.y2, name: 'soccer', mode: 'lines+markers' },
        ]}
        layout={{ title: 'Total # comments of the newest 25 posts' }}
      />
      <h1>Data refreshes every minute. Check console log to monitor when data refresh happens.</h1>
    </>
  );
};
