import React, {Component} from 'react'
import {doCreateUserWithEmailAndPassword} from '../firebase/auth'

/**
 * COMPONENT
 */
export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async handleSubmit(event) {
    try {
      event.preventDefault();
      await doCreateUserWithEmailAndPassword(this.state.email, this.state.password);
      console.log('sucessfully signed up!');
    } catch (err) {
      console.log('there is an error', err);
    }

  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  render() {
    return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <div className="form-item">
            <label htmlFor="email">
              Email
            </label>
            <input name="email" type="text" onChange={this.handleChange} value={this.state.email}/>
          </div>
          <div className="form-item">
            <label htmlFor="password">
              Password
            </label>
            <input name="password" type="password" onChange={this.handleChange} value={this.state.password}/>
          </div>
          <div>
            <button type="submit">Sign in</button>
          </div>
          {this.state.error && this.state.error.response && <div> {this.state.error.response.data} </div>}
        </form>
      </div>
    )
  }
}