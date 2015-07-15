const React = require('react');
const Select = require('react-select');

const MultiSelect = React.createClass({
  getInitialState() {
    return {
      value: ['vo']
    };
  },
  logChange(value) {
    console.log('Select value changed: ' + value);
  },
  handleSelectChange(value, values) {
    this.logChange('New value:', value, 'Values:', values);
    this.setState({ value: value });
  },

  render() {
    const ops = [
      { label: 'ВО', value: 'vo' },
      { label: 'Новости', value: 'news' },
      { label: 'Мнение', value: 'opinion' },
      { label: 'Вооружение', value: 'armor' },
      { label: 'Военный архив', value: 'history'}
    ];
    return (
      <span>
        <div>
          <label>{this.props.label}</label>
          <Select
            multi={true}
            value={this.state.value}
            noResultsText='Список пуст'
            placeholder="Выберите категорию"
            options={ops}
            onChange={this.handleSelectChange}
          />
        </div>
      </span>
    );
  }
});

module.exports = MultiSelect;
