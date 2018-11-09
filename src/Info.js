import React from "react";

const Info = props => {
  let { county, city, town, village, harlet } = props.address;
  let lat = "?";
  let lng = "?";
  if (!props.status.start && props.address && props.latlng) {
    const { latlng } = props;
    [lat, lng] = latlng.map(coord => Math.round(coord * 10 ** 3) / 10 ** 3);
  } else {
    town = "?";
    county = "?";
    city = "?";
    town = "?";
    village = "?";
    harlet = "?";
  }

  return (
    <ul>
      <li>Score: {props.score}</li>
      <li>Latitude: {lat}</li>
      <li>Longitude:{lng}</li>
      <li>County: {county}</li>
      <li>Town: {city || town || village || harlet}</li>
    </ul>
  );
};

export default Info;
