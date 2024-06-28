import React, { createContext, useState } from 'react';

export const DataContext = createContext();

// @ts-ignore
export function DataProvider({ children }) {
    const [data, setData] = useState("Hello from Layout!");

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
}