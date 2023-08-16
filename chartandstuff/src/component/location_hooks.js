import * as Location from 'expo-location';



 
export default (VarLocation) => {
const getLocation = async () => {  
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
        }
    
        var location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
         VarLocation(location)
      }
      
      return {getLocation};

    }
