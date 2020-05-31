import CurrentLocation from "../Map";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MapPage: null,
    };
  }

  render() {
    return <div />;
  }
}
