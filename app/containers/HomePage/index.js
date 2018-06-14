/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import faker from 'faker';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Auth from '../../utils/Auth';

const authLogin = new Auth('http://localhost:3000');

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

  constructor(props, context) {
    super(props, context);
    this._columns = [
      { key: 'nome', filterable: true, sortable: true, name: 'Nome' },
      { key: 'email', filterable: true, sortable: true, name: 'E-mail' },
      { key: 'telefone', filterable: true, sortable: true, name: 'Telefone' },
    ];

    this.state = {
      login: !authLogin.loggedIn(),
      rows: this.createRows(),
      filters: {},
      sortColumn: null,
      sortDirection: null,
      nomeInput: '',
      emailInput: '',
      telefoneInput: '',
    };
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        nome: faker.fake("{{name.lastName}} {{name.firstName}}"),
        email: faker.fake("{{internet.email}}"),
        telefone: faker.fake("{{phone.phoneNumber}}"),
      });
    }

    return rows;
  };

  getRows = () => {
    return Data.Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
  };

  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  };

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });
  };

  onClearFilters = () => {
    this.setState({ filters: {} });
  };

  componentDidMount = () => {
    if (authLogin.loggedIn()) {
      this.setState({ login: true });
    }
  }

  addLine = () => {
    if (this.state.nomeInput.length === 0 || this.state.emailInput.length === 0 || this.state.telefoneInput.length === 0) {
      return;
    }
    let _rows = this.getRows();
    const incRows = { nome: this.state.nomeInput, email: this.state.emailInput, telefone: this.state.telefoneInput };
    _rows = [incRows, ..._rows];

    this.setState({
      rows: _rows,
    });
  }
  updateInputValue(name, evt) {
    this.setState({
      [name]: evt.target.value,
    });
  }
  render() {
    if (authLogin.loggedIn() === false) {
      return (<Redirect to='/login' />);
    }
    return (
      <div>
        <Container>
          <Form inline>
            <FormGroup className="mb-4 mr-sm-4 mb-sm-0">
              <Label for="nome" hidden>Nome</Label>
              <Input
                type="text"
                id="nome"
                value={this.state.nameInput}
                placeholder="Nome"
                onChange={evt => this.updateInputValue('nomeInput', evt)} />
            </FormGroup>
            {' '}
            <FormGroup className="mb-3 mr-sm-3 mb-sm-0">
              <Label for="email" hidden>Email</Label>
              <Input
                type="text"
                id="email"
                value={this.state.emailInput}
                placeholder="Email"
                onChange={evt => this.updateInputValue('emailInput', evt)}
              />
            </FormGroup>
            <FormGroup className="mb-3 mr-sm-3 mb-sm-0">
              <Label for="email" hidden>Telefone</Label>
              <Input
                type="text"
                id="telefone"
                value={this.state.telefoneInput}
                placeholder="Telefone"
                onChange={evt => this.updateInputValue('telefoneInput', evt)}
              />
            </FormGroup>
            {' '}
            <Button onClick={this.addLine}>Adicionar</Button>
          </Form>
          <ReactDataGrid
            onGridSort={this.handleGridSort}
            enableCellSelect={true}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.getSize()}
            minHeight={500}
            toolbar={<Toolbar enableFilter={true} />}
            onAddFilter={this.handleFilterChange}
            onClearFilters={this.onClearFilters} />
        </Container>
      </div>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
