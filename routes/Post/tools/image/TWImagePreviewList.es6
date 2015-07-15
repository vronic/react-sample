
var React = require('react');
var classNames = require('classnames');

var ImagePreview = require('./TWImagePreview.js');

// ===================================================================================================
var ImagePreviewList = React.createClass({

	render() {

	var images = this.props.images.map( (img, i) =>
			<ImagePreview key={img.key} image={img} index={i} />
		);

	var style = images.length ? {resize: 'vertical', height: 150, maxHeight: 420} : {};

	var classPreviewList = classNames({
		'uk-scrollable-box': images.length,
		'uk-text-center': true
	});


	return (
			<div className={classPreviewList} style={style}>{images}</div>
	);

  }
});


module.exports = ImagePreviewList;
