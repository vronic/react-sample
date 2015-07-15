const React = require('react');

import Menu from './Menu';
import Review from './Review';

const App = React.createClass({


  render() {
    return (
      <div>
        <Menu />
        { this.props.children  || <Review /> }
      </div>
    );
  }
});

export default  App;
