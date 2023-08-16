import React, { useEffect, useState} from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import{React_App_openWeatherKey} from '@env';
import { useTheme } from '@react-navigation/native';
import * as Network from 'expo-network';
import * as SQLite from "expo-sqlite";
let url = `https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=minutely,hourly,alert&appid=${React_App_openWeatherKey}`;
import useTemperature from "../components/useTemperature";

function openDatabase() {
  const db = SQLite.openDatabase("WeatherAppDB.db");
  return db;
}

const db = openDatabase();


function Home(props) {
  const  themestate  = useTheme();
  const {celciousToFahrentheit, temperatureState} = useTemperature();

  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isForce, setisForce] = useState(false);
  const [errormsg, setErrorMsg] = useState(null)
  const createTables = () => {
    db.transaction((txn) => {
      txn.executeSql(
        " CREATE TABLE IF NOT EXISTS OfflineData (OfflineResult TEXT);",
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

  const loadForecast = async () => {
    setRefreshing(true);
    setisForce(true)

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }
    
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    const response = await fetch( `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const results = await response.json();
    console.log(results);
    if(!response.ok) {
      Alert.alert(`Error retrieving weather data: ${results.message}`); 
    } else {
      return(results);
    }
    setRefreshing(false);
  }


    const saveDataFromSqLite = (results) => {
      let resultStore =  JSON.stringify(results);
      
      db.transaction((txn) => {
      txn.executeSql(
        `INSERT INTO OfflineData (OfflineResult) VALUES (?)`,
        [
          resultStore
        ],
        (sqlTxn, res) => {
          console.log(` OfflineResult added successfully`);
        },
        (error) => {
          console.log("error on adding Location " + error.message);
        }
      );
    })
  }


  
  const getDataFromSqLite = () => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM OfflineData ORDER BY OfflineResult DESC `,
        [],
        (sqlTxn, res) => {
          console.log("OfflineData retrieved successfully");
          let len = res.rows.length;
          //console.log("insert",res.rows);
          if (len <= 0){
            getWeatherData(true)
          }
          else{
            const results = JSON.parse(res.rows.item(0).OfflineResult)
            //console.log('Offline', results)
            setForecast(results)
          }
          
        },
        (error) => {
          console.log("error on getting OfflineData " + error.message);
        }
      );
    });
  };

  

    async function getWeatherData(isForce = false){
      if(isForce){
        const network = await Network.getNetworkStateAsync();
        if (network.isInternetReachable == true){
        const results = await loadForecast();
        await saveDataFromSqLite(results);
        await getDataFromSqLite();
        setErrorMsg(null)
        }
        else{
          Alert.alert(`Network Error! Please refresh again`); 
          setErrorMsg("Error")
        }
      }
      else{ 
        await getDataFromSqLite(); 
        setErrorMsg(null)
      }
    }
  
    const useall = async () => {
      await createTables();
      await getWeatherData();
    };
  useEffect(() => {
    useall();
    
  }, [])

  if (!forecast) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="small" />
      </SafeAreaView>;
  }
  const current = forecast.current.weather[0];

   return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            onRefresh={() => {  getWeatherData(true) }} 
            //refreshing={refreshing}
          />}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{alignItems:'center', textAlign:'center',color:themestate.colors.text}}>Your Location</Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text style={[styles.currentTemp,{color:themestate.colors.text}]}>{temperatureState ? `${celciousToFahrentheit(Math.round(forecast.current.temp))}  °F ` : `${Math.round(forecast.current.temp)}  °C` }</Text>

        </View>
        <Text style={[styles.currentDescription,{color:themestate.colors.text}]}>{current.description}</Text>
        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Image 
              source={require('../assets/temp.png')}
              style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
            />  
            <Text style={{ fontSize: 20, color: 'white', textAlign:'center' }}>{temperatureState ? `${celciousToFahrentheit(Math.round(forecast.current.feels_like))}  °F ` : `${Math.round(forecast.current.feels_like)}  °C` }</Text>
            <Text style={{ fontSize: 20, color: 'white', textAlign:'center' }}>Feels Like</Text>
          </View>
          <View style={styles.info}>
            <Image 
              source={require('../assets/humidity.png')}
              style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
            />
            <Text style={{ fontSize: 20, color: 'white', textAlign:'center' }}>{forecast.current.humidity}% </Text>
            <Text style={{ fontSize: 20, color: 'white', textAlign:'center' }}>Humidity</Text>
          </View>
        </View>
          
        <View>
          <Text style={styles.subtitle}>Daily Forecast</Text>
          <FlatList horizontal
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
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    title: {
      width: '100%',
      textAlign: 'center',
      fontSize: 36,
      fontWeight: 'bold',
      color: '#1C51CD',
    },
    subtitle: {
      fontSize: 24,
      marginVertical: 12,
      marginLeft:7,
      color: '#1C51CD',
    },
    container: {
      flex: 1,
    
      
    },
    loading: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    current: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    currentTemp: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
    },  
    currentDescription: {
      width: '100%',
      textAlign: 'center',
      fontWeight: '200',
      fontSize: 24,
      marginBottom: 5
    },
    hour: {
      padding: 6,
      alignItems: 'center',
    },
    largeIcon: {
      width: 300,
      height: 250,
    },
    smallIcon: {
      width: 100,
      height: 100,
    },
    extraInfo: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: 'space-between',
      padding: 10
    },
    info: {
      width: Dimensions.get('screen').width/2.5,
      backgroundColor: 'rgba(0,0,0, 0.5)',
      padding: 10,
      borderRadius: 15,
      justifyContent: 'center'
    },
    footer: {
      height: 50,
    
    },
  });
      
   

export default Home;
