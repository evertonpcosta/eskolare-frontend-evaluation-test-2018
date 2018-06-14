import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import A from './A';
import Banner from './banner.jpg';
import messages from './messages';
import Auth from '../../utils/Auth';

const authLogin = new Auth('http://localhost:3000');


class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <A href="https://twitter.com/mxstbr">
              <img width="40%" src={Banner} alt="react-boilerplate - Logo" />
            </A>
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/"><FormattedMessage {...messages.home} /></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href={authLogin.loggedIn() === true ? '/logout' : '/login'}>{authLogin.loggedIn() === true ? <FormattedMessage {...messages.logout} /> : <FormattedMessage {...messages.login} />}</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
