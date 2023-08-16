import React, { useState, Component } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import EntypoIcon from "react-native-vector-icons/Entypo";
import HomeScreen from "./src/screens/HomeScreen";
import Setting from "./src/screens/Setting";
import LocationScreen from "./src/screens/LocationScreen";
import Calculator from "./src/screens/Calculator";
import { useColorScheme } from "react-native";
import { Provider as ThemeProvider } from "./src/theme/ThemeSelect";
import { useContext } from "react";
const Tab = createMaterialBottomTabNavigator();
import { Context as ThemeContext } from "./src/theme/ThemeSelect";
import History from "./src/screens/History";
import { Provider as TempProvider } from "./src/theme/Temperature";
function TabMenu() {
  return (
    <Tab.Navigator
      labeled={false}
      barStyle={{ backgroundColor: "#1C51CD" }}
      activeColor="black"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={Calculator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon name="location" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="settings" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const Stack = createStackNavigator();
  const { state } = useContext(ThemeContext);
  //console.log(state)
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={state}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabMenu" component={TabMenu} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <TempProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </TempProvider>
  );
};
