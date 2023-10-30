import {View, Text} from 'react-native';
import React from 'react';
// import Mapmyindia from 'mapmyindia-restapi-react-native-beta';
// import Polyline from 'mapmyindia-polyline';
import MapplsGL from 'mappls-map-react-native';
import {useState} from 'react';
import {useEffect} from 'react';
import {point} from '@turf/helpers';
// import startIcon from '../Assests/image/start_icon.png';
import endIcon from '../Assests/image/end_icon.png';
import startIcon from '../Assests/image/Vehicle.png';
import { initMap, initMapGL } from '../utils/initMap';
import polyline from 'mappls-polyline';

initMapGL();
initMap()

const layerStyles = {
  route: {
    lineColor: '#0080FF',
    lineCap: 'round',
    lineWidth: 3,
    lineOpacity: 1,
    lineJoin: 'round',
    lineDasharray: [2,2,2,2],
  },
  origin: {
    circleRadius: 30,
    circleColor: '#469632',
    circleBlur: 0.3,
  },
  iconStartPosition: {
    iconImage: startIcon,
    //iconAllowOverlap: true,
    iconSize: 0.3,
    iconRotate: 180,
    iconAnchor: 'bottom',
    iconAllowOverlap: false,
   
    iconIgnorePlacement: true,
  },
 

  iconEndPosition: {
    iconImage: endIcon,
    iconAllowOverlap: true,
    iconSize: 0.3,
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
};

export default function MapPath({setCenterCordinates,centerCordinates,destination,source,centerNoString,showpath}) {


  const [sourceCoordinates, setSourceCoordinates] = useState(source);
  const [destinationCoordinates, setDestinationCoordinates] = useState(destination);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [route1, setRoute1] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState(centerNoString);

  useEffect(() => {
      callApi('driving');
      console.log("mappath api call")
    //  setSourceCoordinates(source);
     // setDestinationCoordinates(destination);
  }, [sourceCoordinates,destinationCoordinates,routeCoordinates]);

  const callApi = setProfile => { 
    MapplsGL.RestApi.direction({
      origin:  sourceCoordinates,
    // origin:  routeCoordinates,
      destination: destinationCoordinates,
      profile: setProfile,
     // overview: 'full',

      overview: MapplsGL.RestApi.DirectionsCriteria.OVERVIEW_FULL,


      geometries: 'polyline6',
    }).then(data => {
      console.log("mappath data",data)
      let routeGeoJSON = polyline.toGeoJSON(data.routes[0].geometry,6);
      console.log("mappath data1",routeGeoJSON)
      setDistance(getFormattedDistance(data.routes[0].distance));
      setDuration(getFormattedDuration(data.routes[0].duration));
      setRoute1(routeGeoJSON);
      setCenterCordinates(routeGeoJSON.coordinates[0]); 
    }).catch(err => {
      console.log('error: ', err);
    }) 
  };

  const getFormattedDistance = distance => {
    if (distance / 1000 < 1) {
      return distance + 'mtr.';
    }
    let dis = distance / 1000;
    dis = dis.toFixed(2);
    return dis + 'Km.';
  };

  const getFormattedDuration = duration => {
    let min = parseInt((duration % 3600) / 60);
    let hours = parseInt((duration % 86400) / 3600);
    let days = parseInt(duration / 86400);
    if (days > 0) {
      return (
        days +
        ' ' +
        (days > 1 ? 'Days' : 'Day') +
        ' ' +
        hours +
        ' ' +
        'hr' +
        (min > 0 ? ' ' + min + ' ' + 'min.' : '')
      );
    } else {
      return hours > 0
        ? hours + ' ' + 'hr' + (min > 0 ? ' ' + min + ' ' + 'min' : '')
        : min + ' ' + 'min.';
    }
  };

  const renderOrigin = () => {
    if (!route1) {
      return null;
    }

    return (
      <>
        <MapplsGL.ShapeSource id="origin" shape={point(routeCoordinates)}>
          <MapplsGL.SymbolLayer
            id="originSymbolLocationSymbols"
             minZoomLevel={1}
            style={layerStyles.iconStartPosition}
          />
        </MapplsGL.ShapeSource>
      </>
    );
  };

  const renderDestination = () => {
    if (!route1) {
      return null;
    } else {
      let coordinates = route1.coordinates;
      let lastcoordinates = coordinates[coordinates.length - 1];
      return (
        <MapplsGL.ShapeSource
          id="destination"
          shape={point(lastcoordinates)}>
          <MapplsGL.SymbolLayer
            id="destinationSymbolLocationSymbols"
          //  minZoomLevel={1}
            style={layerStyles.iconEndPosition}
          />
        </MapplsGL.ShapeSource>
      );
    }
  };

  if (route1 && showpath) {
    return (
      <>
        <MapplsGL.ShapeSource id="routeSource" shape={route1}>
          <MapplsGL.LineLayer  id="routeFill" style={layerStyles.route} />
        </MapplsGL.ShapeSource>
        {renderOrigin()}
        {renderDestination()}
      </>
    );
  } else {
   
    null;
  }
}