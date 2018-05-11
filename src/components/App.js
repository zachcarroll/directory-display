import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from 'material-ui/CssBaseline';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import AccountPage from './Account';
import DirectoryFormPage from './DirectoryForm';

import * as routes from '../constants/routes';
import withAuthentication from './withAuthentication';

const App = () =>
  <React.Fragment>
    <CssBaseline />
      <Router>
        <div>
        
          <Navigation />

          <hr/>

          <Route exact path={routes.DIRECTORY_FORM} component={() => <DirectoryFormPage />} />
          <Route exact path={routes.LANDING} component={() => <LandingPage />} />
          <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
          <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
          <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
          <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
        </div>
      </Router>
  </React.Fragment>


export default withAuthentication(App);
