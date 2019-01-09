import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';

import * as routes from '../constants/routes';
import { auth, db } from '../firebase';

const SignUpPage = ({ history }) =>
  <div>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            history.push(routes.DIRECTORY_FORM);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <Grid justify="center" container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sign Up"></CardHeader>
            <CardContent>
              <Grid container spacing={16}>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={username}
                    onChange={event => this.setState(byPropKey('username', event.target.value))}
                    label="Full Name" />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    label="Email Address" />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    label="Password" />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    label="Confirm Password" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                color="primary" 
                variant="raised" 
                disabled={isInvalid} 
                onClick={this.onSubmit}>
                Sign Up
              </Button>
              
              { error && <p>{error.message}</p> }
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};