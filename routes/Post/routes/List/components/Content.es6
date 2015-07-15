const React = require('react');
const Reflux = require('reflux');

const store = require('../../../stores/listStore');
const actions = require('../../../stores/listActions');
import { Navigation, Link } from 'react-router';
const moment = require('moment');
moment.locale('ru');


const Content = React.createClass({
	mixins: [
		Navigation,
		Reflux.connect(store, 'publications')
	],

	propTypes: {
		kind: React.PropTypes.oneOf(['all', 'toedit', 'edited', 'published', 'notpublished'])
	},

	getDefaultProps() {
		return {
			kind: 'all'
		};
	},

	getInitialState() {
		return {
			publications: []
		};
	},

	componentWillMount() {
		// если в сторе нет публикаций - загрузим их с сервера, иначе - state из стора
		if(!store.getPublications().length){
			actions.loadPublications(this.props.kind);
		} else {
			this.setState({
				publications: store.getPublications()
			});
		}
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.kind !== this.props.kind){
			actions.loadPublications(nextProps.kind);
		}
	},

	getHeader() {
		const header = store.getHeader();
		const keys = Object.keys(header);
		const columns = keys.map( (key, index) => (<th key={'head-' + (index + 1)}>{ header[key] }</th>) );

		return (<tr>{columns}</tr>);
	},

	getRows() {
		const rows = this.state.publications.map( (row, index) => (this.getRow(row, index)) );
		return rows;
	},

	getRow(row, index){
		const header = store.getHeader();
		const keys = Object.keys(header);
		const rowEl = keys.map( (key, i) => this.getCell(row, key, index, i) );

		return <tr key={'row-' + (index + 1) }>{rowEl}</tr>;
	},

	getCell(row, key, index, i) {

		let value = row[key];
		let cell = <td key={'col-' + (i + 1)}>{ value }</td>;

		switch(key){
			case 'index':
				value = (index + 1) + '.';
				cell = <td key={'col-' + (i + 1)}>{ value }</td>;
				break;
			case 'created':
				value = moment.unix(row[key]).fromNow();
				cell = <td key={'col-' + (i + 1)} title={moment.unix(row[key]).format('LLL')} data-uk-tooltip>{ value }</td>;
				break;
			case 'title':
			case 'author':
				break;
			case 'status':
				const status = <div title='просмотреть' data-uk-tooltip><Link to={ 'post/preview/' + row.id } className={`tw-color-${row.status}`}>{row.statusName}</Link></div>;
				cell = (row.published) ? <td className={'tw-color-' + row.status} key={'col-' + (i + 1)} title={ moment.unix(row.published).format('LLL') } data-uk-tooltip>{ status }</td> : <td className={'tw-color-' + row.status} key={'col-' + (i + 1)}>{ status}</td>;
				break;
			default:
				break;
		}

		return cell;
	},

	render () {

		const header = this.getHeader();
		const rows = this.getRows();

		return (
			<div>
				<div className='uk-overflow-container'>
					<table className='uk-table uk-table-hover uk-table-striped'>
						<thead>
							{ header }
						</thead>
						<tbody>
							{rows}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
});

module.exports = Content;
