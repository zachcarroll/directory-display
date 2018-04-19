import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import { db } from '../firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() })));
  }

  render() {
    const {
      users,
    } = this.state;

    const userList = users 
      ? Object.keys(users).map(n => <div key={n}>{users[n].username} - {users[n].email}</div>)
      : null;

    return (
      <div>
        <p>List of all users</p>
        {userList}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);