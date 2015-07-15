const React = require('react');
const classNames = require('classnames');

const Reflux = require('reflux');

const actionsList = require('./_actionsVideoList');



// -------------------------------------------------------------------------------------
const ImageRow = React.createClass({

	mixins: [
		
		Reflux.listenTo(actionsList.cancelEditField, 'onCancelEditField'),
	],

	getDefaultProps() {
		return {
			image: {checked: false},
			align: 'center',
		};
	},

	getInitialState() {
		return {
			checked: this.props.video.checked,
			currentEdit: 'nothing',
			edit: {
				caption: false,
				author: false,
				source: false,
				nothing: false,
			}
		};
	},

	onCancelEditField (id, field) {

		if (this.props.video.id === id) {
			// console.log('onCancelEdit', id, field, this.state.edit[field]);
			this.setState({
				edit: {
					[field]: false
				},
				currentEdit: 'nothing',
			});
		}
	},

	clickInsertVideoToEditor (evt) {
		evt.preventDefault();

		const $editor = $("#editor");
		const center = (this.props.align === 'center') ? 'uk-flex' : '';

		let data = {
			src: this.props.video.url,
			caption: this.props.video.caption || '',
			author: this.props.video.author || '',
			source: this.props.video.source ? '/ ' + this.props.video.source : '',
			
			align: this.props.align,
			center: center,
			
			alt: this.props.video.videoId,

			// width: this.props.video.width,
			// height: null,

		};
		console.log('clickInsertVideoToEditor', data);
		const code = $editor.getHTMLByCommand( 'twvideo', data);
		$editor.insertAtCursor(code);
	},

	checkVideo (evt) {

		evt.preventDefault();
		actionsList.checkVideo(this.props.video.id, !this.state.checked);

	},

	componentWillReceiveProps(nextProps) {

		this.setState({
			checked: nextProps.video.checked
		});
	},

	clickEditButton (edit, evt) {
		evt.preventDefault();
		// console.log('clickEditButton', edit);

		this.setState({
			currentEdit: edit,
			edit: {
				[edit]: true,
			}
		});

	},

	clickRemoveVideo (evt) {
		evt.preventDefault();
		actionsList.removeVideo(this.props.video.id);
	},
 
	render() {

		const video = this.props.video;

		const classEditCaption = classNames({
			'uk-margin-small-right': true,
			'uk-icon-pencil': true,
			'uk-icon-hover': true,
			'tw-cursor-pointer': true,
			'tw-hidden': this.state.edit.caption
		});
		const classEditAuthor = classNames({
			'uk-margin-small-right': true,
			'uk-icon-pencil': true,
			'uk-icon-hover': true,
			'tw-cursor-pointer': true,
			'tw-hidden': this.state.edit.author
		});
		const classEditSource = classNames({
			'uk-margin-small-right': true,
			'uk-icon-pencil': true,
			'uk-icon-hover': true,
			'tw-cursor-pointer': true,
			'tw-hidden': this.state.edit.source
		});

		const inputFieldCaption = (this.state.edit.caption) ?  <span><InputField key={this.props.video.videoId + "_caption"} videoId={this.props.video.id} field="caption" value={video.caption} length="100" /></span> : <span>{video.caption}</span>;
		const inputFieldAuthor = (this.state.edit.author) ?  <span><InputField key={this.props.video.videoId + "_author"} videoId={this.props.video.id} field="author" value={video.author} /></span> : <span>{video.author}</span>;
		const inputFieldSource = (this.state.edit.source) ?  <span><InputField key={this.props.video.videoId + "_source"} videoId={this.props.video.id} field="source" value={video.source} /></span> : <span>{video.source}</span>;

		const classFields = classNames({
			'uk-list': true,
			'uk-margin-remove': true,
			'uk-text-truncate': true,
			'uk-hidden': !(video.source || video.author || video.caption)
		});

		const classRemoveVideo = classNames({
			'uk-align-right': true,
			'uk-text-muted': true,
			'tw-cursor-pointer': true,
			'uk-margin-small-right': true,
			'uk-hidden': this.state.checked,
			'tw-hidden': !this.state.checked,
		});

		return (
			<li className="uk-visible-hover">
				<div
					className={classRemoveVideo}
					onClick={this.clickRemoveVideo}>
					<i 
						className="uk-icon-close" 
						title="удалить изображение из альбома"
						data-uk-tooltip />
				</div>
				<div className="uk-form">
					<div className="uk-flex uk-flex-top">
						<div className="uk-width uk-text-center" style={{width: '25px'}}>
							<input type="checkbox" checked={this.state.checked} onChange={this.checkVideo} />
						</div>
						<div className="uk-width uk-text-center uk-margin-small-right uk-margin-small-left" style={{width: '100px'}}>
							<figure className="uk-thumbnail tw-cursor-pointer">
								<img
									onClick={this.clickInsertVideoToEditor}
									src={video.previewUrl} 
									alt={video.videoId} 
									width="100" 
									height="100" 
									title="нажмите, чтобы добавить изображение в текст"
									data-uk-tooltip />
							</figure>
						</div>
						<div className="uk-flex-column">
							<div className="uk-text-truncate uk-margin-bottom">

								<span className="uk-margin-small-left uk-margin-small-right">{this.props.id + '. '}</span>
								<span className="uk-text-warning">{video.url}</span>
							</div>

							<ul className={classFields}>
								<li  className="uk-text-truncate">
									<span className="uk-text-muted uk-margin-small-right">Описание: </span>
									 
									<i 
										onClick={this.clickEditButton.bind(null, 'caption')}
										className={classEditCaption} />
									{inputFieldCaption}
								</li>
								<li  className="uk-text-truncate">
									<span className="uk-text-muted uk-margin-small-right">Автор: </span>
									 
									<i 
										onClick={this.clickEditButton.bind(null, 'author')}
										className={classEditAuthor} />
									{inputFieldAuthor}
								</li>
								<li  className="uk-text-truncate">
									<span className="uk-text-muted uk-margin-small-right">Источник: </span>
									 
									
									<i 
										onClick={this.clickEditButton.bind(null, 'source')}
										className={classEditSource} />
									{inputFieldSource}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</li>
		);
	}
});
// -------------------------------------------------------------------------------------

const InputField = React.createClass({

	getDefaultProps() {
		return {
			field: 'caption',
			imageId: 0,
			value: '',
			length: 60
		};
	},

	getInitialState() {
		return {
			text: this.props.value,
		};
	},

	componentDidMount() {
		$(this.getDOMNode()).focus();
	},

	changeText (evt) {
		evt.preventDefault();
		let text = evt.target.value.substr(0, this.props.length);
		this.setState({
			text: text,
		});
	},

	clickCancel (evt) {
		evt.preventDefault();

		actionsList.cancelEditField(this.props.videoId, this.props.field);
	},

	clickSaveField (evt) {

		evt.preventDefault();
		const data = {
			id: this.props.videoId,
			field: this.props.field,
			value: this.state.text,
		};
		actionsList.saveEditField(data);
		actionsList.cancelEditField(this.props.videoId, this.props.field);
	},

	render() {
		return (
				<span>
					<input
						type="text"
						autoFocus
						value={this.state.text}
						onChange={this.changeText}
						onBlur={this.clickSaveField}
						className="uk-form-small uk-form-width-large" />
					<i
						onClick={this.clickSaveField}
						className="uk-icon-check uk-margin-small-left uk-text-success" />
					<i
						onClick={this.clickCancel}
						className="uk-icon-close uk-margin-small-left uk-text-muted" />
				</span>
			);
	}
});
// -------------------------------------------------------------------------------------


module.exports = ImageRow;
