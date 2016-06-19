import React, { Component } from 'react'
import Page from '../components/page.jsx'

export default class DeniedAccess extends Component {
  componentDidMount() {
    document.title = "PaperBadger: User denied access";
  }

  render() {
    return (
      <Page>
        <div>You must sign in to ORCID to be able to issue a badge. <a href="/issue">Try again.</a></div>
      </Page>
    );
  }
}
