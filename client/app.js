import React, {Component} from 'react'
import {auth} from './firebase/firebase'
import {Navbar} from './components'
import Routes from './routes'

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    }
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({currentUser: user})
      } else {
        this.setState({currentUser: null})
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <div className="center">
        <Navbar currentUser={this.state.currentUser}/>
        <Routes currentUser={this.state.currentUser}/>
      </div>
    )
  }
}

export default App
