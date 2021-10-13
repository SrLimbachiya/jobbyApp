import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import './index.css'

const pageStatus = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  init: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    skills: [],
    companyLife: {},
    similarJobs: [],
    loadStatus: pageStatus.init,
  }

  componentDidMount() {
    this.getJobData()
    this.onbeforeunload()
  }

  onbeforeunload = () => {
    window.scrollTo(0, 0)
  }

  getJobData = async () => {
    this.setState({loadStatus: pageStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const gotjobDetails = data.job_details
      const updatedJobData = {
        companyLogoUrl: gotjobDetails.company_logo_url,
        employmentType: gotjobDetails.employment_type,
        id: gotjobDetails.id,
        jobDescription: gotjobDetails.job_description,
        location: gotjobDetails.location,
        packagePerAnnum: gotjobDetails.package_per_annum,
        rating: gotjobDetails.rating,
        title: gotjobDetails.title,
        skills: gotjobDetails.skills,
        lifeAtCompany: gotjobDetails.life_at_company,
        companyWebsiteUrl: gotjobDetails.company_website_url,
      }
      const updatedSkills = gotjobDetails.skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))
      const gotLifeAtCompany = updatedJobData.lifeAtCompany

      const updatedLifeAtCompany = {
        description: gotLifeAtCompany.description,
        imageUrl: gotLifeAtCompany.image_url,
      }

      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: updatedJobData,
        skills: updatedSkills,
        companyLife: updatedLifeAtCompany,
        similarJobs: updatedSimilarJobs,
        loadStatus: pageStatus.success,
      })
    } else {
      this.setState({loadStatus: pageStatus.failure})
    }
  }

  renderSkills = props => {
    const {imageUrl, name} = props
    return (
      <li key={name} className="job-item-skills">
        <img className="job-item-skill-img" src={imageUrl} alt={name} />
        <p className="job-item-skill-name">{name}</p>
      </li>
    )
  }

  renderSimilarJobsCard = props => {
    const {
      id,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
    } = props
    return (
      <li key={id} className="job-item-similar-card">
        <div className="job-item-similar-img-rating">
          <div>
            <img
              className="job-item-similar-img"
              src={companyLogoUrl}
              alt="similar job company logo"
            />
          </div>
          <div>
            <h1 className="job-item-similar-title">{title}</h1>
            <div className="job-item-star-rating">
              <BsFillStarFill size="20px" color="#fbbf24" />
              <p className="job-item-rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div>
          <h1 className="job-item-similar-des-label">Description</h1>
          <p className="job-item-similar-des-text">{jobDescription}</p>
        </div>
        <div className="job-item-similar-location-type">
          <div className="job-item-similar-location-type">
            <MdLocationOn className="job-item-similar-location-icon" />
            <p>{location}</p>
          </div>
          <div className="job-item-similar-location-type">
            <BsBriefcaseFill
              className="job-item-similar-type-icon"
              size="20px"
            />
            <p>{employmentType}</p>
          </div>
        </div>
      </li>
    )
  }

  renderFullPage = () => {
    const {jobDetails, skills, companyLife, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      employmentType,
      companyWebsiteUrl,
    } = jobDetails
    return (
      <div className="job-item-container">
        <div className="job-item-main">
          <div className="job-item-img-rating-section">
            <div>
              <img
                className="job-item-img"
                src={companyLogoUrl}
                alt="job details company logo"
              />
            </div>
            <div>
              <h1 className="job-item-title">{title}</h1>
              <div className="job-item-star-rating">
                <BsFillStarFill size="20px" color="#fbbf24" />
                <p className="job-item-rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-salary-section">
            <div className="job-item-location-type-main">
              <div className="job-item-location-type">
                <MdLocationOn className="job-item-location-icon" />
                <p className="job-item-location-text">{location}</p>
              </div>
              <div className="job-item-location-type">
                <BsBriefcaseFill className="job-item-type-icon" size="20px" />
                <p className="job-item-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="job-item-salary-text">{packagePerAnnum}</p>
          </div>
          <hr className="all-hr" />
          <div className="job-item-des-link-to-web">
            <h1 className="job-item-job-description-label">Description</h1>
            <a className="job-item-web-link" href={companyWebsiteUrl}>
              Visit <FiExternalLink />
            </a>
          </div>
          <div className="job-item-job-description-section">
            <p className="job-item-job-description-text">{jobDescription}</p>
          </div>
          <div className="job-item-skill-container">
            <p className="job-item-skill-label">Skills</p>
            <ul className="job-item-skill-ul">
              {skills.map(each => this.renderSkills(each))}
            </ul>
          </div>
          <div className="job-item-life-at-company">
            <h1 className="job-item-life-label">Life At Company</h1>
            <div className="job-item-life-description-img">
              <p className="job-item-life-description-text">
                {companyLife.description}
              </p>
              <img
                className="job-item-life-image"
                src={companyLife.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="job-item-similar-jobs-container">
          <h1 className="job-item-similar-label">Similar Jobs</h1>
          <ul className="job-item-similar-ul">
            {similarJobs.map(each => this.renderSimilarJobsCard(each))}
          </ul>
        </div>
      </div>
    )
  }

  dotLoader = () => (
    <div className="loader-container-job-details" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    console.log('failure')
    return (
      <div className="details-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="details-failure-heading">Oops! Something Went Wrong</h1>
        <p className="details-failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          onClick={this.getJobData}
          className="details-failure-retry-btn"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  renderEverythingCard = () => {
    const {loadStatus} = this.state
    switch (loadStatus) {
      case pageStatus.inProgress:
        return this.dotLoader()
      case pageStatus.success:
        return this.renderFullPage()
      case pageStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderEverythingCard()}
      </>
    )
  }
}

export default JobItemDetails
