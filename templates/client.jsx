import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import HomePage from './pages/home.jsx'
import AboutPage from './pages/about.jsx'
import IssuePage from './pages/issue.jsx'
import DeniedPage from './pages/denied.jsx'
import NewPaperPage from './pages/paper.jsx'
import ViewPage from './pages/view.jsx'
import NotFoundPage from './pages/404.jsx'

fetch('/user', {
  credentials: 'same-origin'
})
.then((response) => {
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return response.json()
})
.then((user) => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={withUser(HomePage, user)} />
      <Route path="/about" component={withUser(AboutPage, user)} />
      <Route path="/issue(/:slug)" component={withUser(IssuePage, user)} />
      <Route path="/denied/?" component={withUser(DeniedPage, user)} />
      <Route path="/papers/new" component={withUser(NewPaperPage, user)} />
      <Route path="/v/*" component={withUser(ViewPage, user)} />
      <Route path="/*" component={withUser(NotFoundPage, user)} />
    </Router>
  ), document.getElementById('app'));
});

// HOC to decorate Routes with user
function withUser(Component, user) {
  return class WithUser extends Component {
    render() {
      return <Component {...this.props} user={user} />
    }
  }
}
