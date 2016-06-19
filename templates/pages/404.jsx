import React, { Component } from 'react'
import Page from '../components/page.jsx'

export default class FourOhFour extends Component {
  componentDidMount() {
    document.title = "PaperBadger: Page Not Found";
  }

  render() {
    return (
      <Page>
        <div>Page not found</div>
      </Page>
    );
  }
}
