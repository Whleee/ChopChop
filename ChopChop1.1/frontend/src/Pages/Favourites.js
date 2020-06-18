import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Styles.css";

class Favourites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Favourites: null,
    };
  }

  render() {
    return (
      <div style={{ paddingTop: "40px" }}>
        <Link to="./">Back to Home</Link>
        <div id="wrapper">
          <header>
            <div id="page-banner">
              <h1 class="title">Favourites Page</h1>
              <form id="search-books">
                <input type="text" placeholder="Search Favourites..." />
              </form>
            </div>
          </header>
          <div id="book-list">
            <h2 class="title">Recently Liked:</h2>
            <ul>
              <li>
                <span class="name">Mcdonalds</span>
                <span class="delete">delete</span>
              </li>
              <li>
                <span class="name">KFC</span>
                <span class="delete">delete</span>
              </li>
              <li>
                <span class="name">East Coast Park</span>
                <span class="delete">delete</span>
              </li>
              <li>
                <span class="name">Changi Beach</span>
                <span class="delete">delete</span>
              </li>
            </ul>
          </div>
          <form id="add-book">
            <input type="checkbox" id="hide" />
            <label for="hide">Hide Favourites</label>
            <input type="text" placeholder="Add a Place..." />
            <button>Add</button>
          </form>
        </div>
        <script src="PageApp.js" />;
      </div>
    );
  }
}

export default Favourites;
