import React from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import Image from 'next/image'
const axios = require('axios');

export const AccountPanel = () => {
  const { user, logout, isLoading } = useAuth0();
  // There will need to be some sort of check here for if a user is already logged in, etc.
  return (
    <div className="w-4/6 md:w-5/6 mx-auto pb-4">
      <h3 
        className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF] pb-6"
      >
        Account
      </h3>
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