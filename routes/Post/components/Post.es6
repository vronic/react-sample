const React = require('react');


const Post = React.createClass({
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
});
module.exports = Post;