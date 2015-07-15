const React = require('react');

const View = require('./View');

const Preview = React.createClass({

	render() {
		return (
			<div>
				<View id={this.props.params.id}/>
			</div>
			);
	}
});

module.exports = Preview;