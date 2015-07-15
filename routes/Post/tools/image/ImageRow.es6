const React = require('react');
const classNames = require('classnames');

// const assign = require('object-assign');

const Reflux = require('reflux');

// const ImagesListStore = require('../reflux/ImagesListStore');
const ImagesListActions = require('./_actionsImagesList');



// -------------------------------------------------------------------------------------
const ImageRow = React.createClass({

	mixins: [
		
		Reflux.listenTo(ImagesListActions.cancelEditField, 'onCancelEditField'),
	],

	getDefaultProps() {
		return {
			image: {checked: false},
			align: 'center',
		};
	},

	getInitialState() {
		return {
			checked: this.props.image.checked,
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

		if (this.props.image.id === id) {
			// console.log('onCancelEdit', id, field, this.state.edit[field]);
			this.setState({
				edit: {
					[field]: false
				},
				currentEdit: 'nothing',
			});
		}
	},

	clickInsertImageToEditor (evt) {
		evt.preventDefault();

		const $editor = $("#editor");
		const center = (this.props.align === 'center') ? 'uk-flex' : '';

		let data = {
			src: this.props.image.url,
			caption: this.props.image.caption || '',
			author: this.props.image.author || '',
			source: this.props.image.source ? '/ ' + this.props.image.source : '',
			
			align: this.props.align,
			center: center,
			
			alt: '', //this.props.image.alt,

			width: this.props.image.width,
			height: this.props.image.height,

		};

		const code = $editor.getCodeByCommand( 'twimg', data);
		$editor.insertAtCursor(code);
	},

	checkImage (evt) {

		evt.preventDefault();
		ImagesListActions.checkImage(this.props.image.id, !this.state.checked);

	},

	componentWillReceiveProps(nextProps) {

		this.setState({
			checked: nextProps.image.checked
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

	clickRemoveImage (evt) {
		evt.preventDefault();
		ImagesListActions.removeImage(this.props.image.id);
	},
 
	render() {

		const image = this.props.image;

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

		const inputFieldCaption = (this.state.edit.caption) ?  <span><InputField key={this.props.image.imageName + "_caption"} imageId={this.props.image.id} field="caption" value={image.caption} length="90"/></span> : <span>{image.caption}</span>;
		const inputFieldAuthor = (this.state.edit.author) ?  <span><InputField key={this.props.image.imageName + "_author"} imageId={this.props.image.id} field="author" value={image.author} /></span> : <span>{image.author}</span>;
		const inputFieldSource = (this.state.edit.source) ?  <span><InputField key={this.props.image.imageName + "_source"} imageId={this.props.image.id} field="source" value={image.source} /></span> : <span>{image.source}</span>;

		const classFields = classNames({
			'uk-list': true,
			'uk-margin-remove': true,
			'uk-text-truncate': true,
			'uk-hidden': !(image.source || image.author || image.caption)
		});

		const classRemoveImage = classNames({
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
					className={classRemoveImage}
					onClick={this.clickRemoveImage}>
					<i 
						className="uk-icon-close" 
						title="удалить изображение из альбома"
						data-uk-tooltip />
				</div>
				<div className="uk-form">
					<div className="uk-flex uk-flex-top">
						<div className="uk-width uk-text-center" style={{width: '25px'}}>
							<input type="checkbox" checked={this.state.checked} onChange={this.checkImage} />
						</div>
						<div className="uk-width uk-text-center uk-margin-small-right uk-margin-small-left" style={{width: '100px'}}>
							<figure className="uk-thumbnail tw-cursor-pointer">
								<img
									onClick={this.clickInsertImageToEditor}
									src={image.previewUrl} 
									alt={image.imageAlt} 
									width="100" 
									height="100" 
									title="нажмите, чтобы добавить изображение в текст"
									data-uk-tooltip />
							</figure>
						</div>
						<div className="uk-flex-column">
							<div className="uk-text-truncate uk-margin-bottom">

								<span className="uk-margin-small-left uk-margin-small-right">{this.props.id + '. '}</span>
								<span className="uk-text-muted uk-hidden-small uk-margin-small-right">[{image.width}x{image.height}]</span>
								<span className="uk-text-warning">{image.originalName}</span>
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
			length: 55
		};
	},

	getInitialState() {
		return {
			text: this.props.value
		};
	},

	componentDidMount() {
		$(this.getDOMNode()).focus();
	},

	changeText (evt) {
		evt.preventDefault();
		let text = evt.target.value.substr(0, this.props.length);
		// console.log('changeText', text);
		this.setState({
			text: text,
		});
	},

	clickCancel (evt) {
		evt.preventDefault();

		ImagesListActions.cancelEditField(this.props.imageId, this.props.field);
	},

	clickSaveField (evt) {

		evt.preventDefault();
		const data = {
			id: this.props.imageId,
			field: this.props.field,
			value: this.state.text,
		};
		ImagesListActions.saveEditField(data);
		ImagesListActions.cancelEditField(this.props.imageId, this.props.field);
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
