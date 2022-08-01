import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import Image from 'next/image'
const axios = require('axios');

const variants = {
  loading: {opacity: 0},
  loaded: {opacity: 1}
}

export const AccountPanel = () => {
  // This is very bloated state, but oh well we here
  const { user, logout, isLoading, getAccessTokenSilently } = useAuth0();
  const [ confirmingPasswordReset, setConfirmingPasswordReset ] = useState(false)
  const [ emailSent, setEmailSent ] = useState(false)
  const [ shouldFadeString, setShouldFadeString ] = useState(false)
  const [ fetchError, setFetchError ] = useState(false)

  var passwordButtonString = "Change Password"
  if (emailSent === false) {
    if (confirmingPasswordReset === true) {
      passwordButtonString = "Click to confirm"
    }
    if (fetchError === true) {
      passwordButtonString = "Error, try again later"
    }
  }
  else {
    passwordButtonString = "Check your email!"
  }

  // There will need to be some sort of check here for if a user is already logged in, etc.
  return (
    <div className="w-4/6 md:w-5/6 mx-auto pb-4">
      <h3 
        className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF] pb-6"
      >
        Account
      </h3>
      <div className="pb-6 h-1/3 w-1/3 mx-auto">
        <Image 
          className="rounded-full"
          src={user.picture}
          height={1}
          width={1}
          layout="responsive"
          alt={user.name}
        />
      </div>
      <div className="py-1 md:py-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:border-[#F7BCB1]"
          onClick={async () => 
            {
              const token = await getAccessTokenSilently()
              if (confirmingPasswordReset === true && emailSent === false) {
                setShouldFadeString(true)
                axios
                  .post(
                    `/api/reset-password?email=${user.email}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                  )
                  .then((response) => 
                    {
                      setShouldFadeString(false)
                      setEmailSent(true)
                      setConfirmingPasswordReset(false)
                    }
                  )
                  .catch(error => {
                    setShouldFadeString(false)
                    setFetchError(true)
                  })
              }
              if (emailSent === false) {
                setConfirmingPasswordReset(confirmingPasswordReset===true ? false : true) 
              }
            }
          }
        >
          <motion.p
            variants={variants}
            animate={shouldFadeString===true ? 'loading' : 'loaded'}
            transition={{ duration: shouldFadeString ? 0 : 0.3 }}
          >
            {passwordButtonString}
          </motion.p>
        </motion.button>
      </div>
      <div className="py-1 md:py-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:border-[#F7BCB1]"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </motion.button>
      </div>
    </div>
  )  
}