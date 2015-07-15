
const React = require('react');


const ModalUIkit = React.createClass({

	propTypes: {
		title: React.PropTypes.string.isRequired,
		selector: React.PropTypes.string.isRequired,
		type: React.PropTypes.oneOf(['alert', 'confirm', 'prompt', 'blockUI']).isRequired,

		buttons: React.PropTypes.shape({
			cancel: React.PropTypes.shape({
				title: React.PropTypes.string
			}),
			submit: React.PropTypes.shape({
				title: React.PropTypes.string,
				cb: React.PropTypes.func
			}),
			ок: React.PropTypes.shape({
				title: React.PropTypes.string
			})
		})
	},

	getInitialState() {
		return {
			modal: null
		};
	},

	getDefaultProps() {
		return {
			title: '',
			selector: 'tw-modal',
			type: 'alert',
			buttons: {
				ok: {
					title: 'Закрыть'
				}
			}
		};
	},

	componentDidMount() {

		const modal = UIkit.modal(this.getDOMNode());
		modal.show();

		// console.log('modal componentDidMount', modal.element.parentNode, this.getDOMNode(), this.props);

		this.setState({ modal: modal });
	},

	// добавим обработчик на событие hide.uk.modal
	componentWillMount() {
		const selector = this.props.selector;
		$(document).on(
			'hide.uk.modal',
			() => React.unmountComponentAtNode(document.getElementById(selector))
		);
	},

	//удалим обработчик hide.uk.modal
	componentWillUnmount() {
		$(document).off('hide.uk.modal');
	},

	clickCancel (evt) {
		evt.preventDefault();
		this.state.modal.hide();
	},

	clickSubmit(evt) {
		evt.preventDefault();
		if (this.props.buttons.submit.cb) {
			this.state.modal.hide();
			this.props.buttons.submit.cb();
		}
	},

	render() {

		const buttons = [];

		if (this.props.buttons) {

			if (this.props.buttons.cancel) {
				if (this.props.buttons.cancel.title) {
					buttons.push(
						<button
							key='tw-btn-cancel'
							onClick={this.clickCancel}
							type='button'
							className='uk-button uk-margin-small-right'
						>{this.props.buttons.cancel.title}
						</button>
					);
				}
			}
			if (this.props.buttons.submit) {
				if (this.props.buttons.submit.title) {
					buttons.push(
						<button
							onClick={this.clickSubmit}
							type='button'
							className='uk-button uk-button-primary'
						>{this.props.buttons.submit.title}
						</button>
					);
				}
			}
			if (this.props.buttons.ok) {
				if (this.props.buttons.ok.title) {
					buttons.push(
						<button
							key='tw-btn-cancel'
							onClick={this.clickCancel}
							type='button'
							className='uk-button uk-margin-small-right'
						>{this.props.buttons.ok.title}
						</button>
					);
				}
			}
		}

		const divHeader = (this.props.title) ? <div className='uk-modal-header'><h3>{this.props.title}</h3></div> : '';
		const divButtons = (buttons.length) ? <div className='uk-modal-footer uk-text-right'>{buttons}</div> : '';

		return (
			<div className='uk-modal'>
				<div className='uk-modal-dialog'>
					<a className='uk-modal-close uk-close'></a>

					{ divHeader }

					<br />
					{this.props.children}
					<br />

					{ divButtons }
				</div>
			</div>

		); // return
	}
});

module.exports = ModalUIkit;

