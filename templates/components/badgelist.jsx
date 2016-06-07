import React, { Component } from 'react'
import Badge from './badge.jsx'

export default class BadgeList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {data: []};
  }

  loadUsersFromServer() {
    fetch('/badges')
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((badges) => {
        this.setState({data: badges});
    });
  }

  componentDidMount() {
    this.loadUsersFromServer();
  }

  render() {
    var badgeNodes = this.state.data.map(function(badge) {
      return (
        <Badge badge={badge} key={badge.id} />
      );
    });
    return (
      <div>
        {badgeNodes}
      </div>
    );
  }
}
