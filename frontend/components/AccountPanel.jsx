import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const variants = {
  loading: { opacity: 0 },
  loaded: { opacity: 1 },
};

export const AccountPanel = ({ isDark }) => {
  // This is very bloated state, but oh well we here
  const { user, logout, isLoading, getAccessTokenSilently } = useAuth0();
  const [confirmingPasswordReset, setConfirmingPasswordReset] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [shouldFadeString, setShouldFadeString] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const iconColor = isDark === true ? "#f0f0f0" : "#222";

  var passwordButtonString = "Change Password";
  if (emailSent === false) {
    if (confirmingPasswordReset === true) {
      passwordButtonString = "Click to confirm";
    }
    if (fetchError === true) {
      passwordButtonString = "Error... try again later";
    }
  } else {
    passwordButtonString = "Check your email!";
  }

  // There will need to be some sort of check here for if a user is already logged in, etc.
  return (
    <div className="w-4/6 md:w-5/6 mx-auto pb-4 md:pt-2">
      <h3 className="aux-panel-header text-center md:text-left font-bold text-3xl md:text-2xl z-30 text-[#222] dark:text-[#f0f0f0] pb-6 mx-auto w-1/2">
        Account
      </h3>
      <div className="pb-6 h-5/12 w-5/12 mx-auto"></div>
      <div className="py-1 md:py-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="block flex-auto mx-auto border h-10 rounded-xl w-full md:w-10/12 hover:border-[#F7BCB1] border-[#222] dark:border-[#f0f0f0]"
          onClick={async () => {
            const token = await getAccessTokenSilently();
            if (confirmingPasswordReset === true && emailSent === false) {
              setShouldFadeString(true);
              axios
                .post(
                  `/api/reset-password?email=${user.email}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  setShouldFadeString(false);
                  setEmailSent(true);
                  setConfirmingPasswordReset(false);
                })
                .catch((error) => {
                  setShouldFadeString(false);
                  setFetchError(true);
                });
            }
            if (emailSent === false) {
              setConfirmingPasswordReset(
                confirmingPasswordReset === true ? false : true
              );
            }
          }}
        >
          {shouldFadeString === true ? (
            <FontAwesomeIcon
              className="h-3/4 w-3/4 mx-auto animate-spin"
              icon={faSpinner}
              style={{ color: `${iconColor}` }}
            />
          ) : (
            passwordButtonString
          )}
        </motion.button>
      </div>
      <div className="py-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="block flex-auto mx-auto border h-10 rounded-xl w-full md:w-10/12 hover:border-[#F7BCB1] border-[#222] dark:border-[#f0f0f0]"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};