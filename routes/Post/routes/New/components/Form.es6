
const React = require('react');
const classNames = require('classnames');

require('babel/polyfill'); // polyfill is required

var Textarea = require('react-textarea-autosize');

const actions = require('../../../stores/crudActions');

const Modal = require('../../../tools/modal');

const ImagesLoader = require('../../../tools/image/TWImagesLoader');
const VideoPanel = require('../../../tools/video/VideoPanel');

const RadioTypeArticle = require('../../../tools/radioType');
const twbbOptions = require('../../../tools/twbbOptions');

const labels = require('../../../tools/formLabels');
const status = require('../../../tools/formStatus');

const proptypesArticle = require('../../../tools/proptypesArticle');

const assign = require('object-assign');
const Reflux = require('reflux');

const Select = require('./Select');

import { Navigation, TransitionHook } from 'react-router';

// ===============================================================================
const Form = React.createClass({

  mixins: [
    Navigation,
    TransitionHook,

    Reflux.listenTo(actions.saveForm.completed, 'onSaveFormCompleted'),
    Reflux.listenTo(actions.generateFields.completed, 'onGenerateFieldsCompleted')
  ],

  getInitialState() {
    return {
      article: this.props.article,
      isViewDopInfo: false,
      isViewMetaTags: false,
      submit: true, // кнопки формы доступны
      saved: true // при загрузке данных в форму изменений еще не произошло
    };
  },

  propTypes: proptypesArticle,

  componentWillReceiveProps(nextProps) {
    if (nextProps.article.status !== 'news') {
      this.setState(
        (state) => (state.article = nextProps.article),
        () => $('#editor').htmlcode(nextProps.article.textHTML)
      );
    }
  },

  componentDidMount() {
    // инициализируем редактор с конфигом для роли текущего юзера
    $('#editor').twbb(twbbOptions[this.props.article.actor]);
    $('#editor').htmlcode(this.props.article.textHTML);

    $('#editor').data('wbb').$body.on('input propertychange', this._onChangeEditorHTML);

    // обновим хеш для загрузчиков изображений и видео
    $('#tw-publications').attr('media-index', this.props.article.hash);


    // var stream = new EventSource('/sse.php');

    // stream.onmessage = (event) => console.log('onmessage', event.data);
    // stream.onopen = (event) => console.log('onopen', event);
    // stream.onerror = (event) => console.log('onerror', event);
  },
  _onChangeEditorHTML(evt) {
    this.setState(
      (state) => {
        state.article.textHTML = evt.target.innerHTML;
        state.saved = false; // данные изменились - нужно сохранять
      },
      () => {} // actions.updateArticle(this.state.article)
    );
  },

  componentWillUnmount() {
    $('#editor').data('wbb').$body.off('input propertychange');
  },

  substr(fieldName, length, evt) {
    evt.preventDefault();

    const value = evt.target.value;
    this.setState(
      (state) => {
        state.article[fieldName] = value.substr(0, length);
        state.saved = false; // данные изменились - нужно сохранять
      },
      () => {}
    );
  },

  validateFields() {
    return !!(this.state.article.title !== '');
  },

  onSaveFormCompleted(success) {
    if (success) {
      this.setState(
        { saved: true },
        () => this.transitionTo('post/list/all')
      );
    }
  },

  routerWillLeave(nextState, router) {
    if (!this.state.saved) {
      router.abort('form not saved yet!');
      this.showModalAlert('Надо сохранить данные!');
    }
  },

  showModalAlert(title) {
    const selector = 'tw-modal';
    const modalAlert = React.createElement( Modal, {
      selector: selector,
      title: title,
      type: 'alert'
    });

    React.render(modalAlert, document.getElementById(selector) );
  },

  onClickSubmit(statusName, evt) {
    evt.preventDefault();

    // проверим поля формы перед сохранением
    if (this.validateFields()) {
      // установим текущие значения текста в редакторе bbcode и  htmlcode для сохранения
      this.setState(
        (state) => {
          state.submit = false;
          // биндим разные статусы в зависимости кнопки нажатия ( сохранить или опубликовать),
          // от топ-роли (актора) и типа публикации (article || news)
          state.article.status = statusName;
          state.article.textHTML = $('#editor').htmlcode();
        },
        // скомандуем сохранить данные статьи
        () => {
          actions.saveForm(this.state.article);
        }
      );
    }
  },

  onClickCancel(evt) {
    evt.preventDefault();
    this.setState(
      (state) => {
        state.submit = true;
        state.saved = true;
      },
      () => actions.clearArticle()
    );
  },

  onClickDopInfo(evt) {
    evt.preventDefault();
    this.setState({
      isViewDopInfo: !this.state.isViewDopInfo
    });
  },

  onClickMetaTags(evt) {
    evt.preventDefault();
    this.setState({
      isViewMetaTags: !this.state.isViewMetaTags
    });
  },

  onShowImagesLoader(evt) {
    evt.preventDefault();

    this._renderComponent(ImagesLoader, 'tw-container');
  },

  onShowVideoPanel(evt) {
    evt.preventDefault();
    this._renderComponent(VideoPanel, 'tw-container');
  },

  onGenerateFields(evt) {
    evt.preventDefault();

    // проверить что заголовок и текст статьи уже есть
    if (this.state.article.title.length && this.state.article.textHTML.length) {
      actions.generateFields(this.state.article.title, this.state.article.textHTML);
    } else {
      this.showModalAlert('Для заполнения полей нужен заголовок и текст статьи!');
    }
  },

  onGenerateFieldsCompleted(data) {
    const fields = Object.keys(data);
    if (fields) {
      this.setState((state) => {
        fields.forEach( (field) => state.article[field] = data[field]);
        state.isViewMetaTags = true;
      });
    }
  },

  // onClickSourceLoader (evt) {
  //  evt.preventDefault();
  //  console.log('onClickSourceLoader', evt.target);
  // },

  // onClickPollLoader (evt) {
  //  evt.preventDefault();
  //  console.log('onClickPollLoader', evt.target);
  // },

  _renderComponent(component, container) {
    const el = React.createElement(component, {
      container: container
    });
    React.render(el, document.getElementById(container));
  },

  render() {
    const article = this.state.article;
    const label = labels[article.actor][article.status];

    const textareaStyle = {
      resize: 'vertical',
      minHeight: '250px'
    };

    const classDopInfo = classNames({
      'uk-hidden': !this.state.isViewDopInfo,
      'uk-form-row': true
    });

    const classMetaTags = classNames({
      'uk-hidden': !this.state.isViewMetaTags,
      'uk-form-row': true
    });

    const commonButtonClass = {
      'uk-disabled': !this.state.submit,
      'uk-button': true,
      'uk-margin-right': true
    };
    const classButtonSave = classNames(commonButtonClass);
    const classButtonSubmit = classNames(assign(commonButtonClass, {'uk-button-success': true}));
    const classButtonPreview = classNames({
        'uk-button': true,
        'uk-margin-right': true,
        'uk-hidden': false // article.status === 'new'
      });

    const nameDopInfo = !this.state.isViewDopInfo ? 'показать дополнительные поля' : 'cкрыть дополнительные поля';
    const nameMetaTags = !this.state.isViewMetaTags ? 'показать чпу и мета-теги' : 'cкрыть чпу и мета-теги';

    let radioType = ''; // (this.props.actor === 'newsman') ? <RadioTypeArticle type={article.type} /> : '';
    let annotation = '';
    let humanUrl = '';
    let metaTitle = '';
    let metaKeywords = '';
    let metaDescription = '';
    let categories = '';
    let viewMetaTags = '';
    let generateFields = '';

    switch (article.actor) {
      case 'newsman':
        radioType = <RadioTypeArticle type={article.type} />;
        if (article.type === 'article') break;

      case 'chef':
        humanUrl = (
            <div key="human-url-feild" className="uk-form-row" >
              <label className="uk-form-label" for="">ЧПУ</label>
              <div className="uk-form-controls">
                <input
                  onChange={this.substr.bind(this, 'humanUrl', 250)}
                  value={article.humanUrl}
                  type="text"
                  placeholder="Введите ЧПУ"
                  className="uk-width-medium-1-1"
                  required
                />
              </div>
            </div>
          );

        metaTitle = (
            <div key="meta-title-feild" className="uk-form-row">
              <label className="uk-form-label" for="">Мета-тег title</label>
              <div className="uk-form-controls">
                <input
                  onChange={this.substr.bind(this, 'metaTitle', 65)}
                  value={article.metaTitle}
                  type="text"
                  placeholder="Введите значение мета-тега title"
                  className="uk-width-medium-1-1"
                  required
                />
              </div>
            </div>
          );
        metaKeywords = (
            <div key="meta-keywords-feild" className="uk-form-row">
              <label className="uk-form-label" for="">Мета-тег keywords</label>
              <div className="uk-form-controls">
                <input
                  onChange={this.substr.bind(this, 'metaKeywords', 175)}
                  value={article.metaKeywords}
                  type="text"
                  placeholder="Введите значение мета-тега keywords"
                  className="uk-width-medium-1-1"
                  required
                />
              </div>
            </div>
          );
        metaDescription = (
            <div key="meta-description-feild" className="uk-form-row">
              <label className="uk-form-label" for="">Мета-тег description</label>
              <div className="uk-form-controls">
                <input
                  onChange={this.substr.bind(this, 'metaDescription', 175)}
                  value={article.metaDescription}
                  type="text"
                  placeholder="Введите значение мета-тега description"
                  className="uk-width-medium-1-1"
                  required
                />
              </div>
            </div>
          );
        categories = (
            <div key="categories-feild" className="uk-form-row">
              { /* <input
                onChange={this.substr.bind(this, 'categories', 175)}
                value={article.categories}
                type="text"
                placeholder="Категории для публикации"
                className="uk-width-medium-1-1"
                required
              /> */}
              <label className="uk-form-label" for="">Категории для публикации</label>
              <div className="uk-form-controls">
                <Select />
              </div>
            </div>
          );

        viewMetaTags = (
            <span key="view-meta-tags"
              onClick={this.onClickMetaTags}
              className="uk-link uk-link-muted uk-text-muted uk-margin-bottom"
            >{nameMetaTags}
            </span>
          );

      case 'editor':
        annotation = (
            <div key="annotation-feild" className="uk-form-row  uk-margin-bottom">
              <label className="uk-form-label" for="">Аннотация</label>
              <div className="uk-form-controls">
                <Textarea
                  onChange={this.substr.bind(this, 'annotation', 1200)}
                  value={article.annotation}
                  placeholder="Заполните аннотацию"
                  className="uk-width-medium-1-1"
                  style={{resize: 'vertical', maxHeight: '250px'}}
                />
              </div>
            </div>
          );
        generateFields = (
            <div key="generate-fields" className="uk-form-row">
              <span
                onClick={this.onGenerateFields}
                className="uk-link uk-link-muted uk-text-muted uk-margin-bottom uk-margin-right"
                title={label.buttonGenerate.title}
                data-uk-tooltip
              >{ label.buttonGenerate.name}
              </span>
              {viewMetaTags}
            </div>
          );
        break;

      default:
        break;

    }

    return (
      <div>
        <h1 className="uk-margin-small-left">{ label.legend }</h1>
        { /* <ToolsPanel container="tw-container" buttonPreview={label.buttonPreview} post="current" /> */}

        <div
          onClick={this.onShowImagesLoader}
          className="uk-icon-button uk-icon-file-image-o uk-text-warning uk-margin-right tw-cursor-pointer"
          title="Изображения"
          data-uk-tooltip
        />

        <div
          onClick={this.onShowVideoPanel}
          className="uk-icon-button uk-icon-file-video-o uk-text-warning uk-margin-right tw-cursor-pointer"
          title="Видео"
          data-uk-tooltip
        />
        <div
          onClick={ () => this.transitionTo('post/preview/current') }
          className={classButtonPreview}
          title={label.buttonPreview.title}
          data-uk-tooltip
        >{ label.buttonPreview.name}
        </div>

        <div id="tw-container" className="uk-margin"/>
        <div className="uk-form uk-form-stacked">
          <fieldset data-uk-margin >

            {radioType}

            <div className="uk-form-row uk-margin-bottom">
              <label className="uk-form-label" for="">Заголовок</label>
              <div className="uk-form-controls">
                <input
                  autoFocus
                  onChange={this.substr.bind(this, 'title', 150)}
                  value={article.title}
                  type="text"
                  placeholder="Заголовок"
                  className="uk-width-medium-1-1"
                  required
                />
              </div>
            </div>

            {annotation}
            {generateFields}

            <div className={classMetaTags}>
              {humanUrl}
              {metaTitle}
              {metaKeywords}
              {metaDescription}
            </div>

            {categories}

            <div className="uk-form-row">
              <label className="uk-form-label" for="">Текст публикации</label>
              <div className="uk-form-controls">
              <textarea
                id="editor"
                placeholder="Текст публикации"
                defaultValue={article.textBBCode}
                style={textareaStyle}
                className="uk-width-1-1"
              />
              </div>
            </div>
            <div className="uk-form-row">
              <div
                onClick={this.onClickDopInfo}
                className="uk-link uk-link-muted uk-text-muted uk-margin-bottom">
              {nameDopInfo}
              </div>
            </div>

            <div className={classDopInfo}>
              <div className="uk-form-row">
                <label className="uk-form-label" for="">Автор статьи</label>
                <div className="uk-form-controls">
                  <input
                    type="text"
                    placeholder="Введите имя автора статьи"
                    value={article.srcAuthor}
                    onChange={this.substr.bind(this, 'srcAuthor', 65)}
                    className="uk-width-1-1"
                  />
                </div>
              </div>

              <div className="uk-form-row">
                <label className="uk-form-label" for="">Ссылка на первоисточник</label>
                <div className="uk-form-controls">
                  <input
                    type="text"
                    placeholder="Введите ссылку на первоисточник"
                    value={article.srcOrigin}
                    onChange={this.substr.bind(this, 'srcOrigin', 120)}
                    className="uk-width-1-1"
                  />
                </div>
              </div>

              <div className="uk-form-row">
                <label className="uk-form-label" for="">Перевод</label>
                <div className="uk-form-controls">
                  <input
                    type="text"
                    placeholder="Перевод"
                    value={article.srcTranslate}
                    onChange={this.substr.bind(this, 'srcTranslate', 120)}
                    className="uk-width-1-1"
                  />
                </div>
              </div>

              <div className="uk-form-row">
                <label className="uk-form-label" for="">Использованы изображения</label>
                <div className="uk-form-controls">
                  <input
                    type="text"
                    placeholder="Использованы изображения"
                    value={article.srcPhoto}
                    onChange={this.substr.bind(this, 'srcPhoto', 120)}
                    className="uk-width-1-1"
                  />
                </div>
              </div>
            </div>

            <br />
            <div className="uk-form-row uk-panel uk-panel-box">
              <div className="uk-form-controls">
                <button
                  className={classButtonSave}
                  onClick={ () => this.goBack() }
                  disabled={!this.state.submit}
                  title={label.buttonCancel.title}
                  data-uk-tooltip
                >{label.buttonCancel.name}
                </button>
                <button
                  className={classButtonSave}
                  onClick={this.onClickSubmit.bind(this, status[article.actor][article.type].save)}
                  disabled={!this.state.submit}
                  title={label.buttonSave.title}
                  data-uk-tooltip
                >{label.buttonSave.name}
                </button>
                <button
                  className={classButtonSubmit}
                  onClick={this.onClickSubmit.bind(this, status[article.actor][article.type].submit)}
                  disabled={!this.state.submit}
                  title={label.buttonPublish.title}
                  data-uk-tooltip
                >{label.buttonPublish.name}
                </button>
              </div>
            </div>

          </fieldset>
        </div>
        <div id="tw-modal" />
      </div>
    );
  }
});

module.exports = Form;
