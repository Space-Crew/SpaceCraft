import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {auth} from './firebase/firebase'
import {doSignInWithEmailAndPassword, doSignOut} from './firebase/auth'

const LOGIN_USER = 'LOGIN_USER';
const LOG_OUT = 'LOG_OUT';

const initialState = {
  currentUser: null
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
		case LOGIN_USER:
      return {currentUser: action.user};
    case LOG_OUT:
      return {currentUser: null};
		default:
		  return state;
	}
};

const loginUser = (user) => ({
	type: LOGIN_USER,
	user
});

const logoutUser = () => ({
	type: LOG_OUT
});

export const login = (email, password) => dispatch => {
	try {
    doSignInWithEmailAndPassword(email, password)
		auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(loginUser(user));
      } else {
        dispatch(logoutUser());
      }
    });
	}
	catch (err) {
		console.log(err)
	}
};

export const logout = () => dispatch => {
	try {
    doSignOut();
		auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(loginUser(user));
      } else {
        dispatch(logoutUser());
      }
    });
	}
	catch (err) {
		console.log(err)
	}
};

export default createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware
  )
)