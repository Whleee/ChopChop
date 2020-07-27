import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import MapAutoComplete from "../components/MapAutoComplete";
import MapMarker from "../components/MapMarker";
import PlaceCard from "../components/PlaceCard";
import ConstraintSlider from "../components/ConstraintSlider";
import ReactDOM from "react-dom";
import firebase from "../../firebase";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
//import "../App.css";

import { Button, Input, Divider, message } from "antd";
import App from "../App2";
import auth0Client from "../../Auth";

const styles = {
  Positioner: {
    paddingTop: "160px",
  },

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

  btns: {
    fontSize: "25px",
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

  LogInOut2: {
    fontSize: "40px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    paddingTop: "15px",
    paddingLeft: "50px",
  },

  CardHeader: {
    fontSize: "50px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    color: "black",
  },

  CardBody: {
    fontSize: "30px",
    fontFamily: "Courier New",
    fontWeight: "bold",
    color: "black",
  },

  FormBody: {
    fontSize: "30px",
    fontWeight: "bold",
    fontFamily: "Courier New",
  },

  ButtonPositioner: {
    paddingLeft: "50px",
  },

  SearchButton: {
    fontSize: "40px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    padding: "10px 90px",
  },

  CardHeader2: {
    fontSize: "50px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    color: "black",
    paddingLeft: "25%",
  },

  Results: {
    fontSize: "25px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    color: "black",
    paddingLeft: "25%",
  },
};

const SG_COOR = { lat: 1.3521, lng: 103.8198 };

const db = firebase.firestore();

class MapsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      constraints: [{ name: "", time: 0 }],
      searchResults: [],
      mapsLoaded: false,
      markers: [],
      map: {},
      mapsApi: {},
      singaporeLatLng: {},
      autoCompleteService: {},
      placesService: {},
      geoCoderService: {},
      directionService: {},
      currentLocation: {
        lat: 1.3521,
        lng: 103.8198,
      },
      listOfCoords: [],
      retry: false,
      number: 0,
      car: false,
      walk: false,
      searched: false,
      stored: false,
      storeCount: 0,
      searchedDone: false,
      limit: false,
      blacklisted: false,
      catEmpty: false,
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        this.setState({
          currentLocation: {
            lat: coords.latitude,
            lng: coords.longitude,
          },
        });
      });
    }
  }

  // Update name for constraint with index === key
  updateConstraintName = (event, key) => {
    event.preventDefault();
    const prevConstraints = this.state.constraints;
    const constraints = Object.assign([], prevConstraints);
    constraints[key].name = event.target.value;
    this.setState({ constraints });
  };

  // Updates distance (in KM) for constraint with index == key
  updateConstraintTime = (key, value) => {
    const prevConstraints = this.state.constraints;
    const constraints = Object.assign([], prevConstraints);
    constraints[key].time = value;
    this.setState({ constraints });
  };

  // Adds a Marker to the GoogleMaps component
  addMarker = (lat, lng, name) => {
    const prevMarkers = this.state.markers;
    const markers = Object.assign([], prevMarkers);

    // If name already exists in marker list just replace lat & lng.
    let newMarker = true;
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].name === name) {
        newMarker = false;
        markers[i].lat = lat;
        markers[i].lng = lng;
        message.success(`Updated "${name}" Marker`);
        break;
      }
    }
    // Name does not exist in marker list. Create new marker
    if (newMarker) {
      markers.push({ lat, lng, name });
      message.success(`Added new "${name}" Marker`);
    }

    this.setState({ markers });
  };

  // Runs once when the Google Maps library is ready
  // Initializes all services that we need
  apiHasLoaded = (map, mapsApi) => {
    this.setState({
      mapsLoaded: true,
      map,
      mapsApi,
      singaporeLatLng: new mapsApi.LatLng(
        this.state.currentLocation.lat,
        this.state.currentLocation.lng
      ),
      autoCompleteService: new mapsApi.places.AutocompleteService(),
      placesService: new mapsApi.places.PlacesService(map),
      geoCoderService: new mapsApi.Geocoder(),
      directionService: new mapsApi.DirectionsService(),
    });
  };

  // With the constraints, find some places serving ice-cream
  handleSearch = () => {
    if (this.state.searchedDone) {
    } else {
      this.setState({ searched: true });
      const {
        markers,
        constraints,
        placesService,
        directionService,
        mapsApi,
      } = this.state;
      //if (markers.length === 0) {
      //  message.warn("Add a constraint and try again!");
      //  return;
      // }
      const filteredResults = [];
      const marker = markers[0];
      const timeLimit = constraints[0].time;
      const latitude = this.state.currentLocation.lat;
      const longitude = this.state.currentLocation.lng;
      const markerLatLng = new mapsApi.LatLng(latitude, longitude);
      const forms = document.forms;
      const catForm = forms["test"];
      const category = catForm.querySelector('input[type = "text"]').value;

      const placesRequest = {
        location: markerLatLng,
        // radius: '30000', // Cannot be used with rankBy. Pick your poison!
        //type: [category], // List of types: https://developers.google.com/places/supported_types
        query: category,
        rankBy: mapsApi.places.RankBy.DISTANCE, // Cannot be used with radius.
      };

      // First, search for ice cream shops.
      placesService.textSearch(placesRequest, (response) => {
        // Only look at the nearest top 5.
        const responseLimit = Math.min(10, response.length);
        for (let i = 0; i < responseLimit; i++) {
          const iceCreamPlace = response[i];
          const coords = {
            lat: iceCreamPlace.geometry.location.lat,
            lng: iceCreamPlace.geometry.location.lng,
          };
          const { rating, name } = iceCreamPlace;
          const address = iceCreamPlace.formatted_address; // e.g 80 mandai Lake Rd,
          const priceLevel = iceCreamPlace.price_level; // 1, 2, 3...
          let photoUrl = "";
          let openNow = false;
          if (iceCreamPlace.opening_hours) {
            openNow = iceCreamPlace.opening_hours.open_now; // e.g true/false
          }
          if (iceCreamPlace.photos && iceCreamPlace.photos.length > 0) {
            photoUrl = iceCreamPlace.photos[0].getUrl();
          }

          // Second, For each iceCreamPlace, check if it is within acceptable travelling distance
          const directionRequest = {
            origin: markerLatLng,
            destination: address, // Address of ice cream place
            travelMode: "DRIVING",
          };

          const directionRequest2 = {
            origin: markerLatLng,
            destination: address, // Address of ice cream place
            travelMode: "WALKING",
          };

          if (this.state.car) {
            directionService.route(directionRequest, (result, status) => {
              if (status !== "OK") {
                return;
              }

              const travellingRoute = result.routes[0].legs[0]; // { duration: { text: 1mins, value: 600 } }
              const travellingTimeInMinutes =
                travellingRoute.duration.value / 60;
              if (travellingTimeInMinutes < timeLimit) {
                const distanceText = travellingRoute.distance.text; // 6.4km
                const timeText = travellingRoute.duration.text; // 11 mins
                filteredResults.push({
                  name,
                  rating,
                  address,
                  openNow,
                  priceLevel,
                  photoUrl,
                  distanceText,
                  timeText,
                  coords,
                });
              }
              // Finally, Add results to state
              this.setState({ searchResults: filteredResults });
              this.setState({ searchedDone: true });
            });
          } else if (this.state.walk) {
            directionService.route(directionRequest2, (result, status) => {
              if (status !== "OK") {
                return;
              }
              const travellingRoute = result.routes[0].legs[0]; // { duration: { text: 1mins, value: 600 } }
              const travellingTimeInMinutes =
                travellingRoute.duration.value / 60;
              if (travellingTimeInMinutes < timeLimit) {
                const distanceText = travellingRoute.distance.text; // 6.4km
                const timeText = travellingRoute.duration.text; // 11 mins
                filteredResults.push({
                  name,
                  rating,
                  address,
                  openNow,
                  priceLevel,
                  photoUrl,
                  distanceText,
                  timeText,
                  coords,
                });
              }
              // Finally, Add results to state
              this.setState({ searchResults: filteredResults });
              this.setState({ searchedDone: true });
            });
          }
        }
      });
    }
  };

  handleSearch2 = () => {
    const forms = document.forms;
    const catForm = forms["test"];
    let value = catForm.querySelector('input[type = "text"]').value;

    if (value == "") {
      this.setState({ catEmpty: true });
    }
  };

  filterSearch = () => {
    let places = this.state.searchResults;
    let updatedPlaces = [];
    for (let i = 0; i < places.length; i++) {
      let safe = true;
      let place1 = places[i].name;
      db.collection("Blacklist")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((marked) => {
            let place2 = marked.data().name;
            if (place1 === place2) {
              safe = false;
            }
          });
        });
      if ((safe = true)) {
        updatedPlaces.push(places[i]);
      }
    }
    this.setState({ searchResults: updatedPlaces });
  };

  handleSearchMaster = () => {
    this.handleSearch();
    this.handleSearch2();
    this.filterSearch();
  };

  handleRetryClicked = () => {
    const searchResults = this.state.searchResults;
    const limit = searchResults.length;
    const currNumber = this.state.number;

    if (currNumber == limit - 1) {
      this.setState({
        retry: true,
        number: 0,
        stored: false,
        storeCount: 0,
        limit: true,
        blacklisted: false,
      });
    } else {
      this.setState({
        retry: true,
        number: this.state.number + 1,
        stored: false,
        storeCount: 0,
        blacklisted: false,
      });
    }
  };

  //storing data
  handleFavourites = (place) => {
    if (this.state.storeCount != 0) {
      //need to add erorr msg here, that it is already stored
    } else {
      //place.preventDefault();
      this.setState({
        stored: true,
        storeCount: 1,
      });

      const forms = document.forms;
      const catForm = forms["test"];

      db.collection("Favourites").add({
        name: place.name,
        category: catForm.querySelector('input[type = "text"]').value,
        location: place.address,
      });
    }
  };

  handleHistory = (place) => {
    const forms = document.forms;
    const catForm = forms["test"];

    db.collection("History").add({
      name: place.name,
      category: catForm.querySelector('input[type = "text"]').value,
      location: place.address,
    });
  };

  handleBlacklist = (place) => {
    if (this.state.blacklisted) {
    } else {
      const forms = document.forms;
      const catForm = forms["test"];

      db.collection("Blacklist").add({
        name: place.name,
        category: catForm.querySelector('input[type = "text"]').value,
        location: place.address,
      });

      this.setState({
        blacklisted: true,
      });
    }
  };

  handleCarClicked = () => {
    this.setState({
      car: true,
      walk: false,
      searchedDone: false,
      searched: false,
    });
  };

  handleWalkClicked = () => {
    this.setState({
      walk: true,
      car: false,
      searchedDone: false,
      searched: false,
    });
  };

  render() {
    const {
      constraints,
      mapsLoaded,
      singaporeLatLng,
      markers,
      searchResults,
      listOfCoords,
      place,
      number,
      car,
      walk,
      searched,
      searchedDone,
    } = this.state;
    const { autoCompleteService, geoCoderService } = this.state; // Google Maps Services

    return (
      <div className="" style={styles.Positioner}>
        <div className="d-flex flex-wrap justify-content-center">
          <div className="card-header bg-warning" style={styles.CardHeader}>
            Find something to do!
          </div>
          {/* Constraints section */}
          <div>
            <h2 className="fw-md" style={styles.LogInOut2}>
              Choose your mode of transport!
            </h2>
            <button
              className=" w-50 btn btn-dark"
              style={styles.LogInOut}
              onClick={this.handleCarClicked}
            >
              Car
            </button>
            <button
              className="w-50 btn btn-success"
              style={styles.LogInOut}
              onClick={this.handleWalkClicked}
            >
              Walk
            </button>
          </div>

          <section className="col-4">
            {mapsLoaded && car ? (
              <div>
                {constraints.map((constraint, key) => {
                  const { name, time } = constraint;
                  return (
                    <div key={key} className="mb-3" style={styles.LogInOut}>
                      <div className="mb-2">
                        <form id="test" stlye={styles.LogInOut}>
                          <Input
                            type="text"
                            placeholder="Category"
                            style={styles.FormBody}
                          />
                        </form>
                      </div>
                      <ConstraintSlider
                        iconType="car"
                        value={time}
                        onChange={(value) =>
                          this.updateConstraintTime(key, value)
                        }
                        text="Minutes away by car"
                      />
                      {/* Search Button */}
                      <button
                        className="btn btn-warning"
                        onClick={this.handleSearchMaster}
                        style={styles.SearchButton}
                      >
                        Search!
                      </button>
                      {this.state.catEmpty ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Fill in a category!
                        </h2>
                      ) : null}
                      {searched &&
                      car &&
                      !searchedDone &&
                      !this.state.catEmpty ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Loading...
                        </h2>
                      ) : null}
                      {searchedDone && car && searchResults.length > 0 ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Scroll down to see your results!
                        </h2>
                      ) : null}
                      {searchedDone && car && searchResults.length == 0 ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Nothing found :(
                        </h2>
                      ) : null}
                      <Divider />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {mapsLoaded && walk ? (
              <div>
                {constraints.map((constraint, key) => {
                  const { name, time } = constraint;
                  return (
                    <div key={key} className="mb-3" style={styles.LogInOut}>
                      <div className="d-flex mb-2">
                        <form id="test" style={styles.LogInOut}>
                          <Input
                            type="text"
                            placeholder="Category"
                            style={styles.FormBody}
                          />
                        </form>
                      </div>
                      <ConstraintSlider
                        iconType="heart"
                        value={time}
                        onChange={(value) =>
                          this.updateConstraintTime(key, value)
                        }
                        text="Minutes away by walking"
                      />
                      {/* Search Button */}
                      <button
                        className="btn btn-warning"
                        style={styles.SearchButton}
                        onClick={this.handleSearchMaster}
                      >
                        Search!
                      </button>
                      {this.state.catEmpty ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Fill in a category!
                        </h2>
                      ) : null}
                      {searched &&
                      walk &&
                      !searchedDone &&
                      !this.state.catEmpty ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Loading...
                        </h2>
                      ) : null}
                      {searchedDone && walk && searchResults.length > 0 ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Scroll down to see your results!
                        </h2>
                      ) : null}
                      {searchedDone && walk && searchResults.length == 0 ? (
                        <h2 className="fw-md" style={styles.LogInOut2}>
                          Nothing found :(
                        </h2>
                      ) : null}
                      <Divider />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>

          {/* Maps Section */}
          <section className="col-10 h-lg" style={{ paddingBottom: "50px" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBQlZDHkXFuTFhDdgn8T286dkWQije7d80",
                libraries: ["places", "directions"],
              }}
              defaultZoom={15}
              defaultCenter={{
                lat: this.state.currentLocation.lat,
                lng: this.state.currentLocation.lng,
              }}
              yesIWantToUseGoogleMapApiInternals={true}
              onGoogleApiLoaded={({ map, maps }) =>
                this.apiHasLoaded(map, maps)
              } // "maps" is the mapApi. Bad naming but that's their library.
            >
              <MapMarker
                name="CURRENT LOCATION"
                lat={this.state.currentLocation.lat}
                lng={this.state.currentLocation.lng}
              />
            </GoogleMapReact>
          </section>
        </div>

        {/* Results section */}
        {searchResults.length > 0 ? (
          <>
            <Divider />
            <section>
              <div>
                <div
                  className="card-header bg-warning"
                  style={styles.CardHeader2}
                >
                  Here's where to go!
                </div>
                <div className="d-flex flex-wrap">
                  {/* 
                  {searchResults.map((result, key) => (
                    <PlaceCard info={result} key={key} />
                  ))}
                  */}
                  {!this.state.retry && !this.state.limit ? (
                    <PlaceCard id="result" info={searchResults[number]} />
                  ) : (
                    <PlaceCard id="result" info={searchResults[number]} />
                  )}
                  <button
                    className="btns mb-5"
                    style={styles.btns}
                    onClick={this.handleRetryClicked}
                  >
                    Try Again
                  </button>
                  <a
                    className="btns"
                    target="_blank"
                    href={
                      "https://google.com/maps/dir/" +
                      this.state.currentLocation.lat +
                      "," +
                      this.state.currentLocation.lng +
                      "/" +
                      searchResults[number].address +
                      "/"
                    }
                  >
                    <button
                      style={styles.btns}
                      onClick={this.handleHistory.bind(
                        this,
                        searchResults[number]
                      )}
                    >
                      Take me there!
                    </button>
                  </a>

                  {auth0Client.isAuthenticated() && (
                    <button
                      className="btns"
                      style={styles.btns}
                      onClick={this.handleFavourites.bind(
                        this,
                        searchResults[number]
                      )}
                    >
                      Add to Favourites
                    </button>
                  )}

                  {auth0Client.isAuthenticated() && this.state.stored ? (
                    <h3>Item is stored!</h3>
                  ) : null}

                  {auth0Client.isAuthenticated() && (
                    <button
                      className="btns"
                      style={styles.btns}
                      onClick={this.handleBlacklist.bind(
                        this,
                        searchResults[number]
                      )}
                    >
                      Add to Blacklist
                    </button>
                  )}

                  {auth0Client.isAuthenticated() && this.state.blacklisted ? (
                    <h3>Item is blacklisted!</h3>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    );
  }
}

export default MapsContainer;

/*

<Input
                        className="col-4 mr-2"
                        placeholder="Name"
                        onChange={(event) =>
                          this.updateConstraintName(event, key)
                        }
                      />

<MapAutoComplete
                        autoCompleteService={autoCompleteService}
                        geoCoderService={geoCoderService}
                        singaporeLatLng={singaporeLatLng}
                        markerName={name}
                        addMarker={this.addMarker}
                      />


                      {Pin markers on the Map}
            {markers.map((marker, key) => {
              const { name, lat, lng } = marker;
              return <MapMarker key={key} name={name} lat={lat} lng={lng} />;
            })}

            {listOfCoords.map((coords) => {
              return <MapMarker name="" lat={coords.lat} lng={coords.lng} />;
            })}
*/
