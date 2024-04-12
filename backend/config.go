/*
 * Copyright (c) 2024.  Footfallfit & FICTIVITY. All rights reserved.
 * This code is confidential and proprietary to Footfallfit & FICTIVITY.
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 *
 * Authors:
 *
 * [@sam1f100](https://www.github.com/sam1f100)
 *
 */

package main

import (
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/dashboard/dashboardmodels"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword/epmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/usermetadata"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
)

var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://core.bhivecommunity.co.uk",
	},
	AppInfo: supertokens.AppInfo{
		AppName:       "SuperTokens Demo App",
		APIDomain:     "https://sdk.bhivecommunity.co.uk",
		WebsiteDomain: "https://app.bhivecommunity.co.uk",
	},
	RecipeList: []supertokens.Recipe{
		userroles.Init(nil),
		emailpassword.Init(&epmodels.TypeInput{
			SignUpFeature: &epmodels.TypeInputSignUp{
				FormFields: []epmodels.TypeInputFormField{
					{ID: "email"},
					{ID: "password"},
					{ID: "first_name"},
					{ID: "last_name"},
				},
			},
			Override: &epmodels.OverrideStruct{

				APIs: func(originalImplementation epmodels.APIInterface) epmodels.APIInterface {
					// First we copy the original implementation
					originalEmailPasswordSignUpPOST := *originalImplementation.SignUpPOST

					*originalImplementation.SignUpPOST = func(formFields []epmodels.TypeFormField, tenantId string, options epmodels.APIOptions, userContext supertokens.UserContext) (epmodels.SignUpPOSTResponse, error) {

						// First we call the original implementation
						resp, err := originalEmailPasswordSignUpPOST(formFields, tenantId, options, userContext)
						if err != nil {
							return epmodels.SignUpPOSTResponse{}, err
						}

						// if sign up was successful
						if resp.OK != nil {
							// TODO: The input of this function is the formFields array.
							// You can also retrieve the user object like this:
							user := resp.OK.User
							_, err = usermetadata.UpdateUserMetadata(user.ID, map[string]interface{}{
								"first_name": formFields[2].Value,
								"last_name":  formFields[3].Value,
								"roles":      []string{"user"},
							})

						}

						return resp, err
					}

					return originalImplementation
				},

				Functions: func(originalImplementation epmodels.RecipeInterface) epmodels.RecipeInterface {
					originalSignUp := *originalImplementation.SignUp

					*originalImplementation.SignUp = func(email, password string, tenant string, userContext supertokens.UserContext) (epmodels.SignUpResponse, error) {

						response, err := originalSignUp(email, password, tenant, userContext)
						if err != nil {
							return epmodels.SignUpResponse{}, err
						}

						return response, err
					}
					return originalImplementation
				},
			},
			EmailDelivery: nil,
		}),
		session.Init(nil),
		usermetadata.Init(nil),
		dashboard.Init(&dashboardmodels.TypeInput{
			Admins: &[]string{
				"samwood1989@gmail.com",
			},
		}),
	},
}
