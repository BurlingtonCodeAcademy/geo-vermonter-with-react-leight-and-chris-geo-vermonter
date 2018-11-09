import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map";
import Leaflet from "leaflet";
import CountyList from "./CountyList";
import "./styles.css";
import leafletPip from "@mapbox/leaflet-pip";
import countyData from "./counties";

class Game extends React.Component {
  constructor() {
    super();
    this.initialLatlng = [44.4759, -73.2121];
    this.state = {
      latlng: this.initialLatlng,
      zoom: 8,
      score: 0,
      status: {
        start: false,
        guess: false
      }
    };
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
    this.fetchLocation(lnglat);
    this.setState({ latlng: lnglat.reverse(), markLatlng: Array.from(lnglat) });
  };

  fetchLocation = async lnglat => {
    const [lon, lat] = lnglat;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${lat}&lon=${lon}`
    );
    const json = await response.json();
    this.setState({ address: json.address });
  };

  handleStart = () => {
    const status = { ...this.state.status };
    status.start = true;
    this.generatePointVT();
    this.setState({ zoom: 14, status });
  };

  handleQuit = () => {
    const status = { ...this.state.status };
    status.start = false;
    this.setState({
      zoom: 8,
      status,
      latlng: this.initialLatlng
    });
  };

  handleGuess = () => {
    const status = { ...this.state.status };
    status.guess = !this.state.status.guess;
    this.setState({ status });
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

  updateScore = score => {
    this.setState({ score: (this.state.score += score) });
  };

  render() {
    return (
      <div id="map-controls">
        <button onClick={this.handleStart} disabled={this.state.status.start}>
          Start
        </button>
        <button onClick={this.handleGuess} disabled={!this.state.status.start}>
          Guess
        </button>
        <button onClick={this.handleQuit} disabled={!this.state.status.start}>
          Quit
        </button>
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
          countiesVT={this.countiesVT}
          status={this.state.status}
        />
        {this.state.status.guess && (
          <CountyList
            address={this.state.address}
            updateScore={this.updateScore}
          />
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
