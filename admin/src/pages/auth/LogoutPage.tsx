import { useEffect } from "react";
import {signOut} from "../../lib/utils/sign-out";
import {FullScreenLoader} from "../../components/common/FullScreenLoader";


export const LogoutPage = () => {
    useEffect(() => {
        const _signOut = async () => {
            await signOut();
            window.location.href = "/login";
        };
        _signOut();
    }, []);

    return <FullScreenLoader />;
};