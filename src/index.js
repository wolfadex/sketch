import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import App from 'containers/App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(thunk),
)(createStore);
const makeStore = (reducers) => createStoreWithMiddleware(combineReducers(Object.assign({}, {
    // Additional reducers go here...
}, reducers)));

render(
    <Provider
        store={makeStore(reducers.default)}
    >
        <App />
    </Provider>,
    document.getElementById('site-root')
);
