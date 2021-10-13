import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutFunction = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <ul className="md-lg-navbar">
        <li>
          <Link to="/">
            <img
              className="header-web-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li>
          <div className="home-job-link">
            <Link className="links" to="/">
              <p>Home</p>
            </Link>
            <Link className="links" to="/jobs">
              <p>Jobs</p>
            </Link>
          </div>
        </li>
        <li>
          <button onClick={logoutFunction} className="logout-btn" type="button">
            Logout
          </button>
        </li>
      </ul>

      <div className="sm-navbar">
        <Link to="/">
          <img
            className="sm-header-web-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="sm-home-job-link">
          <li>
            <Link className="links" to="/">
              <AiFillHome size="27px" />
            </Link>
          </li>
          <li>
            <Link className="links" to="/jobs">
              <BsBriefcaseFill size="27px" />
            </Link>
          </li>
          <li className="sm-home-logout-btn">
            <button
              onClick={logoutFunction}
              className="sm-logout-btn"
              type="button"
            >
              <FiLogOut size="28px" color="#ffffff" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
