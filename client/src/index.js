import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk'; 
import combinedReducer from './redux/reducers';
import { Provider } from 'react-redux';

const store = createStore(combinedReducer, applyMiddleware(thunk));

//console.log = console.warn = console.error = () => {};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
