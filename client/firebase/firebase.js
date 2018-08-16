import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// initialize firebase //
var config = {
  apiKey: 'AIzaSyD-wIw2XP-wlc6oqJOTzOCziYVSk1Y5khE',
  authDomain: 'spacecraft-1806.firebaseapp.com',
  databaseURL: 'https://spacecraft-1806.firebaseio.com',
  projectId: 'spacecraft-1806',
  storageBucket: 'spacecraft-1806.appspot.com',
  messagingSenderId: '664798515932'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.database()
const auth = firebase.auth()

export {auth, db}
