var React = require('react');
var FileAPI = require('fileapi');

var ImagesActions = require('./_actionsImages');

// ===========================================================================================
var TWImagePreview 	= React.createClass({

	getInitialState() {
		return ({
			thumb: 'no image'
		});
	},

	_getThumbnail(image) {
		var d, file;
		file = image.src;
		if (image.type === 'file') {
			d = $.Deferred();
			FileAPI.Image(file).preview(150).get( (err, thumbnail) => {
				if (!err) 
					{d.resolve(thumbnail);} 
				else 
					{d.reject('thumbnail error'); }
				});
			d.done( (thumbnail) => {
				this.setState({thumb: thumbnail.toDataURL()}); 
				});
		}
	},

	componentWillMount() {
		this._getThumbnail(this.props.image);
	},

	clickRemoveImagePreview(evt) {
		evt.preventDefault();

		ImagesActions.removeImage(this.props.index);
	},

	render(){
		var src, style, url;
		src = this.props.image.type !== 'file' ? this.props.image.src : this.state.thumb;
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
			<figure style={style}
				className="uk-overlay uk-margin-small-right uk-margin-small-bottom uk-text-right">
				<a
					style={styleClose}
					onClick={this.clickRemoveImagePreview}
					className="uk-close uk-close-alt"
					title="удалить"
					data-uk-tooltip />
					
				<figcaption style={styleCaption} className="uk-overlay-panel uk-overlay-bottom uk-text-center uk-text-muted uk-overlay-background">
					{this.props.image.width + ' x ' + this.props.image.height}
				</figcaption>
			</figure>
		);
	}
});

module.exports = TWImagePreview;
