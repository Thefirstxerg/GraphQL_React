import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';
import API_URL from '../config/api';

class AuthPage extends Component {
  // Local state to track if the form is in login or signup mode
  state = {
    isLogin: true
  };

  // Set the context type to access AuthContext
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    // Create refs to access the input values directly
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  // Toggle between login and signup modes
  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  // Handle form submission for login/signup
  submitHandler = event => {
    event.preventDefault(); // Prevent default form submission

    // Get input values from refs
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // Basic validation: check for empty fields
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // Prepare GraphQL request body for login by default
    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    // If in signup mode, change the request to a mutation
    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    // Send the request to the backend GraphQL endpoint
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // Check for successful response
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // Handle login response
        if (this.state.isLogin) {
          if (resData.data && resData.data.login && resData.data.login.token) {
            // Call context login method to update auth state
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
          } else {
            alert('Login failed! Please check your credentials.');
          }
        } else {
          // Handle signup response
          if (resData.data && resData.data.createUser) {
            alert('Signup successful! You can now log in.');
            this.setState({ isLogin: true }); // Switch to login mode
          } else {
            alert('Signup failed! Please try again.');
          }
        }
      })
      .catch(err => {
        // Handle network or server errors
        console.log(err);
        alert('Something went wrong. Please try again.');
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          {/* Email input field */}
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          {/* Password input field */}
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          {/* Submit button changes text based on mode */}
          <button type="submit">{this.state.isLogin ? 'Login' : 'Signup'}</button>
          {/* Button to switch between login and signup */}
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;