
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'


const store = createStore( rootReducer, {}, composeWithDevTools (applyMiddleware( thunk )) );

export default store;


