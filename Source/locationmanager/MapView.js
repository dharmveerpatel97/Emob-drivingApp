import MapplsGL from 'mappls-map-react-native';
import React from 'react';

const MapView = props => {
  return (
    <MapplsGL.MapView
      logoPosition={{bottom: -50}}
      styleURL={MapmyIndiaGL.StyleURL.Dark}
      onDidFinishRenderingMapFully={props.onMapFinished}
      // mapmyIndiaStyle={{}}
      didLoadedMapmyIndiaMapsStyles={data => {
        color: '#001A0F';
      }}
      animated={'trans'}
      animationMode="moveTo"
      tintColor="#001A0F"
      style={{position:"absolute",top:0,bottom:0,left:0,right:0}}>
      {props.children}
    </MapplsGL.MapView>
  );
};

export default MapView;
