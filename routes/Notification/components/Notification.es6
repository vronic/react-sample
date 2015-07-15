const React = require('react');


const Notification = React.createClass({
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
});
module.exports = Notification;