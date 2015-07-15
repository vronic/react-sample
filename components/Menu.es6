const React = require('react');
const ReactRouter = require('react-router');
const { Link, State } = ReactRouter;

const Pill = React.createClass({
  mixins: [ State ],
  render() {
    const isActive = this.isActive(this.props.to, this.props.params, this.props.query);
    const className = isActive ? 'uk-active' : '';
    const link = (
      <Link {...this.props} className="uk-text-bold" />
    );

    return <li className={className}>{link}</li>;
  }
});

const Menu = React.createClass({
  render() {
    return (
      <div>
        <ul className="uk-subnav uk-subnav-pill">
          <Pill to="post/list/all">Публикации</Pill>
          <Pill to="post/list/edited">Избранное</Pill>
          <Pill to="notification/list/all">Уведомления</Pill>
          <Pill to="post/list/published">Профиль</Pill>
          <Pill to="post/new"><i className="uk-icon-file-text-o uk-margin-small-right" /> Добавить публикацию</Pill>
        </ul>
      </div>
    );
  }
});

module.exports = Menu;
