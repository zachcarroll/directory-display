import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';

import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { PasswordForgetLink } from './PasswordForget';

const SignInPage = ({ history }) =>
  <div>
    <SignInForm history={history} />
    <Grid container justify="center" spacing={0}>
      <Grid item xs={12} md={6}>
        <PasswordForgetLink />
        <SignUpLink />
      </Grid>
    </Grid>
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.DIRECTORY_FORM);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <Grid justify="center" container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sign In"></CardHeader>
            <CardContent>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    label="Email Address" />
                </Grid>
              </Grid>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={password}
                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                    type="password"
                    label="Password" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Button
                    color="primary" 
                    variant="raised" 
                    disabled={isInvalid} 
                    onClick={this.onSubmit}>
                    Sign In
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  { error && <p>{error.message}</p> }
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
