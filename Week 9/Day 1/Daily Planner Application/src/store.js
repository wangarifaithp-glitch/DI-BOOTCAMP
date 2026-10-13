import { createStore } from 'redux';
import plannerReducer from './reducer';

const store = createStore(plannerReducer);

export default store;
