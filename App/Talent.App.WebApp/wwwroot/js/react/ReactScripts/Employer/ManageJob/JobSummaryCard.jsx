import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Dropdown, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { Pagination, Card, Button } from 'semantic-ui-react';

export class JobSummaryCard extends React.Component {
	constructor(props) {
		super(props);
	   // this.selectJob = this.selectJob.bind(this)

		const jobs = props.jobs ? Object.assign({}, props.jobs) : { id: '' }

		this.state = {
			MyJobs: [],
			showJobs: false,
			currentPage: 1,
			jobsPerPage: 3,
			sortOrder: 'newest',
			default: 'choose the filter'
		}

		this.loadJobs = this.loadJobs.bind(this)
		this.selectJob = this.selectJob.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
		this.renderJobs = this.renderJobs.bind(this)
		this.handlePageChange = this.handlePageChange.bind(this)
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	componentDidMount() {
		// Load jobs when the component is mounted
		this.loadJobs();
	}

	selectJob(id) {
		var cookies = Cookies.get('talentAuthToken');
		//url: 'http://localhost:51689/listing/listing/closeJob',
		url: 'https://talentservicestalent21.azurewebsites.net/listing/listing/closeJob'
	}

	handleSortChange(event, data) {
		this.setState({
			sortOrder: data.value,
			currentPage: 1 
		});
	}
	loadJobs() {
		 /*  console.log("data", this.props.jobs)*/
		const jobs = Object.assign({}, this.props.jobs);
		console.log("jobs are", jobs);
		const employerJobs = Object.values(jobs);
		console.log("employerJobs", employerJobs);

		if (!employerJobs || employerJobs.length === 0)
		{
			this.setState({
				MyJobs: [],
				showJobs: false // Set showJobs to false if there are no jobs
			});
		}
		else
		{
			this.setState({
				MyJobs: employerJobs,
				showJobs: true
			})

		}


	}

	handlePageChange(event, data) {
		this.setState({
			currentPage: data.activePage
		});
	}

	render() {
		return (
			<div>
			<h1>List of Jobs</h1>
				<Icon name='filter'/> Filter : <Dropdown className="hide-dropdown-border"
					selection
					options={[{ key: 'Choose the filter', text: 'Chose the filter', value: 'choose the filter' },]}
					value={this.state.default}
				/>
				<Icon name='calendar' /> Sort By date : 
				{/* Add a Dropdown to select sorting order */}
				<Dropdown className="hide-dropdown-border"
					selection
					options={[
						{ key: 'newest', text: 'Newest', value: 'newest' },
						{ key: 'oldest', text: 'Oldest', value: 'oldest' }
					]}
					onChange={this.handleSortChange}
					value={this.state.sortOrder}
				/>
				
				{this.state.showJobs ? this.renderJobs() : this.renderDisplay()}
				<br></br>
			</div>
			
			//<div className="job-summary-card">
			//    <h3>{job.title}</h3>
			//    <p>{job.description}</p>
			//    <p>Posted: {moment(job.postedDate).format('MMMM Do YYYY')}</p>
			//    <Button onClick={() => this.selectJob(job.id)}>Select Job</Button>
			//</div>
		);
	}
	renderJobs() {
		const { MyJobs, currentPage, jobsPerPage } = this.state;
		const indexOfLastJob = currentPage * jobsPerPage;
		const indexOfFirstJob = indexOfLastJob - jobsPerPage;
		const displayedJobs = MyJobs.slice(indexOfFirstJob, indexOfLastJob);
		const sortedJobs = this.state.MyJobs.sort((a, b) => {
			if (this.state.sortOrder === 'newest') {
				return moment(b.postedDate).valueOf() - moment(a.postedDate).valueOf();
			} else {
				return moment(a.postedDate).valueOf() - moment(b.postedDate).valueOf();
			}
		});
		return (
			<div className='row'>
				<div className="ui sixteen wide column">


					{/* {JSON.stringify(this.props.jobs) }*/}

					<Card.Group>
						{displayedJobs.map(job =>
							<Card color='violet' key={job.id}>
								<Card.Content>
									<Card.Header>Job Title : {job.title}</Card.Header>
									<Card.Meta> Job Summary : {job.summary}</Card.Meta>

								</Card.Content>
								<Card.Content extra>
									<Card.Description> Job Location : {job.location.city}</Card.Description>
									<Card.Description>Country : {job.location.country}</Card.Description>
								</Card.Content>

								<Card.Content extra>
									<Card.Meta> Status : {job.status} </Card.Meta>
									<Card.Meta>No Of Suggestions : <span className="black-tag">{job.noOfSuggestions}</span> </Card.Meta>

								</Card.Content>
								<Card.Content extra>
									<Button basic color='blue'><i className="pencil icon"></i>
										Edit
									</Button>
									<Button basic color='red'><i className="minus circle icon"></i>
										Close
									</Button>
								</Card.Content>
							</Card>

						)}

					</Card.Group>
					<center><h1><Pagination
						activePage={currentPage}
						onPageChange={this.handlePageChange}
						totalPages={Math.ceil(MyJobs.length / jobsPerPage)}
					/>  </h1></center>
				</div>
			</div>
		)
	}
	renderDisplay() {
				return (
			
		   <button type="button" className="ui left floated teal button" onClick={this.loadJobs} >Show My Jobs</button>

		)
	}
}