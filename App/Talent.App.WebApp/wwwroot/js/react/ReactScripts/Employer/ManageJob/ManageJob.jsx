﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.updateJobs = this.updateJobs.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
       loaderData.isLoading = false;
       this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
           
        //)
        //loaderData.isLoading = false;
        console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
        //var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var link = 'https://talentservicestalent21.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
        $.ajax({
           // url: 'http://localhost:51689/listing/listing/getEmployerJobs',
            url: 'https://talentservicestalent21.azurewebsites.net/listing/listing/getEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                /*console.log("respponse data", res)*/
                let loadJobs = null;
                if (res.myJobs) {
                    loadJobs = res.myJobs

                }
                this.updateJobs(loadJobs)

            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        this.init()
    }
    updateJobs(myJobs) {

        let jobs = Object.assign({}, this.state.loadJobs, myJobs)

        this.setState({
            loadJobs: jobs
        })

    }

    

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    
    render() {
       // const { loadJobs } = this.state;
        return (
            <div>
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div className="ui container">
               
                <JobSummaryCard

                    jobs={this.state.loadJobs}
                        />
                   </div>
                </BodyWrapper>
                
            </div>
        )
    }
    renderJobItems(jobs) {
        return jobs.map(job => (
            <JobSummaryCard key={job.id} job={job} />
            // Assuming you have a component named JobSummaryCard to render each job item
        ));
    }
}