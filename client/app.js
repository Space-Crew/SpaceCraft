import React, {Component} from 'react'
import {auth} from './firebase/firebase'
import {Navbar} from './components'
import Routes from './routes'

class App extends Component {
  render() {
    return (
      <div className="center">
        <Navbar />
        <Routes />
      </div>
    )
  }
}


export default App
