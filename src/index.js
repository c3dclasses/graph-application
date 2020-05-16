import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./components/app/app";
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {createStore} from "redux";
import GraphApplicationReducer from "./reducers/graphapplicationreducer";

// create the graph application store
const graphappstore = createStore(GraphApplicationReducer);

ReactDOM.render(
    <Provider store={graphappstore}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
