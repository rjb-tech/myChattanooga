import React, { useEffect, useState } from "react"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/router"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const CreateBrews = ({ toggleMobileUserPanel, isDark }) => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [ formSending, setFormSending ] = useState(false)
  const [ formSent, setFormSent ] = useState(false)
  const [ postError, setPostError ] = useState(false)
  const router = useRouter()

  const iconColor = isDark===true ? '#FFF' : "#222"

  return (
    <div className="flex-col w-4/6 mx-auto">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h3 
          className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]"
        >
          Create New Release
        </h3>
      </div>
      {isAuthenticated && 
        <Formik
          initialValues={{ headline: '' }}
          validationSchema={Yup.object({
            headline: Yup.string()
              .max(255, "Headline too long")
              .required("Required")
          })}
          onSubmit={async (values, { setSubmitting }) => {
            // Move this to a seperate function to clean this up eventually
            setFormSending(true)
            const token = await getAccessTokenSilently();
            const publisherMetadata = await axios.get(`/api/get-metadata?user=${user.sub}`, {headers: {'Authorization': `Bearer ${token}`}});
            await axios
              .post(
                "/api/brews", 
                {
                  ...values,
                  publisher: publisherMetadata.data.app_metadata.publisher
                }, 
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              )
              .then((response) => {
                setFormSent(true)
                toggleMobileUserPanel()
                setFormSending(false)
                setTimeout(() => {
                  router.push("/brews")
                }, 200)
              })
              .catch(error => console.error(error))
              .finally() //set state here
          }}
        >
          <Form className="relative w-full">
            <span className="block relative py-4 w-11/12 mx-auto">
              <label className="text-lg" htmlFor="headline">Headline</label>
              <span className="block p-1"></span>
              <Field 
                className="relative p-2 text-black flex-auto w-full resize-none rounded" 
                as="textarea" 
                name="headline" 
                placeholder="Your headline..." 
                type="text" 
              />
              <ErrorMessage 
                className="block" 
                name="headline"
              />
              <span className="block p-1"></span>
              <div className="flex w-32 justify-content-end py-1 border rounded-md border-[#222] dark:border-[#fff]">
                <button 
                  className="block flex-auto h-6 px-2 text-md bg-[#fff] dark:bg-[#222] rounded-md" 
                  type="submit"
                >
                  {formSending === true 
                    ? <FontAwesomeIcon className='h-3/4 w-3/4 mx-auto animate-spin' icon={faSpinner} style={{color: `${iconColor}`}} />
                    : formSent === true ? '' : 'Submit'
                  }
                </button>
              </div>
            </span>
          </Form>
        </Formik>
      } 
    </div>
  )
}