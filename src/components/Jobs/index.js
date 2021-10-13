import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsFillStarFill, BsSearch} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const pageStatus = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  init: 'INITIAL',
}

class Jobs extends Component {
  state = {
    callStatus: pageStatus.init,
    userCardStatus: pageStatus.init,
    userInfo: '',
    jobData: [],
    empType: [],
    searchInput: '',
    activeRadio: '',
  }

  componentDidMount() {
    this.getJobsList()
    this.getUserProfileCall()
  }

  getUserProfileCall = async () => {
    this.setState({userCardStatus: pageStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const gotProfile = data.profile_details
      const updatedProfileData = {
        name: gotProfile.name,
        profileImgUrl: gotProfile.profile_image_url,
        shortBio: gotProfile.short_bio,
      }
      this.setState({
        userInfo: updatedProfileData,
        userCardStatus: pageStatus.success,
      })
    } else {
      this.setState({
        userCardStatus: pageStatus.failure,
      })
    }
  }

  getJobsList = async () => {
    this.setState({
      callStatus: pageStatus.inProgress,
    })
    const {empType, searchInput, activeRadio} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${activeRadio}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobs = await data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobData: updatedJobs,
        callStatus: pageStatus.success,
      })
    } else {
      this.setState({callStatus: pageStatus.failure})
    }
  }

  onEnterDown = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  renderUserFailureView = () => (
    <div className="failure-user-container">
      <button
        className="failure-user-retry-btn"
        onClick={this.getUserProfileCall}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderUserCard = () => {
    const {userInfo} = this.state
    return (
      <div className="user-card-main">
        <img src={userInfo.profileImgUrl} alt="user profile" />
        <h1 className="user-card-name">{userInfo.name}</h1>
        <p className="user-card-bio">{userInfo.shortBio}</p>
      </div>
    )
  }

  onRadioBtn = event => {
    this.setState({activeRadio: event.target.value}, this.getJobsList)
  }

  renderFilterSection = () => {
    const {activeRadio} = this.state
    return (
      <div className="job-filter-section">
        <div className="filter-section">
          {this.renderUserInfoCard()}
          <hr className="all-hr-f" />
          <h1 className="employment-type-label">Type of Employment</h1>
          <ul className="employment-filter">
            {employmentTypesList.map(each => (
              <li
                key={each.employmentTypeId}
                id={each.employmentTypeId}
                value={each.employmentTypeId}
                className="employment-filter-li"
              >
                <input
                  className="filter-checkbox"
                  onClick={this.onCheckBtn}
                  type="checkbox"
                  value={each.employmentTypeId}
                />
                <label className="filter-label" htmlFor={each.employmentTypeId}>
                  {each.label}
                </label>
              </li>
            ))}
          </ul>
          <hr className="all-hr-f" />
          <h1 className="employment-type-label">Salary Range</h1>
          <ul className="salary-range-filter">
            {salaryRangesList.map(each => (
              <li
                key={each.salaryRangeId}
                value={each.salaryRangeId}
                className="employment-filter-li"
              >
                <input
                  id={each.salaryRangeId}
                  className="filter-checkbox"
                  onClick={this.onRadioBtn}
                  type="radio"
                  checked={activeRadio === each.salaryRangeId}
                  value={each.salaryRangeId}
                />
                <label
                  className="salary-filter-label"
                  htmlFor={each.salaryRangeId}
                >
                  {each.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onCheckBtn = event => {
    if (event.target.checked) {
      const {empType} = this.state
      const addedArray = [...empType, event.target.value]
      this.setState({empType: addedArray}, this.getJobsList)
    } else if (!event.target.checked) {
      const {empType} = this.state
      const newArray = empType.filter(word => word !== event.target.value)
      this.setState({empType: newArray}, this.getJobsList)
    }
  }

  renderJobsList = data => {
    const {
      id,
      companyLogoUrl,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      employmentType,
    } = data
    return (
      <Link key={id} className="link-element" to={`/jobs/${id}`}>
        <li key={id} className="job-li-main">
          <div className="job-li-img-rating-section">
            <div>
              <img
                className="job-li-img"
                src={companyLogoUrl}
                alt="company logo"
              />
            </div>
            <div>
              <h1 className="job-li-title">{title}</h1>
              <div className="job-li-star-rating">
                <BsFillStarFill size="20px" color="#fbbf24" />
                <p className="job-li-rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-li-location-salary-section">
            <div className="jo-li-location-type-main">
              <div className="job-li-location-type">
                <MdLocationOn size="25px" />
                <p>{location}</p>
              </div>
              <div className="job-li-location-type">
                <BsBriefcaseFill size="20px" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="job-li-salary-text">{packagePerAnnum}</p>
          </div>
          <hr className="all-hr" />
          <div className="job-li-job-description-section">
            <h1 className="job-li-job-description-label">Description</h1>
            <p className="job-li-job-description-text">{jobDescription}</p>
          </div>
        </li>
      </Link>
    )
  }

  onSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    console.log('search hits')
    this.getJobsList()
  }

  renderFailureView = () => {
    console.log('failure')
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          onClick={this.getJobsList}
          className="failure-retry-btn"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  renderNoJobFoundView = () => (
    <div className="no-job-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-job-title">No Jobs Found</h1>
      <p className="no-job-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  dotLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  dotLoaderJob = () => (
    <div className="loader-container-job" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFullJobList = () => {
    const {jobData} = this.state
    console.log(jobData.length === 0)
    if (jobData.length === 0) {
      return this.renderNoJobFoundView()
    }
    return (
      <ul className="job-list-ul">
        {jobData.map(each => this.renderJobsList(each))}
      </ul>
    )
  }

  renderUserInfoCard = () => {
    const {userCardStatus} = this.state
    switch (userCardStatus) {
      case pageStatus.inProgress:
        return this.dotLoader()
      case pageStatus.success:
        return this.renderUserCard()
      case pageStatus.failure:
        return this.renderUserFailureView()
      default:
        return null
    }
  }

  renderJobListOrLoaderView = () => {
    const {callStatus} = this.state
    switch (callStatus) {
      case pageStatus.inProgress:
        return this.dotLoaderJob()
      case pageStatus.success:
        return this.renderFullJobList()
      case pageStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <div className="job-container">
        <Header />
        <div className="job-main-container">
          {this.renderFilterSection()}
          <div className="job-display-section">
            <div className="job-search-section">
              <input
                onChange={this.onSearchInputChange}
                onKeyDown={this.onEnterDown}
                className="job-search-bar"
                type="search"
                placeholder="Search Job"
              />
              <button
                onClick={this.onSubmitSearch}
                className="job-search-btn"
                type="button"
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobListOrLoaderView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
