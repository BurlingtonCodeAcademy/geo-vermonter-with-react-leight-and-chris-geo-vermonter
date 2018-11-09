import React from "react";
import Leaflet from "leaflet";
import "./styles.css";
import borderData from "./border.js";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
  }
  componentDidMount() {
    this.map = Leaflet.map(this.mapRef.current).setView(
      this.props.latlng,
      this.props.zoom
    );
    Leaflet.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.map);
    Leaflet.geoJSON(borderData, { fillOpacity: 0 }).addTo(this.map);
    this.map._handlers.forEach(handler => handler.disable());
  }

  updateMap = () => {
    if (this.map) {
      this.map.setView(this.props.latlng, this.props.zoom);
      Leaflet.marker(this.props.markLatlng).addTo(this.map);
    }
  };

  render() {
    this.updateMap();
    return <div ref={this.mapRef} id="mapid" />;
  }
}

export default Map;
