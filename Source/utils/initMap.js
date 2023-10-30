import MapplsGL from 'mappls-map-react-native';
export function initMapGL(){
  MapplsGL.setMapSDKKey("8045d8136d66d2219cee967619661f77");//place your mapsdkKey
  MapplsGL.setRestAPIKey("8045d8136d66d2219cee967619661f77");//your restApiKey
  MapplsGL.setAtlasClientId( "33OkryzDZsL2h99ywO9d3m9s-1-r6Q1HSyTfrL1ZwPLNZmBn-3Z2mwqU_lmdigkFC54ptXvlvbFZ-I7jtO_WJBt97TFG3nOo");//your atlasClientId key
  MapplsGL.setAtlasClientSecret( "lrFxI-iSEg9CS8FlzmR-QEdsll2Zu6vbyX7ThtS2DUkBCpI4yGt21FufDtPPgjuhqrrvzR4ygseS4855lIBzrMP4AVmhOa1_w9XLaTmNB5Q="); //your atlasClientSecret key
}

export function initMap(){
  MapplsGL.setRestAPIKey('8045d8136d66d2219cee967619661f77');
  // MapplsGL.setClientId(
  //     '33OkryzDZsL2h99ywO9d3m9s-1-r6Q1HSyTfrL1ZwPLNZmBn-3Z2mwqU_lmdigkFC54ptXvlvbFZ-I7jtO_WJBt97TFG3nOo',
  //   );
  //   MapplsGL.setClientSecret(
  //     'lrFxI-iSEg9CS8FlzmR-QEdsll2Zu6vbyX7ThtS2DUkBCpI4yGt21FufDtPPgjuhqrrvzR4ygseS4855lIBzrMP4AVmhOa1_w9XLaTmNB5Q=',
  //   );
}

