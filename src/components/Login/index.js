import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: 'rahul', password: 'rahul@2021', showError: false, errorMsg: ''}

  processLoginFetch = async () => {
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userData = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})
      history.replace('/')
    } else {
      this.setState({showError: true, errorMsg: data.error_msg})
    }
  }

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  onSubmitButton = event => {
    event.preventDefault()
    console.log('login Clicked')
    this.processLoginFetch()
  }

  render() {
    const {showError, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form onSubmit={this.onSubmitButton} className="login-form-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />

          <label className="login-input-label" htmlFor="userName">
            Username
          </label>
          <input
            onChange={this.onUsernameChange}
            id="userName"
            placeholder="Username"
            value={username}
          />

          <label className="login-input-label" htmlFor="passWord">
            Password
          </label>
          <input
            onChange={this.onPasswordChange}
            id="passWord"
            type="password"
            placeholder="Password"
            value={password}
          />

          <button className="login-form-btn" type="submit">
            Login
          </button>
          {showError && <p className="error-text">{`*${errorMsg}`}</p>}
        </form>
      </div>
    )
  }
}

export default Login
