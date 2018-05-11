import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme();

function AppWrapper() {
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  );
}


ReactDOM.render(<AppWrapper />, document.getElementById('root'));

registerServiceWorker();
