const React = require('react');
const classNames = require('classnames');

const actions = require('../stores/crudActions');


const RadioTypeArticle = React.createClass({

  propTypes: {
    type: React.PropTypes.oneOf(['article', 'news']).isRequired
  },

  getDefaultProps() {
    return {
      type: 'article'
    };
  },

  render() {
    const classesNews = classNames({
      'uk-text-muted': !!(this.props.type === 'article')
    });
    const classesArticle = classNames({
      'uk-margin-right': true,
      'uk-text-muted': !!(this.props.type === 'news')
    });
    return (
      <div className="uk-form-row">
        <div className="uk-form-controls uk-form-controls-text">
        <span className={classesArticle}>
          <input
            checked={this.props.type === 'article'}
            type="radio"
            name="type_publication"
            onChange={ () => actions.typeUpdate('article') }
          /> статья
        </span>
        <span className={classesNews}>
          <input
            checked={this.props.type === 'news'}
            type="radio"
            name="type_publication"
            onChange={ () => actions.typeUpdate('news') }
          /> новость
        </span>
        </div>
      </div>
    );
  }
});
module.exports = RadioTypeArticle;
