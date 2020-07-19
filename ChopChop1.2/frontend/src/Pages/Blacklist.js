import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Styles.css";
import firebase from "../firebase";

const db = firebase.firestore();

class Blacklist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Blacklist: null,
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  //storing data
  handleStore = (e) => {
    e.preventDefault();

    const list = document.querySelector("#book-list ul");
    const forms = document.forms;

    const catForm = forms["add-cat"];
    const addForm = forms["add-book"];

    db.collection("Blacklist").add({
      name: addForm.querySelector('input[type = "text"]').value,
      category: catForm.querySelector("#category-list").value,
    });

    addForm.value = "";
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
    function renderPlace(doc) {
      const placeList = document.querySelector("#book-list ul");

      let li = document.createElement("li");
      let name = document.createElement("span");
      let category = document.createElement("span");
      let deletebtn = document.createElement("span");

      li.setAttribute("data-id", doc.id);
      name.textContent = doc.data().name;
      category.textContent = " " + "(" + doc.data().category + ")";
      deletebtn.textContent = "delete";

      name.classList.add("name");
      category.classList.add("category");
      deletebtn.classList.add("delete");
      deletebtn.addEventListener("click", handleDelete);

      li.appendChild(name);
      li.appendChild(category);
      li.appendChild(deletebtn);

      placeList.appendChild(li);
    }

    function realTimeDisplay() {
      db.collection("Blacklist").onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type == "added") {
            renderPlace(change.doc);
          } else if (change.type == "removed") {
            const list = document.querySelector("#book-list ul");
            let li = list.querySelector("[data-id=" + change.doc.id + "]");

            list.removeChild(li);
          }
        });
      });
    }

    function handleDelete() {
      let id = this.parentElement.getAttribute("data-id");
      db.collection("Blacklist")
        .doc(id)
        .delete();
    }

    return (
      <div style={{ paddingTop: "180px" }}>
        <Link to="./">Back to Home</Link>
        <div id="wrapper">
          <header>
            <div id="page-banner">
              <h1 class="title">Blacklist Page</h1>
              <form id="search-books">
                <input
                  type="text"
                  placeholder="Search Blacklist..."
                  onChange={this.handleSearch}
                />
              </form>
            </div>
          </header>
          <div id="book-list">
            <h2 class="title">Recently Blacklisted:</h2>
            <ul>{realTimeDisplay()}</ul>
          </div>
          <form id="add-cat">
            <select id="category-list">
              <option value="" disabled selected>
                Select your Category...
              </option>
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </form>
          <form id="add-book">
            <input type="text" placeholder="Add a Place..." />
            <button onClick={this.handleStore}>Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Blacklist;
