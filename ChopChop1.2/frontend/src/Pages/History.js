import { Link } from "react-router-dom";
import React, { Component } from "react";
import "./Styles.css";

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      History: null,
    };
  }

  render() {
    return (
      <div style={{ paddingTop: "40px" }}>
        <Link to="./">Back to Home</Link>
        <div id="wrapper">
          <header>
            <div id="page-banner">
              <h1 class="title">History Page</h1>
              <form id="search-books">
                <input type="text" placeholder="Search History..." />
              </form>
            </div>
          </header>
          <div id="book-list">
            <h2 class="title">Recently Visited:</h2>
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
            <label for="hide">Hide History</label>
            <input type="text" placeholder="Add a Place..." />
            <button>Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default History;
