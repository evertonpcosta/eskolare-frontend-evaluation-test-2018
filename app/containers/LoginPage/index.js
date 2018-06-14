import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
} from 'reactstrap';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Auth from '../../utils/Auth';

const authLogin = new Auth('http://localhost:3000');

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      login: false,
    };
  }

  responseFacebook = (response) => {
    console.log(response);
    if (response.name) {
      if (!authLogin.loggedIn()) {
        authLogin.setProfile(response);
        authLogin.setToken(response.acessToken);
        authLogin.setTypeApi('facebook');
        this.setState({
          login: true,
        });
      }
    }
  }

  responseGoogle = (response) => {
    console.log(response.tokenObj);
    if (response.tokenObj) {
      if (!authLogin.loggedIn()) {
        authLogin.setProfile(response);
        authLogin.setToken(response.tokenObj.access_token);
        authLogin.setTypeApi('google');
        this.setState({
          login: true,
        });
      }
    }
  }

  componentDidMount = () => {
    if (authLogin.loggedIn()) {
      this.setState({ login: true });
    }
  }

  render() {
    console.log(this.state.login);
    if (this.state.login === true) {
      return (<Redirect to='/' />);
    }
    return (
      <div>
        <Row>
          <Col sm="6" md={{ size: 10, offset: 2 }}>
            <Card style={{
              border: '1px solid black',
              width: '400px',
              position: 'center !important',
            }}>
              <CardHeader className="text-center">Login</CardHeader>
              <CardBody className="text-center">
                <FacebookLogin
                  appId="1439056759533424"
                  autoLoad={this.state.login}
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                  size="small"
                  cssClass="kep-login-facebook"
                  textButton="Login Facebook"
                />
              </CardBody>
              <CardBody className="text-center">
                <GoogleLogin
                  clientId="946556810592-6kg8o64tlf25rgjmgs8g9m45im769cda.apps.googleusercontent.com"
                  buttonText="Login Google"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;