import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authentication from './reducers/authentication';
import modal from './reducers/modal';
import transactions from './reducers/transactions';
import agreements from './reducers/agreements';
import user from './reducers/user';
import notification from './reducers/notification';

const rootReducer = combineReducers({
  authentication: authentication,
  transactions: transactions,
  modal: modal,
  agreements: agreements,
  user: user,
  notification:notification
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export {store};
