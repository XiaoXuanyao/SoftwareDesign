import * as React from "react";

export const GlobalVarsContext = React.createContext();

export function GlobalVarProvider({ children }) {
    const [userid, setUserid] = React.useState(null);

    return (
        <GlobalVarsContext.Provider value={{
            userid, setUserid 
        }}>
            {children}
        </GlobalVarsContext.Provider>
    );
}