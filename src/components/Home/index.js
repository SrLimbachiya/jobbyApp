import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="home-info-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-info-para">
            Millions of people are searching for jobs, salary information,
            company review. Find the job that fits your abilities and potential
          </p>
          <Link to="/jobs">
            <button className="find-job-btn" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
