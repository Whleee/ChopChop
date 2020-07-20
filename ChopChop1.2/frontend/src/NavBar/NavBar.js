import React from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "../Auth";
import { Route } from "react-router-dom";

const styles = {
  ChopChopHead: {
    fontSize: "65px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    margin: "auto",
  },

  LogInOut: {
    fontSize: "40px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },

  UserInfo: {
    fontSize: "40px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },

  ButtonPosition: {
    paddingLeft: "30px",
  },

  ButtonPositionEnd: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },

  ButtonPositionOut: {
    paddingLeft: "100px",
    fontSize: "40px",
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
        <div>
          <Link
            className="navbar-brand"
            style={styles.ButtonPosition}
            to="/testpage"
          >
            <button className="btn btn-warning" style={styles.LogInOut}>
            Search
            </button>
          </Link>
          <button
            className="btn btn-light"
            style={styles.LogInOut}
            onClick={auth0Client.signIn}
          >
            Sign In
          </button>
        </div>
      )}
      {auth0Client.isAuthenticated() && (
        <div>
          <label className="mr-2 text-white" style={styles.UserInfo}>
            {auth0Client.getProfile().name}
          </label>
          <Link
            className="navbar-brand"
            style={styles.ButtonPosition}
            to="/testpage"
          >
            <button className="btn btn-warning" style={styles.LogInOut}>
              Search
            </button>
          </Link>
          <Link
            className="navbar-brand"
            style={styles.ButtonPosition}
            to="/History"
          >
            <button className="btn btn-light" style={styles.LogInOut}>
              History
            </button>
          </Link>
          <Link
            className="navbar-brand"
            style={styles.ButtonPosition}
            to="/Favourites"
          >
            <button className="btn btn-light" style={styles.LogInOut}>
              Favourites
            </button>
          </Link>

          <Link
            className="navbar-brand"
            style={styles.ButtonPositionEnd}
            to="/Blacklist"
          >
            <button className="btn btn-dark" style={styles.LogInOut}>
              Blacklist
            </button>
          </Link>
          <button style={styles.ButtonPositionOut}
            className="btn btn-info"
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
