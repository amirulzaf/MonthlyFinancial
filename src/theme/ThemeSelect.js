
import createContext from "../context/createContext";

const CustomDarkTheme = {
  dark: true,
  colors: {
    primary: "#21130d",
    background: "#2A2A2D",
    card: "#D1C9DE",
    text: "#A6A6B1",
    border: "#D1C9DE",
    notification: "#D1C9DE",
  },
};

const CustomLightTheme = {
  "dark": false,
  colors:{
  background: "#e4e4ee",
  border: "rgb(216, 216, 216)",
   card: "rgb(255, 255, 255)",
    notification: "rgb(255, 59, 48)",
    primary: "rgb(0, 122, 255)",
    text: "rgb(28, 28, 30)", 
},
};

const reducer = (state, action) => {
  console.log(action);

  switch (action.type) {
    case "toggle":
      return state.dark ? CustomLightTheme : CustomDarkTheme;
  }
  return state;
};

const toggleTheme = (dispatch) => {
  return () => {
    dispatch({ type: "toggle" });
  };
};

export const { Context, Provider } = createContext(
  reducer,
  {
    toggleTheme,
  },
  CustomLightTheme
);
