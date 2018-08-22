import React from 'react'
import {doSignOut} from '../firebase/auth'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import CreateButton from './CreateButton'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      style: 'block'
    }
    this.signout = this.signout.bind(this)
  }

  signout(event) {
    doSignOut()
    this.props.history.push('/')
  }

  render() {
    const currentUser = this.props.currentUser
    return (
      <div id="navbar" style={{zIndex: 100}}>
        <Link to="/" onClick={() => this.props.updatePaused()}>
          <div id="logo">SpaceCraft</div>
        </Link>
        {this.props.location.pathname.indexOf('/worlds') === 0 && (
          <span id="nav-instructions" style={{display: this.state.style}}>
            Instructions? Press Space Bar
          </span>
        )}
        <div id="menu">
          <CreateButton currentUser={currentUser} />
          <Link to="/worldlist">
            <div className="link-item">Explore</div>
          </Link>
          {!currentUser || !currentUser.displayName ? (
            <Link to="/login">
              <div className="link-item">Login</div>
            </Link>
          ) : (
            <div className="link-item" onClick={this.signout}>
              Logout
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)
