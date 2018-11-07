import React from "react";
import ReactDOM from "react-dom";
import Leaflet from "leaflet";
import "./styles.css";
import leafletPip from "@mapbox/leaflet-pip";
import countyData from "./counties.js";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
    this.latlng = props.latlng;
  }
  componentDidMount() {
    this.map = Leaflet.map(this.mapRef.current).setView(this.latlng, 13);
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.on("click", this.onMapClick);
  }

  componentWillUnmount() {
    this.map.off("click", this.onMapClick);
    this.map = null;
  }

  onMapClick = e => {
    const { lat, lng } = e.latlng;
    Leaflet.marker([lat, lng]).addTo(this.map);
  };

  render() {
    return <div ref={this.mapRef} id="mapid" />;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = { latlng: [44.4759, -73.2121], points: 100 };
    this.countiesVT = Leaflet.geoJSON(countyData, { fillOpacity: 0 });
    console.log(this.countiesVT);
  }

  coordRand = coordRange => {
    const lat =
      Math.random() * (coordRange.maxLat - coordRange.minLat) +
      coordRange.minLat;
    const lon =
      Math.random() * (coordRange.maxLon - coordRange.minLon) +
      coordRange.minLon;
    return [lon, lat];
  };

  generatePointVT = () => {
    const coordRange = {
      maxLat: 45.2,
      minLat: 42.5,
      maxLon: -70.7,
      minLon: -74.3
    };
    let point = this.coordRand(coordRange);
    console.log(this.countiesVT);
    while (!leafletPip.pointInLayer(point, this.countiesVT).length) {
      point = this.coordRand(coordRange);
    }
    return point.reverse();
  };

  render() {
    return <Map latlng={this.state.latlng} />;
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
