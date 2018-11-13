import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map";
import CountyList from "./CountyList";
import Info from "./Info";
import Leaflet from "leaflet";
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
      },
      address: {}
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

  // Dispatcher
  handleMove = event => {
    const { latlng } = this.state;
    const direction = event.target.id;
    const directions = {
      N: () => (latlng[0] += 0.03),
      S: () => (latlng[0] -= 0.03),
      E: () => (latlng[1] += 0.03),
      W: () => (latlng[1] -= 0.03)
    };
    directions[direction]();
    this.setState({ latlng, score: this.state.score - 1 });
  };

  updateScore = (score, zoom, isNotCorrect) => {
    const newState = { ...this.state };
    newState.score += score;
    newState.zoom = zoom;
    newState.status.start = isNotCorrect;
    newState.status.guess = isNotCorrect;
    this.setState(newState);
  };

  render() {
    const { start, guess } = this.state.status;
    return (
      <div id="map-controls">
        <button onClick={this.handleStart} disabled={start}>
          Start
        </button>
        <button onClick={this.handleGuess} disabled={!start}>
          Guess
        </button>
        <button onClick={this.handleQuit} disabled={!start}>
          Quit
        </button>
        <button id="N" onClick={this.handleMove}>
          North
        </button>
        <button id="S" onClick={this.handleMove}>
          South
        </button>
        <button id="E" onClick={this.handleMove}>
          East
        </button>
        <button id="W" onClick={this.handleMove}>
          West
        </button>
        <Map
          latlng={this.state.latlng}
          markLatlng={this.state.markLatlng}
          zoom={this.state.zoom}
          countiesVT={this.countiesVT}
          status={this.state.status}
        />
        {guess && (
          <CountyList
            address={this.state.address}
            updateScore={this.updateScore}
          />
        )}
        <Info
          address={this.state.address}
          latlng={this.state.markLatlng}
          status={this.state.status}
          score={this.state.score}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
