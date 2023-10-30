import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
const Loader = ({visible = true}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <ActivityIndicator
            style={{alignSelf: 'center'}}
            size={'large'}
            color={'#00AF66'}
          />
          <Text style={{color: 'white'}}>Please wait...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create(
    {
        container:{
            flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    
            // width:100,height:100,
            // justifyContent:'center',alignSelf:'center',opacity:0.5,
            // backgroundColor: 'rgba(0, 0, 0, 0.5)'
            
        },
        modalView: {
            margin: 20,
            backgroundColor: '#00AF66',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#001A0F',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          },
        
    }
)
