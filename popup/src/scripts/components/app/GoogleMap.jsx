import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Marker from './Marker';

const mapStyle = {
  margin: '5px',
  width: '550px',
  height: '350px',
  backgroundColor :'green',
};

class GoogleMap extends Component {
  constructor (props) {
    super(props);

    const {lat, lng} = this.props.initialCenter;
    this.state = {
      currentCenter: {
        lat: lat,
        lng: lng,
      },
    };
  }


  componentDidMount () {
    const markers = Object.keys(this.props.markers)
    if (markers.length > 0) {
      this.getLatestMarker();
    }
    this.loadMap();
  }

  componentDidUpdate (prevProps, prevState) {
    //check if props has been updated when app is first loaded
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevProps.markers !== this.props.markers) {
      this.getLatestMarker();
    }
    if (prevState !== this.state) {
      this.loadMap();
    }
  }

  loadMap () {
    if (this.props && this.props.google) {
      //if the google api has loaded into props
      const {google} = this.props;
      const maps = google.maps;
      //reference to GoogleMap's div node
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = this.props.zoom; //zoom set via default props
      //currentCenter set to default props initialCenter in state
      const {lat, lng} = this.state.currentCenter;
      const center = {lat, lng};
      const mapConfig = {
        center: center,
        zoom: zoom,
      };
      this.map = new maps.Map(node, mapConfig);
    }
  }

  getLatestMarker () {
    //transpose markers from obj into array
    const markers = [];
    Object.keys(this.props.markers).forEach((marker) => {
      markers.push(this.props.markers[marker]);
    });

    const latestAddedMarker = markers.reduce((a,b)=>{
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate > aDate ? b : a;
    });

    this.setState({
      currentCenter: {
        lat: latestAddedMarker.place.geometry.location.lat,
        lng: latestAddedMarker.place.geometry.location.lng,
      },
    });
  }

  renderMarkers () {
    if (this.props.markers) {
      const markers = this.props.markers;
      return Object.keys(markers).map(marker => {
        return <Marker key={marker} marker={markers[marker]}/>;
      });
    }
  }

  render () {
    return (
      <div ref="map" style={mapStyle}>
        {this.renderMarkers()}
      </div>
    );
  }
}

GoogleMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
};

GoogleMap.defaultProps = {
  zoom: 13,
  initialCenter: {
    lat: 1.351128,
    lng: 103.872199,
  },
};

export default GoogleMap;
