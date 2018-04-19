import {createStore, applyMiddleware} from 'redux';
import reducer from './ducks/users';
import promiseMiddleware from 'redux-promise-middleware';

let middleware = promiseMiddleware();

export default createStore(reducer, applyMiddleware(middleware));