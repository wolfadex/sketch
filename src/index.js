import 'react-redux-toastr/src/styles/index.scss';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import { reducer as toastrReducer } from 'react-redux-toastr';
import ReduxToastr from 'react-redux-toastr'
import App from 'containers/App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(thunk),
)(createStore);
const makeStore = (reducers) => createStoreWithMiddleware(combineReducers(Object.assign({}, {
    // Additional reducers go here...
    toastr: toastrReducer,
}, reducers)));

render(
    <Provider
        store={makeStore(reducers.default)}
    >
        <div>
            <App />
            <ReduxToastr
                timeOut={4000}
                newestOnTop={false}
                preventDuplicates={true}
                position='top'
                transitionIn='fadeIn'
                transitionOut='fadeOut'
                progressBar
            />
        </div>
    </Provider>,
    document.getElementById('site-root')
);
