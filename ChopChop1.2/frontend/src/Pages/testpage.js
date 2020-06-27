import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Map } from "google-maps-react";

class testpage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testpage: null,
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Link to="./">Back to Home</Link>
        <Map google={this.props.google} />
      </div>
    );
  }
}

export default testpage;
