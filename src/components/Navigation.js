import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import * as routes from '../constants/routes';
import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false,
    };
  }

  toggleDrawer = () => 
    this.setState(update(this.state, {
      drawerOpen: {$set: !this.state.drawerOpen}
    }));

  render() {
    const {
      drawerOpen,
    } = this.state;
    return (
      <AuthUserContext.Consumer>
        {
          authUser => 
            <div>
              <AppBar style={{marginBottom: '20px'}} position="static">
                <Toolbar>
                  <IconButton 
                    onClick={this.toggleDrawer}
                    style={{marginRight: '15px'}} 
                    color="inherit" 
                    aria-label="Menu">
                    <i className="material-icons">menu</i>
                  </IconButton>
                  <span>Lobby Directory</span>
                </Toolbar>
              </AppBar>
              {
                authUser 
                  ? <NavigationAuth onToggle={this.toggleDrawer} show={drawerOpen} /> 
                  : <NavigationNonAuth onToggle={this.toggleDrawer} show={drawerOpen} /> 
              }
            </div>
        }
      </AuthUserContext.Consumer>
    );
  }
}

const NavigationAuth = (props) =>
  <Drawer onClose={props.onToggle} open={props.show}>
    <div role="button" onClick={props.onToggle}>
      <List>
        <ListItem button component={Link} to={routes.LANDING}>
          <ListItemIcon>
            <i className="material-icons">home</i>
          </ListItemIcon>
          <ListItemText primary="Landing" />
        </ListItem>

        <ListItem button component={Link} to={routes.DIRECTORY_FORM}>
          <ListItemIcon>
            <i className="material-icons">edit</i>
          </ListItemIcon>
          <ListItemText primary="Manage Directory Info" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button component={Link} to={routes.ACCOUNT}>
          <ListItemIcon>
            <i className="material-icons">account_circle</i>
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        
        <ListItem onClick={auth.doSignOut} button>
          <ListItemIcon>
            <i className="material-icons">exit_to_app</i>
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </div>
  </Drawer>


const NavigationNonAuth = (props) =>
  <Drawer onClose={props.onToggle} open={props.show}>
    <div role="button" onClick={props.onToggle}>
      <List>
        <ListItem button component={Link} to={routes.LANDING}>
          <ListItemIcon>
            <i className="material-icons">home</i>
          </ListItemIcon>
          <ListItemText primary="Landing" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to={routes.SIGN_IN}>
          <ListItemIcon>
            <i className="material-icons">account_circle</i>
          </ListItemIcon>
          <ListItemText primary="Sign In" />
        </ListItem>
      </List>
    </div>
  </Drawer>


export default Navigation;
