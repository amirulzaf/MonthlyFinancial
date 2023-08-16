import React, { Component } from "react";
import { StyleSheet, View, Text, Switch ,TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { useTheme } from '@react-navigation/native';
import { Context as ThemeContext } from "../theme/ThemeSelect";
import { useContext } from "react";
import useTemperature from "../components/useTemperature"; 

const Setting = (props) => {
const  themestate  = useTheme();
const { state, toggleTheme} = useContext(ThemeContext);
const {temperatureState, toggleTemperature} = useTemperature ();
//console.log(state.dark)

console.log('current',state)

  return (
    <View style={[styles.container] }>
      <Text style ={[styles.text,{color:themestate.colors.text}]}>Setting</Text>

      <Switch style={styles.materialSwitch} value = {state.dark} onValueChange = {toggleTheme}/>
      
      <Text style={{...styles.darkMode,color:themestate.colors.text}}>Dark Mode</Text>
      <Icon name="adjust" style={styles.icon}></Icon>
      <Text style={[styles.farenheit,{color:themestate.colors.text}]}>Celcius - Farenheit</Text>
      <Switch style={styles.materialSwitch2} onValueChange={toggleTemperature} value={temperatureState}/>
    </View>
  );
}
/*
const scheme = useColorScheme();
console.log(scheme)
return <></>
}*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  text: {
    top: 58,
    left: 19,
    position: "absolute",
    color: "#121212",
    fontSize: 25
  },
  materialSwitch: {
    width: 45,
    height: 23,
    position: "absolute",
    left: 277,
    top: 127,
    borderRadius: 48
  },
  materialSwitch2: {
    width: 45,
    height: 23,
    position: "absolute",
    left: 277,
    top: 190,
    borderRadius: 48
  },
  darkMode: {
    top: 130,
    left: 97,
    position: "absolute",
    color: "#121212"
  },
  footer1: {
    height: 49,
    marginTop: 760
  },
  icon: {
    top: 116,
    left: 32,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 40
  },
  materialRadio: {
    height: 40,
    width: 40,
    position: "absolute",
    left: 43,
    top: 187
  },
  farenheit: {
    top: 198,
    left: 83,
    position: "absolute",
    color: "#121212"
  },
  materialRadio1: {
    height: 40,
    width: 40,
    position: "absolute",
    left: 234,
    top: 187
  },
  celcius: {
    top: 198,
    left: 286,
    position: "absolute",
    color: "#121212"
  }
});

export default Setting;
