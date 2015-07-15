
const React = require('react');
const classNames = require('classnames');

const actions = require('./_actionsVideoPreview');

// ===================================================================================================
const VideoPreviewList = React.createClass({

	render() {

	var videos = this.props.videos.map( (video, i) =>
			<VideoPreview key={video.id + '-' + i} video={video} index={i} />
		);

	var style = videos.length ? {resize: 'vertical', height: 150, maxHeight: 420} : {};

	var classPreviewList = classNames({
		'uk-scrollable-box': videos.length,
		'uk-text-center': true
	});


	return (
			<div className={classPreviewList} style={style}>{videos}</div>
	);

  }
});

// ----------------------------------------------------------------------------------------------------
const VideoPreview = React.createClass({

	clickRemoveVideoPreview(evt) {
		evt.preventDefault();

		actions.removeVideo(this.props.index);
	},

	render(){
		var src, style, url;
		src = this.props.video.preview;
		url = `url(${src}) 50% 50%/150px no-repeat`;
		style = {
			background: url,
			width: '100px',
			height: '100px'
		};

		var styleCaption = {
			padding: '5px'
		};

		var styleClose = {
			margin: '3px',
			opacity: '0.5'
		};

		return (
			<figure 
				style={style}
				className="uk-overlay uk-margin-small-right uk-margin-small-bottom uk-text-right">
				<a
					style={styleClose}
					onClick={this.clickRemoveVideoPreview}
					className="uk-close uk-close-alt"
					title="удалить"
					data-uk-tooltip />

			</figure>
		);
	}
});



module.exports = VideoPreviewList;

