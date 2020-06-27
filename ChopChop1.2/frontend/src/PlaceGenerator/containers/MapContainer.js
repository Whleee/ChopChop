import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import MapAutoComplete from "../components/MapAutoComplete";
import MapMarker from "../components/MapMarker";
import PlaceCard from "../components/PlaceCard";
import ConstraintSlider from "../components/ConstraintSlider";
//import "../App.css";

import { Button, Input, Divider, message } from "antd";
import App from "../App2";

const SG_COOR = { lat: 1.3521, lng: 103.8198 };

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
    };
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
      singaporeLatLng: new mapsApi.LatLng(SG_COOR.lat, SG_COOR.lng),
      autoCompleteService: new mapsApi.places.AutocompleteService(),
      placesService: new mapsApi.places.PlacesService(map),
      geoCoderService: new mapsApi.Geocoder(),
      directionService: new mapsApi.DirectionsService(),
    });
  };

  // With the constraints, find some places serving ice-cream
  handleSearch = () => {
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
      const responseLimit = Math.min(5, response.length);
      for (let i = 0; i < responseLimit; i++) {
        const placeCoords = {
          lat: response[i].geometry.location.lat,
          lng: response[i].geometry.location.lng,
        };
        console.log(placeCoords);
        const prevList = this.state.listOfCoords;
        prevList.push(placeCoords);
        this.setState({
          listOfCoords: prevList,
        });

        const iceCreamPlace = response[i];
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
        directionService.route(directionRequest, (result, status) => {
          if (status !== "OK") {
            return;
          }
          const travellingRoute = result.routes[0].legs[0]; // { duration: { text: 1mins, value: 600 } }
          const travellingTimeInMinutes = travellingRoute.duration.value / 60;
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
            });
          }
          // Finally, Add results to state
          this.setState({ searchResults: filteredResults });
        });
      }
    });
  };

  //sub function
  fun1 = (position) => {
    this.setState({
      currentLocation: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    });
    console.log("Latitude is :", position.coords.latitude);
    console.log("Longitude is :", position.coords.longitude);
  };

  //get users location
  componentDidMount = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.fun1, function(error) {
        console.error("Error code = " + error.code + " - " + error.message);
      });
    }
  };

  render() {
    const {
      constraints,
      mapsLoaded,
      singaporeLatLng,
      markers,
      searchResults,
      listOfCoords,
    } = this.state;
    const { autoCompleteService, geoCoderService } = this.state; // Google Maps Services
    return (
      <div className="w-100 d-flex py-4 flex-wrap justify-content-center">
        <h1 className="w-100 fw-md">Find something to do!</h1>
        {/* Constraints section */}

        <section className="col-4">
          {mapsLoaded ? (
            <div>
              {constraints.map((constraint, key) => {
                const { name, time } = constraint;
                return (
                  <div key={key} className="mb-4">
                    <div className="d-flex mb-2">
                      <form id="test">
                        <Input type="text" placeholder="Category" />
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
                    <Button
                      className="mt-4 fw-md"
                      type="primary"
                      size="large"
                      onClick={this.handleSearch}
                    >
                      Search!
                    </Button>
                    <Divider />
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        {/* Maps Section */}
        <section className="col-8 h-lg">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyBQlZDHkXFuTFhDdgn8T286dkWQije7d80",
              libraries: ["places", "directions"],
            }}
            defaultZoom={14}
            defaultCenter={{
              lat: this.state.currentLocation.lat,
              lng: this.state.currentLocation.lng,
            }}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)} // "maps" is the mapApi. Bad naming but that's their library.
          >
            <MapMarker
              name="current location"
              lat={this.state.currentLocation.lat}
              lng={this.state.currentLocation.lng}
            />
          </GoogleMapReact>
        </section>

        {/* Results section */}
        {searchResults.length > 0 ? (
          <>
            <Divider />
            <section className="col-12">
              <div className="d-flex flex-column justify-content-center">
                <h1 className="mb-4 fw-md">Heres what we found...</h1>
                <div className="d-flex flex-wrap">
                  {searchResults.map((result, key) => (
                    <PlaceCard info={result} key={key} />
                  ))}
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
