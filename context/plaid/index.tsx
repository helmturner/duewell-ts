import { createContext, useReducer, Dispatch, ReactNode } from "react";

interface PlaidState {
    linkSuccess: boolean;
    isItemAccess: boolean;
    linkToken: string | null;
    accessToken: string | null;
    itemId: string | null;
    isError: boolean;
    backendAvailable: boolean;
    products: string[];
    linkTokenError: {
        error_message: string;
        error_code: string;
        error_type: string;
    };
}

type PlaidAction = {
    state: Partial<PlaidState>;
    type: "SET_STATE";
}

interface PlaidContext extends PlaidState {
    dispatch: Dispatch<PlaidAction>;
}

const initPlaidState: PlaidState = {
    linkSuccess: false,
    isItemAccess: true,
    linkToken: "", // Don't set to null or error message will show up briefly when site loads
    accessToken: null,
    itemId: null,
    isError: false,
    backendAvailable: true,
    products: ['transactions'],
    linkTokenError: {
        error_message: "",
        error_code: "",
        error_type: ""
    }
}

const Context = createContext<PlaidContext>(
    initPlaidState as PlaidContext
);

const { Provider } = Context;

export const PlaidProvider: React.FC<{ children: ReactNode }> = (props) => {
    
    const reducer = (state: PlaidState, action: PlaidAction): PlaidState => {
        switch (action.type) {
            case "SET_STATE":
                return { ...state, ...action.state };
            default:
                return { ...state };
        }
    };
    
    const [state, dispatch] = useReducer(reducer, initPlaidState);
    
    return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};
  
export default Context;