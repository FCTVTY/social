import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";




export function getApiDomain() {
    const apiUrl = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3001';
    console.log(apiUrl);
    return apiUrl;
}

export function getWebsiteDomain() {
    const websiteUrl = window.location.host;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "Footfallfit",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [EmailPassword.init(), Session.init(),
                 ],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};


export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};



export const initSuperTokens = () => {


    SuperTokens.init(SuperTokensConfig);
};
