import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {
  ReactQueryConfigProvider,
  ReactQueryProviderConfig,
} from 'react-query';

const queryConfig: ReactQueryProviderConfig = {
  queries: { refetchOnWindowFocus: false, retry: false },
};

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
