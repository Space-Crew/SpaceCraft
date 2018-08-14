import React, {Component} from 'react'
import {doCreateUserWithEmailAndPassword} from '../firebase/auth'
import {db} from '../firebase'

/**
 * COMPONENT
 */

function writeUserData(userId, name, email, imageUrl, worlds = []) {
  db.ref('users/' + userId).set({
    username: name,
    email: email,
    avatar: imageUrl,
    worlds: worlds
  });
}

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      imageUrl: '',
      error: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(event) {
    try {
      event.preventDefault();
      const user = await doCreateUserWithEmailAndPassword(this.state.email, this.state.password);
      console.log(user.user);
      await writeUserData(user.user.uid, this.state.username, this.state.email, this.state.imageUrl);
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
            <label htmlFor="username">
              Username
            </label>
            <input name="username" type="username" onChange={this.handleChange} value={this.state.username}/>
          </div>
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
          <div className="form-item">
            <label htmlFor="imageUrl">
              Avatar
            </label>
            <input name="imageUrl" type="imageUrl" onChange={this.handleChange} value={this.state.imageUrl}/>
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