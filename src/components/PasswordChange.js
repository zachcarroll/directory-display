import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';

import { auth } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <Grid justify="center" container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Change Password"></CardHeader>
            <CardContent>
              <Grid container spacing={16}>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    label="New Password" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    label="Confirm New Password" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button 
                color="primary" 
                variant="raised"
                onClick={this.onSubmit} 
                disabled={isInvalid}>
                Update My Password
              </Button>

              { error && <p>{error.message}</p> }
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default PasswordChangeForm;