import React,{useReducer} from "react";
export default (reducerFun,actions,initialState)=>{
    const Context = React.createContext();
    const Provider = ({children}) =>{

        const [state,dispatch] = useReducer(reducerFun,initialState);
        let barrelActions = {};
        for(let key in actions){
            barrelActions[key] = actions[key](dispatch);
        }
        return <Context.Provider value={{state,...barrelActions}}>
            {children}
        </Context.Provider>
    }
    return {Context,Provider};
}