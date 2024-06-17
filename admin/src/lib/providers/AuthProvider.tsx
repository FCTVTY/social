import { hotjar } from "react-hotjar";
import { createContext, useContext, useEffect, useMemo } from "react";


const AuthProviderContext = createContext<{
    currentUser: string
    isLoading: boolean;
}>({
    currentUser: "string",
    isLoading: false,
});

export const useAuthContext = () => useContext(AuthProviderContext);

export const AuthProvider = ({  }) => {




    return (
       <></>
    );
};