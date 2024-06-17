import { signOut as supertokensSignOut } from "supertokens-auth-react/recipe/session";


export async function signOut() {
    await supertokensSignOut();
    window.location.href = "/login";
}