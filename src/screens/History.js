import * as SQLite from "expo-sqlite";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { useTheme } from "@react-navigation/native";

function openDatabase() {
  const db = SQLite.openDatabase("WeatherAppDB.db");
  return db;
}

const db = openDatabase();

const History = ({ navigation }) => {
  const themestate = useTheme();
  const [LocationHistory, SetLocationHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  /*
  const deleteLocationHistory = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'DELETE FROM users WHERE Location = ?', 
        [Location],
        (sqlTxn, res) => {
          console.log("Data delete successfully");
        },
        (error) => {
          console.log("error on deleting data " + error.message);
        }
      );
    });
  }
  */
  
  const getLocationHistory = () => {
    setRefreshing(true);
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM LocationHistory ORDER BY Location `,
        [],
        (sqlTxn, res) => {
          console.log("LocationHistory retrieved successfully");
          let len = res.rows.length;
          console.log(res.rows);
          if (len >= 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({ Location: item.Location, UniqueID: item.UniqueID});
              console.log('sini',item.Location)
            }

            SetLocationHistory(results);
          }
        },
        (error) => {
          console.log("error on getting LocationHistory " + error.message);
        }
      );
    });
    setRefreshing(false);
  };

  const renderLocation = ({ item }) => {
    return (
      <View
        style={{
          //flexDirection: "row",
          right: 0,
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderBottomWidth: 5,
          borderColor: "#ddd",
        }}
      >
        <Text style= {[styles.text,{ color: themestate.colors.text }]}>{item.Location}</Text>
        
        <TouchableOpacity
        style = {{left :60 }}
          onPress={() => {
            alert("You delete the data in History!");
            db.transaction((txn) => {
              txn.executeSql(
                'DELETE FROM LocationHistory WHERE UniqueID = ?',
                [item.UniqueID], 
                (sqlTxn, res) => {
                  console.log("Data delete successfully");
                },
                (error) => {
                  console.log("error on deleting data " + item.Location);
                }
              );
            });
            getLocationHistory();
            //addLocation(locationsave);
          }}
        >
          <Icon name="delete-forever" style={[styles.Buttondlt, ,{ color: themestate.colors.text }]}></Icon>
        </TouchableOpacity>
      </View>
    );
  };
  

  const getAll = async () => {
    await createTables();
    await getLocationHistory();
  };

  useEffect(() => {
    getAll();
    console.log('nak tengok',LocationHistory)
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.myLocation, { color: themestate.colors.text }]}>
          History
        </Text>
        <TouchableOpacity
          style={styles.saveBtnContainer}
          onPress={() => navigation.navigate("TabMenu")}
        >
          <Icon name="keyboard-backspace" style={[styles.saveBtn]}></Icon>
        </TouchableOpacity>
      </View>
      {refreshing ? null : 
      <FlatList
        data={LocationHistory}
        renderItem={renderLocation}
        key={(cat) => cat.id}

      />
  }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
    fontSize: 40,
  },
  HistoryScreen: {
    top: 10,
    left: 380,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 24,
  },

  header: {
    height: 50,
    flexDirection: "row",
  },
  Buttondlt:{
    top: -25,
    left: 300,
    fontSize: 35,
  },
  text:{
    fontSize:20,
  }

});

export default History;
