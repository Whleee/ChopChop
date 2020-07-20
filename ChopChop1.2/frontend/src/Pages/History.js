import { Link } from "react-router-dom";
import React, { Component } from "react";
import "./Styles.css";
import firebase from "../firebase";

const db = firebase.firestore();

const styles = {
  ChopChopHead: {
    fontSize: "65px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    margin: "auto",
  },

  LogInOut: {
    fontSize: "50px",
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

  Placeholder: {
    fontSize: "21px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  }
};

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      History: null,
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

    db.collection("History").add({
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
      db.collection("History").onSnapshot((snapshot) => {
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
      db.collection("History")
        .doc(id)
        .delete();
    }

    return (
      <div style={{ paddingTop: "200px", fontFamily: "Courier New", fontWeight: "bold"}}>
        <div id="wrapper">
          <header>
            <div id="page-banner">
              <h1 class="title" style={styles.LogInOut}>History</h1>
              <form id="search-books">
                <input
                  type="text"
                  style={styles.Placeholder}
                  placeholder="Search History..."
                  onChange={this.handleSearch}
                />
              </form>
            </div>
          </header>
          <div id="book-list">
            <h2 class="title" style={styles.LogInOut}>Recently Visited:</h2>
            <ul>{realTimeDisplay()}</ul>
          </div>
          <form id="add-cat">
            <select id="category-list" style={styles.Placeholder}>
              <option value="" disabled selected>
                Select your Category...
              </option>
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </form>
          <form id="add-book">
            <input type="text" style={styles.Placeholder} placeholder="Add a Place..." />
            <button onClick={this.handleStore} style={styles.Placeholder}>Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default History;

/* handleAdd = (e) => {
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

  */
