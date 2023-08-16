import React, { Component, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { React_App_GOOGLE_PLACES_API_KEY, React_App_openWeatherKey } from "@env";
import location_hooks from "../components/location_hooks";
import * as Location from "expo-location";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Entypo";
import * as SQLite from "expo-sqlite";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import useTemperature from "../components/useTemperature";

let url = `https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=minutely,hourly,alert&appid=${React_App_openWeatherKey}`;


function openDatabase() {
  const db = SQLite.openDatabase("WeatherAppDB.db");
  return db;
}

const db = openDatabase();

export default function LocationScreen({ navigation }) {
  const [location, setcurrentLocation] = useState(null);
  const [locationsave, SetLocationSave] = useState("");
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const {celciousToFahrentheit, temperatureState} = useTemperature();


  const loadForecast = async (longitude,latitude) => {
    setRefreshing(true);

    const response = await fetch( `${url}&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();

    if(!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`); 
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  }

  

  const createTables = () => {
    db.transaction((txn) => {
      txn.executeSql(
        " CREATE TABLE IF NOT EXISTS LocationHistory (UniqueID INT, Location TEXT, Latitude REAL, Longitude REAL);",
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        (error) => {
          console.log("error on creating table " + error.message);
        }
      );
    });
  };

  const addLocation = () => {
    let uniqueTimeStamp =  Date.now()
    console.log(uniqueTimeStamp)
    console.log(locationsave)
    {locationsave ? 
    db.transaction((txn) => {
    txn.executeSql(
      `INSERT INTO LocationHistory (UniqueID,Location,Longitude,Latitude) VALUES (?,?,?,?)`,
      [
        uniqueTimeStamp,
        locationsave.locationName,
        locationsave.longitude,
        locationsave.latitude,
      ],
      (sqlTxn, res) => {
        console.log(`${Location} Location added successfully`);
        alert("You added the Data to History!");
      },
      (error) => {
        console.log("error on adding Location " + error.message);
      }
    );
  }): alert("You cannot save null Data to History!")
}};
  
    

  const { getLocation } = location_hooks((value) => {
    //console.log(value);
    //setcurrentLocation(value);
    const lat = value.coords.latitude;
    const lng = value.coords.longitude;
    loadForecast(lng,lat)
    setcurrentLocation({
      ...location,

      currentLocation: {
        latitude: lat,
        longitude: lng,
      },

      mapPin: {
        latitude: lat,
        longitude: lng,
      },
      region: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  });

  const getAll = async () => {
    await createTables();
  };

  useEffect(() => {
    getAll();
    getLocation();
  }, []);
  const themestate = useTheme();
  /*
	const [ pin, setPin ] = React.useState({
		latitude: location.coords.latitude,
		longitude: location.coords.longitude
	})
	const [ region, setRegion ] = React.useState({
		latitude: location.coords.latitude,
		longitude: location.coords.longitude,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	}) */

  return location == null ? (
    <Text>Loading</Text>
  ) : (
    <View style={{ marginTop: 50, flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.myLocation, { color: themestate.colors.text }]}>
          My Location
        </Text>
        <TouchableOpacity
          onPress={() => {
            
            addLocation(locationsave);
          }}
        >
          <Icon name="save" style={[styles.saveBtn]}></Icon>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <MaterialCommunityIconsIcon
            name="history"
            style={[styles.HistoryScreen]}
          ></MaterialCommunityIconsIcon>
        </TouchableOpacity>
      </View>

      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);

          const lat = details.geometry.location.lat
          const lng = details.geometry.location.lng
          loadForecast(lng,lat) 
          setcurrentLocation({
            ...location,
            region: {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
          });

          SetLocationSave({
            locationName: details.name,
            latitude: lat,
            longitude: lng,
          });
          /*
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					})*/
        }}
        query={{
          key: React_App_GOOGLE_PLACES_API_KEY,
          language: "en",
          location: `${location.region.latitude}, ${location.region.longitude}`,
        }}
        styles={{
          container: {
            marginTop: 50,
            flex: 0,
            position: "absolute",
            width: "100%",
            zIndex: -1,
          },
          listView: { backgroundColor: "white" },
        }}
      />

<View style = {styles.templocForcast}>
          <Text style={styles.subtitle}>Daily Forecast</Text>
      {refreshing ? null : 
      <FlatList horizontal style= {{ zIndex: 10}}
            data={forecast.daily.slice(0, 5)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(day) => {
              const weather = day.item.weather[0];
              var dt = new Date(day.item.dt * 1000);
              return <View style={styles.hour}>
                <Text style= {[{color:themestate.colors.text}]}>{dt.toLocaleDateString('en-US',{ weekday: 'long' })}</Text>
                <Text style= {[{color:themestate.colors.text}]}>{temperatureState ? `${celciousToFahrentheit(Math.round(day.item.temp.day))}  °F ` : `${Math.round(day.item.temp.day)}  °C` }</Text>

                <Image                

                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <Text style= {[{color:themestate.colors.text}]}>{weather.description}</Text>
              </View>
            }}
          />
}
      </View>
<MapView
        style={styles.map}
        initialRegion={{
          latitude: location.currentLocation.latitude,
          longitude: location.currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        <Marker
          onPress={(set) => {
            //console.log("set",set.nativeEvent.coordinate);
            console.log("insave", locationsave);
          }}
          coordinate={{
            latitude: location.region.latitude,
            longitude: location.region.longitude,
          }}
        />
        <Marker
          onPress={(e) => {
            console.log(e.nativeEvent.coordinate);
          }}
          coordinate={location.mapPin}
          pinColor="black"
          draggable={true}
          onDragStart={(e) => {
            console.log("Drag start", e.nativeEvent.coordinate);
          }}
          onDragEnd={(e) => {
            setcurrentLocation({
              ...location,
              mapPin: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              },
            });
          }}
        >
          <Callout>
            <Text>I'm here</Text>
          </Callout>
        </Marker>
        <Circle center={location.mapPin} radius={1000} />
      </MapView>
	  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex:-3,
  },
  templocForcast:{
   bottom :0,
   position: "absolute",
   zIndex: 5
  },
  myLocation: {
    top: 10,
    left: 21,
    position: "absolute",
    fontSize: 25,
  },
  saveBtn: {
    top: 10,
    left: 320,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 24,
  },
  HistoryScreen: {
    top: 10,
    left: 380,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 24,
  },
  saveBtnContainer: {},
  header: {
    height: 50,
    flexDirection: "row",
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft:7,
    color: "rgba(0,0,0,1)",
    fontWeight: "bold",
  },
  hour: {
    
    alignItems: 'center',
    width: 150,
    height:180,
      backgroundColor: 'rgba(235,235,235, 0.9)',
      padding: 15,
      borderRadius: 10,
      justifyContent: 'center'
  },
});
