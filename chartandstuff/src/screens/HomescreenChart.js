import React, { useState, useEffect } from 'react';
import { View,Alert, Text, Dimensions, StyleSheet, Button, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';
import Icon from "react-native-vector-icons/Entypo";


const db = SQLite.openDatabase('mydb.db');

const HomeScreen = () => {
  const [data, setData] = useState({});
  const [openInput, setOpenInput] = useState(false)
  const [userAmount, setUserAmount] = useState('')
  const [userDescription, setUserDescription] = useState('')
  const [refreshchart, setrefreshChart] = useState(true)
  



  const createTables = () => {
    db.transaction((txn) => {
      txn.executeSql(
        " CREATE TABLE IF NOT EXISTS savings (id INT, description TEXT, amount REAL );",
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

  const addData = () => {
    let uniqueTimeStamp =  Date.now()
    
    db.transaction((txn) => {
    txn.executeSql(
      `INSERT INTO savings (id,description,amount) VALUES (?,?,?)`,
      [uniqueTimeStamp,
        userDescription,
        userAmount
      ],
      (sqlTxn, res) => {
        console.log(`${userDescription} Data added successfully`);
        alert("You added the Data!");
      },
      (error) => {
        console.log("error on adding Data " + error.message);
      }
    );

  })
  setrefreshChart(!refreshchart)
};

  const SelectData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM savings ORDER BY id ASC',
        [],
        (_, { rows: { _array } }) => {
          const chartData = {
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          };
          if (_array < 1) {
            setData({})
          }
          else {
            let totalSavings = 0;
            _array.forEach((item) => {
              chartData.labels.push(item.description);
              totalSavings += item.amount;
              chartData.datasets[0].data.push(totalSavings);
            });
            setData(chartData)
            console.log("data" + data)
          }
        },
        (txObj, error) => console.log(`Error: ${error.message}`)
      );
    });
  };

  useEffect(() => {
    createTables();
    SelectData();
  }, [refreshchart]);



  return (
    <View style={[styles.container]}>
      <View style={[styles.graphcontainer]}>
        {data == {} ?
          <><Text style={[styles.text]}>Savings over time: </Text><LineChart
            data={data}
            width={Dimensions.get('window').width - 20}
            height={200}
            yAxisLabel="$"
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ borderRadius: 5 }} /></>
          :
          <Text style={[styles.text]}> No Savings Available</Text>
        }

        <TouchableOpacity onPress={() => setOpenInput(!openInput)}>
          <Icon name="plus" style={[styles.AddBtn]} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.bodycontainer}>
      {openInput ? null : <><TextInput
          placeholder="enter your amount"
          keyboardType = 'numeric'
          value={userAmount}
          onChangeText={(text) => setUserAmount(text)}/>
          
          
          <TextInput
            placeholder="enter your description"
            value={userDescription}
            onChangeText={(text) => setUserDescription(text)}/>
            <Button style = {[styles.buttonsave]} title = "Save" 
            onPress={() => {addData();}}/>
            
            
            </>}
    </SafeAreaView>
    </View>
  );
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 10

  },
  text: {
    top: 58,
    left: 19,
    position: "absolute",
    color: "#121212",
    fontSize: 25
  },

  darkMode: {
    top: 130,
    left: 97,
    position: "absolute",
    color: "#121212"
  },

  BarContainer: {
    flex: 1,
    flexDirection: "row",
  },
  BarBox: {
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 4,
  },
  AddBtn: {
    top: 58,
    right: 19,
    position: "absolute",
    color: "#121212",
    fontSize: 25
  },
  graphcontainer: {
    height: Dimensions.get('window').height / 10,
  },
  bodycontainer: {
    flex: 1,
        alignItems: "center",
        justifyContent: "center",
  },
  buttonsave: {
    backgroundColor: '#1C51CD',
    borderRadius: 10,

  }
});
export default HomeScreen;