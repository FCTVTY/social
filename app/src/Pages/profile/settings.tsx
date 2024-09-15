import { useEffect, useState } from "react";
import { Profile, Meta } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { sendPasswordResetEmail } from "supertokens-auth-react/recipe/emailpassword";
import { Link } from "react-router-dom";

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fetchDetails = async () => {
    try {
      const Presponse = await axios.get(`${getApiDomain()}/profile`);
      const profileData = Presponse.data;

      setProfile(profileData);
      setFirstName(profileData.first_name);
      setLastName(profileData.last_name);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${getApiDomain()}/updateMeta`, {
        first_name: firstName,
        last_name: lastName,
      });

      if (response.status === 200) {
        // Assuming the meta update includes profile updates too
        const updatedMeta = response.data;
        setMeta(updatedMeta);

        window.alert("Profile updated successfully");
      } else {
        window.alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      window.alert("Error updating profile.");
    }
  };

  async function PasswordChange(): void {
    try {
      let response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: profile?.email,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            window.alert(formField.error);
          }
        });
      } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
        // account linking error
      } else {
        window.alert("Please check your email for the password reset link");
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
      }
    }
  }
  function maskEmail(email) {
    // Split the email into the local part and the domain part
    const [localPart, domain] = email.split("@");

    // Mask the local part: keep the first character, mask the middle, keep the last character
    let maskedLocal;
    if (localPart.length > 2) {
      maskedLocal =
        localPart[0] +
        "*".repeat(localPart.length - 2) +
        localPart[localPart.length - 1];
    } else {
      // If the local part is too short to mask, just return the original
      maskedLocal = localPart;
    }

    // Split the domain into the domain name and the top-level domain (TLD)
    const [domainName, tld] = domain.split(".");

    // Mask the domain name: keep the first character, mask the rest
    const maskedDomain = domainName[0] + "*".repeat(domainName.length - 1);

    // Combine the masked local part, masked domain name, and TLD
    return `${maskedLocal}@${maskedDomain}.${tld}`;
  }

  return (
    <main className="min-h-screen">
      {profile && (
        <div className="divide-y divide-white/5 max-w-7xl mx-auto">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-grey-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Use a permanent email address where you can receive mail.
              </p>
            </div>

            <form className="md:col-span-2" onSubmit={handleSave}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <img
                    src={profile?.profilePicture}
                    alt=""
                    className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                  />
                  <div>
                    <Link
                      to={`/onboarding`}
                      type="button"
                      className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-grey-900 shadow-sm hover:bg-white/20"
                    >
                      Change avatar
                    </Link>
                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-grey-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-grey-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>

                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-grey-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-grey-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-grey-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={maskEmail(profile?.email)}
                      autoComplete="email"
                      readOnly
                      className="block w-full rounded-md border-0 bg-gray-400/5 py-1.5 text-grey-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-grey-900">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Update your password associated with your account.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"></div>

              <div className="mt-8 flex">
                <a
                  href="#"
                  onClick={() => PasswordChange()}
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Change Password
                </a>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-grey-900">
                Delete account
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
              </p>
            </div>

            <form className="flex items-start md:col-span-2">
              <a
                href="/auth/deleteAccount"
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
              >
                Yes, delete my account
              </a>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
