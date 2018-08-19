import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {doSignOut} from '../firebase/auth'
import {withRouter} from 'react-router'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      style: 'block'
    }
  }

  render() {
    return (
      <div id="navbar">
        <Link to="/">
          <div id="logo">SpaceCraft</div>
        </Link>
        {this.props.location.pathname === '/worlds' && (
          <span
            id="nav-instructions"
            className="link-item"
            style={{display: this.state.style}}
          >
            Instructions? Press Space Bar
          </span>
        )}
        <div id="menu">
          <Link to="/worlds">
            <div className="link-item">Create</div>
          </Link>
          <Link to="/worldlist">
            <div className="link-item">Explore</div>
          </Link>
          <div className="link-item">Share</div>
          <Link to="/login">
            <div className="link-item">Login</div>
          </Link>
          <Link to="/" onClick={doSignOut}>
            <div className="link-item">Sign Out</div>
          </Link>
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
