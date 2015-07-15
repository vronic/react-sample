
const React = require('react');
window.React = React;

// enable touch event handling on a touch device such as a phone or tablet
React.initializeTouchEvents(true);

// import BrowserHistory from 'react-router/lib/BrowserHistory';
import HashHistory from 'react-router/lib/HashHistory';

const ReactRouter = require('react-router');
const { Router } = ReactRouter;

import AsyncProps from 'react-router/lib/experimental/AsyncProps';

const el = 'tw-publications';

const rootRoute = {
  path: '/',

  childRoutes: [
    require('./routes/Post'),
    require('./routes/Notification')
  ],

  component: require('./components/App')
};

React.render((
  <Router
    children={ rootRoute }
    history={ new HashHistory }
    createElement={ AsyncProps.createElement }
  />
), document.getElementById(el));
