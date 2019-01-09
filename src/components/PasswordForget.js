import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';

import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <div>
    <PasswordForgetForm />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <Grid justify="center" container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Forgot Password"></CardHeader>
            <CardContent>
              <Grid container spacing={16}>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={this.state.email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    label="Email Address"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button 
                color="primary" 
                variant="raised" 
                onClick={this.onSubmit} 
                disabled={isInvalid}>
                Reset My Password
              </Button>

              { error && <p>{error.message}</p> }
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};