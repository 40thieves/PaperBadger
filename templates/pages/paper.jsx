import React, { Component } from 'react'
import path from 'path'
import validator from 'validator'
import Page from '../components/page.jsx'

export default class Paper extends Component {
  constructor(props) {
    super(props);

    this.state = {data: '', doi: '', 'submitted': false, 'emailError': false, 'doiError': false};

    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleDoiChange = this.handleDoiChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    document.title = "Submit a Paper | Contributorship Badges";
  }

  componentDidMount() {
    if(!this.props.user){
      //redirect if user isn't logged in
      window.location.href="/request-orcid-user-auth";
    }

    if(this.props.user.role != 'publisher'){
      //redirect home is user isn't a publisher
      this.replaceWith('home');
    }
  }

  validateEmail(emailId) {
    return validator.isEmail(emailId);
  }

  validateDOI(doi) {
    var doiRe = /(10\.\d{3}\d+)\/(.*)\b/;
    return doiRe.test(doi);
  }

  handleSubmit(e) {
    e.preventDefault();
    var doi = this.state.doi;
    var emails = this.state.data.split('\n');

    if(!this.validateDOI(doi)) {
      this.setState({'doiError': true, 'submitted': false});
      return;
    }

    for(var i=0;i<emails.length;i++) {
      if(!this.validateEmail(emails[i])) {
        this.setState({'emailError': true, 'submitted': false});
        return;
      }
    }

    var doiRe = /(10\.\d{3}\d+)\/(.*)\b/;
    var m = doiRe.exec(doi);
    var url = path.join('/papers', m[1],encodeURIComponent(m[2]));

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({emails: emails})
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        this.setState({data: '', doi: '', 'submitted': true, 'emailError': false, 'doiError': false});
    });
    return;
  }

  handleDoiChange(event) {
    this.setState({doi: event.target.value});
  }

  handleDataChange(event) {
    this.setState({data: event.target.value});
  }

  render() {
    return (
      <Page>
        <h1>Submit a Paper</h1>
        <p>This is a simple prototype demonstrating using a form to submit papers to Paper Badger, our contributorship badges prototype. In future versions we will integrate with publisher submission pipelines.</p>
        <h4 hidden={!this.state.submitted}>You have succefully submitted the form</h4>
        <h4 hidden={!this.state.emailError}>Not a valid Email ID</h4>
        <h4 hidden={!this.state.doiError}>Not a valid DOI</h4>
        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
            <fieldset>
                <div className="pure-control-group">
                    <label for="doi">DOI</label>
                    <input type="text" value={this.state.doi} onChange={this.handleDoiChange} placeholder="Paper DOI" />
                </div>

                <div className="pure-control-group">
                    <label for="authors">Author Emails</label>
                    <textarea value={this.state.data} onChange={this.handleDataChange} placeholder="Author emails" />
                </div>

                <div className="pure-control-group">
                    <label></label>
                    <span>Add each email on a separate line</span>
                </div>

                <div className="pure-controls">
                    <button type="submit" className="pure-button pure-button-primary">Submit</button>
                </div>
            </fieldset>
        </form>
      </Page>

      );
  }
}
