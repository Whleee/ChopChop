import React from "react";
import { Rate } from "antd";

// TODO: info is bad naming.
const styles = {
  Styling: {
    fontSize: "25px",
    fontWeight: "bold",
    fontFamily: "Courier New",
    paddingTop: "30px",
  },
};
const PlaceCard = ({ info, key }) => {
  const {
    address,
    distanceText,
    name,
    openNow,
    photoUrl,
    priceLevel,
    rating,
    timeText,
  } = info;
  return (
    <div key={key} className="w-100 mx-4 mt-5">
      <div className="card" style={styles.Styling}>
        <div className="card-header">
          <h1
            className="card-body"
            style={{
              backgroundColor: "#343A40",
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            {name}
          </h1>
          <span className="d-block mb-1">{address}</span>
          <span className="d-block">{distanceText}</span>
          <span className="d-block">{timeText}</span>
        </div>
        <ul className="list-group list-group-flush">
          {openNow ? (
            <li className="list-group-item">Open</li>
          ) : (
            <li className="list-group-item">Closed</li>
          )}
          <li className="list-group-item">
            Rating - <Rate value={rating} />
          </li>
          <li className="list-group-item">
            Price - <Rate value={priceLevel} character="$" />
          </li>
        </ul>
      </div>
      <img
        src={photoUrl}
        className="image-wrapper-sm"
        alt="image not available"
      />
    </div>
  );
};

export default PlaceCard;
