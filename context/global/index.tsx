import React, { createContext, useReducer, Dispatch, ReactNode } from "react";

interface GlobalState {
    apiBase: string;
}

type GlobalAction = {
    state: Partial<GlobalState>;
    type: "SET_STATE";
}

interface GlobalContext extends GlobalState {
    dispatch: Dispatch<GlobalAction>;
}

const initGlobalState: GlobalState = {
    apiBase: 'http://localhost:3030'
}

const Context = createContext<GlobalContext>(
    initGlobalState as GlobalContext
);

const { Provider } = Context;

export const GlobalProvider: React.FC<{ children: ReactNode }> = (props) => {
    
    const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
        switch (action.type) {
            case "SET_STATE":
                return { ...state, ...action.state };
            default:
                return { ...state };
        }
    };

    const [state, dispatch] = useReducer(reducer, initGlobalState);

    return (
        <Provider value={{ ...state, dispatch }}>
            {props.children}
        </Provider>)
    
}

export default Context

// export const apiBase: string = 'http://localhost:3030'