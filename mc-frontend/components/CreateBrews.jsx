import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { toggleMobileUserPanel } from "./helpers";

export const CreateBrews = ({ isDark }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auxPanelExpanded, panelExpanded } = useSelector(
    (state) => state.main
  );

  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [formSending, setFormSending] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [postError, setPostError] = useState(false);

  const iconColor = isDark === true ? "#f0f0f0" : "#222";

  var buttonText = "";
  if (formSending === false) {
    if (formSent === true) {
      buttonText = "";
    } else {
      if (postError === true) {
        buttonText = "Error encountered... try again later";
      } else {
        buttonText = "Submit";
      }
    }
  } else {
    <FontAwesomeIcon
      className="h-3/4 w-3/4 mx-auto animate-spin"
      icon={faSpinner}
      style={{ color: `${iconColor}` }}
    />;
  }

  return (
    <div className="flex-col w-4/6 mx-auto">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h3 className="aux-panel-header text-center md:text-left font-bold text-3xl md:text-2xl z-30 text-[#222] dark:text-[#f0f0f0]">
          Create Brews Release
        </h3>
      </div>
      {isAuthenticated && (
        <Formik
          initialValues={{ headline: "" }}
          validationSchema={Yup.object({
            headline: Yup.string()
              .max(255, "Headline too long")
              .required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            // Move this to a seperate function to clean this up eventually
            setFormSending(true);
            const token = await getAccessTokenSilently();
            await axios
              .post(
                "/api/brews",
                {
                  ...values,
                  user: `${user.sub}`,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                setFormSent(true);
                toggleMobileUserPanel(
                  dispatch,
                  auxPanelExpanded,
                  panelExpanded
                );
                setFormSending(false);
                if (window.location.pathname === "/brews") {
                  if (router.query.view !== undefined) {
                    setTimeout(() => {
                      router.push("/brews");
                    }, 450);
                  } else {
                    setTimeout(() => {
                      router.replace("/brews?view=refresh");
                    }, 450);
                  }
                } else {
                  setTimeout(() => {
                    router.push("/brews");
                  }, 200);
                }
              })
              .catch((error) => {
                setFormSending(false);
                setPostError(true);
              })
              .finally(); //set state here
          }}
        >
          <Form className="relative w-full">
            <span className="block relative py-4 w-11/12 mx-auto">
              <label className="text-lg" htmlFor="headline">
                Headline
              </label>
              <span className="block p-1"></span>
              <Field
                className="relative p-2 text-black flex-auto w-full resize-none rounded border border-[#222] dark:border-[#f0f0f0]"
                as="textarea"
                name="headline"
                placeholder="Your headline..."
                type="text"
              />
              <ErrorMessage className="block" name="headline" />
              <span className="block p-1"></span>
              <div className="flex w-32 justify-content-end py-1 border rounded-xl border-[#222] dark:border-[#f0f0f0]">
                <button
                  className="block flex-auto h-6 px-2 text-md bg-[#f0f0f0] dark:bg-[#222] rounded-xl"
                  type="submit"
                >
                  {formSending === true ? (
                    <FontAwesomeIcon
                      className="h-3/4 w-3/4 mx-auto animate-spin"
                      icon={faSpinner}
                      style={{ color: `${iconColor}` }}
                    />
                  ) : formSent === true ? (
                    ""
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </span>
          </Form>
        </Formik>
      )}
    </div>
  );
};
