require('uikit/css/components/upload.almost-flat.min.css');
require('uikit/css/components/placeholder.almost-flat.min.css');
require('uikit/css/components/form-file.almost-flat.min.css');

const React = require('react');
const classNames = require('classnames');

const Reflux = require('reflux');
const FileAPI = require('fileapi');

const ImagesUrl = require('./TWImagesUrl.js');
const ImagePreviewList = require('./TWImagePreviewList.js');

const ImagesActions = require('./_actionsImages'); 
const ImagesStore = require('./_storeImages'); 

// ---------------------------------------------------------------------------------------
const TWImagesLoaderPanel = React.createClass({

	mixins: [
		Reflux.connect(ImagesStore, 'images'),
		Reflux.listenTo(ImagesActions.uploadImages.completed, 'onUploadImagesCompleted')
	],
 
	getInitialState: function() {
		return {
			images: [],
			disabledButton: false
		};
	},

	componentDidMount() {
		
		this._initDrop($('#upload-drop'));
		this._initUploadDropFiles();

		this.setState({
			images: ImagesStore.getImages()
		});
	},

	onUploadImagesCompleted () {
		this.setState({
			disabledButton: false
		});
	},

	_initDrop (el) {
		let $this, dragoverClass, hasdragCls;
		dragoverClass = 'uk-dragover';
		$this = el;
		hasdragCls = false;
		
		el.on('drop', function(e) {
			e.preventDefault();
			$this.removeClass(dragoverClass);
			hasdragCls = false;
			$this.trigger('dropped.tw.upload');
		}).on('dragenter', function(e) {
			e.stopPropagation();
			e.preventDefault();
		}).on('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (!hasdragCls) {
				$this.addClass(dragoverClass);
				hasdragCls = true;
			}
		}).on('dragleave', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$this.removeClass(dragoverClass);
			hasdragCls = false;
		});
	},

	_initUploadDropFiles () {

		const self = this;
		FileAPI.event.on(document, 'drop', function(e) {
			FileAPI.getDropFiles(e, function(files) {
				self.filterFiles(files, function(list) {
					list.forEach(function(file, id) {
						ImagesActions.addImage(file, 'file');
						// console.log('dropFile', file);
					});
				});
			});
		});
	},

	filterFiles (files, cb) {
		FileAPI.filterFiles(files, function(file, info) {
			if (/^image/.test(file.type) && info) {
				return info.width > 215 && info.height > 140 && file.size < 2 * FileAPI.MB;
			}
		}, function(list, other) {
			if (other.length) {
				other.forEach(function(file) {
					if (/^image/.test(file.type)) {
						UIkit.notify(`<i class="uk-icon-warning"></i> Файл изображения ${file.name} должен быть больше 215px по ширине и высоте и меньше 2MB размером.`, 'warning');
					} else {
						UIkit.notify(`<i class="uk-icon-warning"></i> Файл ${file.name} не является изображением.`, 'danger');
					}
				});
			}
			if (list.length) {
				cb(list);
			}
		}); // end of FileAPI.filterFiles
	},

	changeInputFile (evt) {

		evt.preventDefault();

		const files = FileAPI.getFiles(evt);
		$(this.refs.inputFile.getDOMNode()).val(null);
		this.filterFiles(files, function(list) {
			list.forEach(function(file, id) {
				ImagesActions.addImage(file, 'file');
				// console.log('changeInputFile', file);
			});
		});
	},

	clickClearImages (evt) {
		evt.preventDefault();
		ImagesActions.clearImages();
	},

	clickUploadImages (evt) {
		evt.preventDefault();

		this.setState({disabledButton: true});

		ImagesActions.uploadImages();
	},

	render() {

		const classLoaderPanel = classNames({
			'uk-form': 					true,
			'uk-panel':					true,
			'uk-panel-box':				false,
			'uk-panel-box-secondary':	false,
			'uk-panel-header':			true,
			'uk-margin': 				true,
			'uk-margin-bottom-remove':  true,
			'tw-border-red':			false,
			'uk-text-center':			false,
			'uk-placeholder':			false
		});

		const classButtons = classNames({
			'uk-hidden': !this.state.images.length,
			'uk-form-row': true,
			'uk-margin-top': true,
		});

		return (
			<div className={classLoaderPanel}>
				<div id="upload-drop" className="uk-placeholder">
					<div className="uk-form-row">
						<div className="uk-form-controls">
							<div className="uk-form-file">
								<button className="uk-button uk-button-large">Выберите файл с компьютера</button>
								<input
									ref="inputFile"
									type="file"
									accept="image/*"
									multiple
									onChange={this.changeInputFile} />
							</div>
							<span className="uk-text-muted uk-margin-left"> или перетащите изображение сюда</span>
						</div>
					</div>
					<ImagesUrl />
				</div>
				<ImagePreviewList images={this.state.images}/>

				<div className={classButtons}>
					<div className="uk-form-controls">
						<button
							onClick={this.clickUploadImages}
							disabled={this.state.disabledButton}
							className="uk-button uk-button-success uk-align-right uk-margin-bottom-remove">
							Загрузить ({this.state.images.length})
						</button>
						<button
							onClick={this.clickClearImages}
							disabled={this.state.disabledButton}
							className="uk-button uk-button-link uk-align-right uk-link-muted uk-text-muted">
							очистить
						</button>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = TWImagesLoaderPanel;
