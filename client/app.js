import React, {Component} from 'react'
import {auth} from './firebase/firebase'
import {Navbar} from './components'
import Routes from './routes'
import {generateGuestName} from '../client/3d/utilities/generateGuestName'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: null,
      guestAvatar: null
    }
  }

  componentDidMount() {
    //for avatar guest names //
    const username = generateGuestName()
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({currentUser: user})
      } else {
        this.setState({currentUser: null, guestAvatar: username})
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {currentUser, guestAvatar} = this.state
    return (
      <div className="center">
        <Navbar currentUser={currentUser} />
        <Routes currentUser={currentUser} guestAvatar={guestAvatar} />
      </div>
    )
  }
}

export default App
