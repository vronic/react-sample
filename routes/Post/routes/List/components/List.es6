const React = require('react');

const ReactRouter = require('react-router');
const { Link, State } = ReactRouter;
const Content = require('./Content');

const el = 'tw-publications';
const group = $('#' + el).data('user-group');

const items = {
  author: {
    all: 'Все'
  },
  newsman: {
    all: 'Все'
  },
  editor: {
    all: 'Все',
    toedit: 'Проверить',
    edited: 'Проверенные',
    published: 'Опубликованные'
  },
  chef: {
    all: 'Все',
    toedit: 'Проверить',
    edited: 'Опубликовать',
    published: 'Опубликованные',
    notpublished: 'Не опубликованные'
  }
};

const Tab = React.createClass({

  mixins: [ State ],

  render() {
    const isActive = this.isActive(this.props.to, this.props.params, this.props.query);
    const className = isActive ? 'uk-active' : '';
    const link = (
      <Link {...this.props} />
    );
    return <li className={className}>{link}</li>;
  }
});

const List = React.createClass({

  getLinks() {
    const links = Object.keys(items[group]).map( (item, index) => (
      <Tab
        key={'tab-' + (index + 1)}
        to={'post/list/' + item}
      >
        { items[group][item] }
      </Tab>
    ));
    return links;
  },

  render() {
      return (
        <div className="uk-clearfix">

          <ul className="uk-tab" data-uk-tab>
            {this.getLinks()}
          </ul>
          <br />
          <Content kind={this.props.params.kind} />
        </div>
      );
  }
});

export default List;
