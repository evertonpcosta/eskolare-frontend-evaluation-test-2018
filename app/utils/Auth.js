export default class Auth {

  constructor(domain) {
    this.domain = domain || 'http://localhost:3000';
    this.getProfile = this.getProfile.bind(this);
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);// handwaiving here
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  setTypeApi(typeApi) {
    // Saves profile data to localStorage
    localStorage.setItem('typeApi', JSON.stringify(typeApi));
  }

  getTypeApi() {
    // Retrieves the profile data from localStorage
    const typeApi = localStorage.getItem('typeApi');
    return typeApi ? JSON.parse(localStorage.typeApi) : {};
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('typeApi');
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      else
        return false;
    }
    catch (err) {
      return false;
    }
  }
}