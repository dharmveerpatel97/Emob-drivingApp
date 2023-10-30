import MapplsGL from 'mappls-map-react-native';

const UserCurrentLocation = ({onUpdate}) => {
  return (
    <MapplsGL.UserLocation
      animated={true}
      visible={true}
      onUpdate={location => onUpdate(location)}
    />
  );
};
export default UserCurrentLocation;
