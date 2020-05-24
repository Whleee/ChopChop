import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import auth0Client from '../Auth';

const styles = {
  ChopChopHead: {
    fontSize: '100px',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },

  LogInOut: {
    fontSize: '50px',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },

  UserInfo: {
    fontSize: '30px',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  }
};

function NavBar(props) {
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace('/');
  };

  return (
  <nav className="navbar navbar-dark bg-info fixed-top">
      <Link className="navbar-brand" style = {styles.ChopChopHead} to="/">
        ChopChop
      </Link>
      {
        !auth0Client.isAuthenticated() &&
        <button className="btn btn-light" style = {styles.LogInOut} onClick={auth0Client.signIn}>Sign In</button>
      }
      {
        auth0Client.isAuthenticated() &&
        <div>
          <label className="mr-2 text-white" style = {styles.UserInfo}>{auth0Client.getProfile().name}</label>
          <button className ="btn btn-dark" style = {styles.LogInOut}>History</button>
          <button className ="btn btn-success" style = {styles.LogInOut}>Favourites</button>
          <button className="btn btn-dark" style = {styles.LogInOut} onClick={() => {signOut()}}>Sign Out</button>
        </div>
      }
    </nav>
  );
}

export default withRouter(NavBar);
