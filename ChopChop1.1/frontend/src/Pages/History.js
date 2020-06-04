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

  handleDelete = (e) => {
    const list = document.querySelector("#book-list ul");

    if (e.target.className == "delete") {
      const li = e.target.parentElement;
      list.removeChild(li);
    }
  };

  handleAdd = (e) => {
    e.preventDefault();

    const list = document.querySelector("#book-list ul");
    const forms = document.forms;

    const addForm = forms["add-book"];

    //creating elements
    const value = addForm.querySelector('input[type = "text"]').value;
    const li = document.createElement("li");
    const histItem = document.createElement("span");
    const deleteBtn = document.createElement("span");

    //adding text content
    histItem.textContent = value;
    deleteBtn.textContent = "delete";

    //tagging classes to the items
    histItem.classList.add("name");
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", this.handleDelete);

    //appending to the domm
    li.appendChild(histItem);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  };

  handleSearch = (e) => {
    const list = document.querySelector("#book-list ul");
    const forms = document.forms;
    const searchBar = forms["search-books"].querySelector("input");

    searchBar.addEventListener("keyup", (e) => {
      const term = e.target.value.toLowerCase();
      const books = list.getElementsByTagName("li");
      Array.from(books).forEach((book) => {
        const title = book.firstElementChild.textContent;
        if (title.toLowerCase().indexOf(e.target.value) != -1) {
          book.style.display = "block";
        } else {
          book.style.display = "none";
        }
      });
    });
  };

  render() {
    return (
      <div style={{ paddingTop: "40px" }}>
        <Link to="./">Back to Home</Link>
        <div id="wrapper">
          <header>
            <div id="page-banner">
              <h1 class="title">History Page</h1>
              <form id="search-books">
                <input
                  type="text"
                  placeholder="Search History..."
                  onChange={this.handleSearch}
                />
              </form>
            </div>
          </header>
          <div id="book-list">
            <h2 class="title">Recently Visited:</h2>
            <ul>
              <li>
                <span class="name">Mcdonalds</span>
                <span class="delete" onClick={this.handleDelete}>
                  delete
                </span>
              </li>
              <li>
                <span class="name">KFC</span>
                <span class="delete" onClick={this.handleDelete}>
                  delete
                </span>
              </li>
              <li>
                <span class="name">East Coast Park</span>
                <span class="delete" onClick={this.handleDelete}>
                  delete
                </span>
              </li>
              <li>
                <span class="name">Changi Beach</span>
                <span class="delete" onClick={this.handleDelete}>
                  delete
                </span>
              </li>
            </ul>
          </div>
          <form id="add-book">
            <input type="text" placeholder="Add a Place..." />
            <button onClick={this.handleAdd}>Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default History;
