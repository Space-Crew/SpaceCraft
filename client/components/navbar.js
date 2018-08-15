import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {doSignOut} from '../firebase/auth'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div id="navbar">
    <Link to="/">
      <div id="logo">SpaceCraft</div>
    </Link>
    <div id="menu">
      <Link to="/create">
        <div className="link-item">Create</div>
      </Link>
      <Link to="/worlds">
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

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
