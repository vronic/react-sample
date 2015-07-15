const React = require('react');
const { oneOf, shape, string } = React.PropTypes;

const proptypes = {

	container: string.isRequired,
	article: shape({

		title: string.isRequired,
		textBBCode: string,
		textHTML: string,

		srcAuthor: string,
		srcOrigin: string,
		srcTranslate: string,
		srcPhoto: string,

		annotation: string,

		categories: string, //shape.isRequired,
        humanUrl: string,
        metaTitle: string,
        metaKeywords: string,
        metaDescription: string,

		author: string.isRequired,
		type: string.isRequired,
		status: string.isRequired,
		actor: oneOf(['author', 'newsman', 'editor', 'chef']).isRequired
	})
};

module.exports = proptypes;