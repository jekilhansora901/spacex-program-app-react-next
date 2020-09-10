import flightReducer from './flightReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    flightReducer: flightReducer
});

export default rootReducer;
