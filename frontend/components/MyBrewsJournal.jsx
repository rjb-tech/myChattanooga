import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

export const MyBrewsJournal = ({ brews, isDark }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [patchError, setPatchError] = useState(false);
  const [deletingRelease, setDeletingRelease] = useState(false);
  const [idBeingDeleted, setIdBeingDeleted] = useState();
  const iconColor = isDark === true ? "#f0f0f0" : "#222";

  const expireBrew = async (brewsId) => {
    const token = await getAccessTokenSilently();
    setIdBeingDeleted(brewsId);
    setDeletingRelease(true);
    axios
      .patch(
        "/api/brews?operation=expire",
        {
          id: brewsId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDeletingRelease(false);
        setIdBeingDeleted();
      })
      .catch((error) => setPatchError(true));
  };

  const editBrew = async (brewsId, headline) => {
    const token = await getAccessTokenSilently();
    setIdBeingDeleted(brewsId);
    setDeletingRelease(true);
    axios
      .patch(
        "/api/brews?operation=edit",
        {
          id: brewsId,
          newHeadline: headline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDeletingRelease(false);
        setIdBeingDeleted();
      })
      .catch((error) => setPatchError(true));
  };

  return (
    <div className="flex-col w-5/6 mx-auto h-80">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2 bg-[#f0f0f0] dark:bg-[#222] pb-4 z-50">
        <h3 className="aux-panel-header text-center md:text-left font-bold text-3xl md:text-2xl z-30 text-[#222] dark:text-[#f0f0f0]">
          My Brews
        </h3>
      </div>
      {brews.map((release) => {
        const textColor =
          release.expired === true
            ? "text-red-300"
            : "text-[#222] dark:text-[#f0f0f0]";
        return (
          <div key={release.id} className="py-2">
            <div className="flex mx-auto rounded-xl py-2 w-full border-t-2 border-[#222] dark:border-[#f0f0f0]">
              <div className={"px-4 py-2 w-4/6 " + textColor}>
                {`${release.headline}`}
              </div>
              <div className="flex-auto w-2/6 flex justify-between">
                {/* <motion.button 
                  whileTap={{ scale: 0.85 }} 
                  className='flex-auto bg-[#f0f0f0] dark:bg-[#222] w-1/3 rounded-full z-10'
                  // onClick={() => {handleAuxPanel("account")}}
                >
                  <FontAwesomeIcon className='flex-auto w-5/12 mx-auto' icon={faPencil}/>
                </motion.button> */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="flex-auto bg-[#f0f0f0] dark:bg-[#222] w-1/3 rounded-full z-10"
                  onClick={() => {
                    expireBrew(release.id);
                  }}
                >
                  {idBeingDeleted === release.id && deletingRelease === true ? (
                    <FontAwesomeIcon
                      className="flex-auto w-1/3 mx-auto animate-spin"
                      icon={faSpinner}
                      style={{ color: `${iconColor}` }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="flex-auto w-2/4 mx-auto"
                      icon={faTrash}
                      style={{ color: `${iconColor}` }}
                    />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};