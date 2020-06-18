import React from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "../Auth";
import Favourites from "../Pages/Favourites";
import History from "../Pages/History";
import { Route } from "react-router-dom"

const styles = {
  ChopChopHead: {
    fontSize: "65px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },

  LogInOut: {
    fontSize: "35px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },

  UserInfo: {
    fontSize: "30px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
};

function NavBar(props) {
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace("/");
  };

  return (
    <nav className="navbar navbar-dark bg-info fixed-top">
      <Link className="navbar-brand" style={styles.ChopChopHead} to="/">
        ChopChop
      </Link>
      {!auth0Client.isAuthenticated() && (
        <button
          className="btn btn-light"
          style={styles.LogInOut}
          onClick={auth0Client.signIn}
        >
          Sign In
        </button>
      )}
      {auth0Client.isAuthenticated() && (
        <div>
          <label className="mr-2 text-white" style={styles.UserInfo}>
            {auth0Client.getProfile().name}
          </label>
          <Link className="navbar-brand" style={styles.ChopChopPages} to="/History">
            <button className="btn btn-dark" style={styles.LogInOut}>History</button>
          </Link>
          <Link className="navbar-brand" style={styles.ChopChopPages} to="/Fav">
            <button className="btn btn-success" style={styles.LogInOut}>Favourites</button>
          </Link>
          <button
            className="btn btn-light"
            style={styles.LogInOut}
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default withRouter(NavBar);
