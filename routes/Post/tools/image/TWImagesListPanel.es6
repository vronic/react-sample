require('uikit/css/components/form-advanced.almost-flat.min.css');

const React = require('react');
const classNames = require('classnames');

const Reflux = require('reflux');

const ImagesListStore = require('./_storeImagesList');
const ImagesListActions = require('./_actionsImagesList');

const ImageRow = require('./ImageRow');
const Modal = require('../../../../../../../modal/modal.cjsx.coffee');


// -------------------------------------------------------------------------------------
const TWImagesListPanel = React.createClass({

	mixins: [
		
		// Reflux.connect(ImagesListStore, 'images'),
		Reflux.listenTo(ImagesListStore, 'onChangeImageListStore'),
	],

	getInitialState() {
		return {
			images: ImagesListStore.getImages(),
			checkedAll: false,
			align: 'center',
			checked: 0
		};
	},

	onChangeImageListStore(images) {

		this.setState({
			images: images
		}, () => (this.setState({checked: (this.state.images.reduce( (memo, image) => (memo + (image.checked ? 1 : 0)), 0)) }) ));
		
	},

	clickInsertChecked (evt) {
		evt.preventDefault();

		// если есть выбранные 
		if(this.state.checked){

			const checked = this.state.images.filter( (img) => img.checked );
			const $editor = $("#editor");

			checked.forEach( (image) => {

				const center = (this.state.align === 'center') ? 'uk-flex' : '';

				let data = {
					src: image.url,
					caption: image.caption || '',
					author: image.author || '',
					source: image.source ? '/ ' + image.source : '',
					
					align: this.state.align,
					center: center,

					alt: image.alt,

					width: image.width,
					height: image.height,
				};

				const code = $editor.getCodeByCommand( 'twimg', data);
				$editor.insertAtCursor(code);
			});

		}
	},

	checkAllImages (evt) {

		this.setState({
			checkedAll: !this.state.checkedAll
		}, () => ( ImagesListActions.checkAllImages(this.state.checkedAll) ) 
		);
	},

	clickAlign (align, evt) {
		this.setState({
			align: align
		});

	},

	cbRemoveCheckedImages () {
		// evt.preventDefault();
		ImagesListActions.removeCheckedImages();
	},

	clickConfirmDeleteCheckedImages (evt) {
		evt.preventDefault();

		// # show modal confirmation delete notice
		const selector = 'tw-modal';
		const modalConfirmDeleteCheckedImages = React.createElement( Modal, {
			selector: 	selector,
			title: 'Подтвердите удаление',
			buttons: {
				cancel: {
					title: 'Отменить',
				},
				submit: {
					title: 'Удалить выбранные',
					cb: 	this.cbRemoveCheckedImages,
				},
			}}
		, 'Вы действительно хотите удалить выбранные изображения?');

		React.render(modalConfirmDeleteCheckedImages, document.getElementById (selector) );
	},
 
	render() {

		const imageRows = this.state.images.map( (image, index) => {
			return <ImageRow key={image.imageName} image={image} id={index + 1} align={this.state.align}/>
		});

		const haveChecked = this.state.images.filter( (image) => (image.checked) );

		const classInsertChecked = classNames({
			'uk-margin-left': true,
			'uk-hidden': !haveChecked.length,
		});

		const style = this.state.images.length ? {resize: 'vertical', height: 250, maxHeight: 450} : {};

		const checkedImages = this.state.checked ? `(${this.state.checked})` : '';

		return (
			<div>
				<div className="uk-grid">
					<div className="uk-width-1-1">
						<div className="uk-form">
							<div className="uk-margin-left uk-form-row">
								<input 
									type="checkbox"
									checked={this.state.checkedAll && this.state.checked}
									onChange={this.checkAllImages} />
							
								<span className={classInsertChecked}>
									<button
										onClick={this.clickInsertChecked}
										className="uk-button uk-button-success"
										type="button"
										title="вставить выбранные изображения в текст"
										data-uk-tooltip>
										<i className="uk-icon-photo" /> 
										<span className="uk-hidden-small uk-margin-small-left">вставить выбранные</span>
										<span className="uk-margin-small-left">{checkedImages}</span>
									</button>
								</span>
								<span className={classInsertChecked}>
									<button
										onClick={this.clickConfirmDeleteCheckedImages}
										className="uk-button"
										type="button"
										title="удалить выбранные изображения из альбома"
										data-uk-tooltip>
										<i className="uk-icon-trash-o" /> 
										<span className="uk-hidden-small  uk-margin-small-left">удалить выбранные</span>
										<span className="uk-margin-small-left">{checkedImages}</span>
									</button>
								</span>
								<div data-uk-button-radio className="uk-button-group uk-align-right uk-margin-remove uk-margin-large-right">
									<button onClick={this.clickAlign.bind(null, 'left')} className="uk-button"><i className="uk-icon-align-left" /></button>
									<button onClick={this.clickAlign.bind(null, 'center')} className="uk-button"><i className="uk-icon-align-center" /></button>
									<button onClick={this.clickAlign.bind(null, 'right')} className="uk-button"><i className="uk-icon-align-right" /></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="uk-scrollable-box uk-margin-small-top" style={style}>
					<ul className="uk-list uk-list-striped">
						{imageRows}
					</ul>
				</div>
			</div>
		);
	}
});
// -------------------------------------------------------------------------------------

module.exports = TWImagesListPanel;
