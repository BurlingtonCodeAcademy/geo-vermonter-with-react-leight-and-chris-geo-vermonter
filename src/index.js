import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map";
import Leaflet from "leaflet";
import "./styles.css";
import leafletPip from "@mapbox/leaflet-pip";
import countyData from "./counties.js";

class Game extends React.Component {
  constructor() {
    super();
    this.state = { latlng: [44.4759, -73.2121], zoom: 8, points: 100 };
    this.countiesVT = Leaflet.geoJSON(countyData, { fillOpacity: 0 });
  }

  coordRand = () => {
    const coordRange = {
      maxLat: 45.2,
      minLat: 42.5,
      maxLon: -70.7,
      minLon: -74.3
    };
    const lat =
      Math.random() * (coordRange.maxLat - coordRange.minLat) +
      coordRange.minLat;
    const lon =
      Math.random() * (coordRange.maxLon - coordRange.minLon) +
      coordRange.minLon;
    return [lon, lat];
  };

  generatePointVT = () => {
    let lnglat = this.coordRand();
    while (!leafletPip.pointInLayer(lnglat, this.countiesVT).length) {
      lnglat = this.coordRand();
    }
    this.setState({ latlng: lnglat.reverse(), markLatlng: Array.from(lnglat) });
  };

  handleStart = () => {
    this.setState({ zoom: 13 });
    this.generatePointVT();
  };

  handleSouth = () => {
    const { latlng } = this.state;
    latlng[0] = latlng[0] - 0.03;
    this.setState({ latlng });
  };

  handleNorth = () => {
    const { latlng } = this.state;
    latlng[0] = latlng[0] + 0.03;
    this.setState({ latlng });
  };

  handleEast = () => {
    const { latlng } = this.state;
    latlng[1] = latlng[1] + 0.03;
    this.setState({ latlng });
  };

  handleWest = () => {
    const { latlng } = this.state;
    latlng[1] = latlng[1] - 0.03;
    this.setState({ latlng });
  };

  render() {
    return (
      <div id="map-controls">
        <button onClick={this.handleStart}>Start</button>
        <button id="N" onClick={this.handleNorth}>
          North
        </button>
        <button id="S" onClick={this.handleSouth}>
          South
        </button>
        <button id="E" onClick={this.handleEast}>
          East
        </button>
        <button id="W" onClick={this.handleWest}>
          West
        </button>
        <Map
          latlng={this.state.latlng}
          markLatlng={this.state.markLatlng}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
