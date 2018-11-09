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
    this.props.countiesVT.addTo(this.map);
    this.map._handlers.forEach(handler => handler.disable());
  }

  updateMap = () => {
    this.map.setView(this.props.latlng, this.props.zoom);
    if (this.props.markLatlng && !this.startMarker) {
      this.startMarker = Leaflet.marker(this.props.markLatlng);
      this.startMarker.addTo(this.map);
      this.props.countiesVT.setStyle({
        color: "rgba(0,0,0,0)"
      });
    }
    if (!this.props.status.start && this.startMarker) {
      this.startMarker.remove();
      this.startMarker = null;
      this.props.countiesVT.setStyle({
        color: "blue"
      });
    }
  };

  render() {
    this.map && this.updateMap();
    return <div ref={this.mapRef} id="mapid" />;
  }
}

export default Map;
