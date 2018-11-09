import React from "react";
import Leaflet from "leaflet";
import countyData from "./counties";

class CountyList extends React.Component {
  constructor(props) {
    super(props);
    const countiesVT = Leaflet.geoJSON(countyData);
    this.countyArray = Object.values(countiesVT._layers).map(
      county => county.feature.properties.NAME
    );
  }

  handleClick = event => {
    if (this.props.address.county.includes(event.target.textContent)) {
      this.props.updateScore(100);
    } else {
      this.props.updateScore(-10);
    }
  };

  render() {
    const countyList = this.countyArray.map(county => (
      <li key={county}>
        <button onClick={this.handleClick}>{county}</button>
      </li>
    ));
    return <ul>{countyList}</ul>;
  }
}

export default CountyList;
