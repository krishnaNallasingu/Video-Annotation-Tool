import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {store} from './store/store'; 
import App from './App';
import VideoPlayer from './features/videoPlayer/VideoPlayer';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <VideoPlayer />
      </App>
    </Provider>
  </React.StrictMode>
);