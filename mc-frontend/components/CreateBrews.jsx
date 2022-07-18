import React from "react"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export const CreateBrews = () => {
  // Await access token here
  return (
    <div className="flex-col w-4/6 mx-auto">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h3 
          className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]"
        >
          Create New Release
        </h3>
      </div>
      <Formik
        initialValues={{ headline: '' }}
        validationSchema={Yup.object({
          headline: Yup.string()
            .max(255, "Headline too long")
            .required("Required")
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false)
          }, 400)
          // axios.post to /brews/pour here
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
              <button className="block flex-auto h-6 px-2 text-md pb-4 bg-[#fff] dark:bg-[#222] rounded-md" type="submit">Submit</button>
            </div>
          </span>
        </Form>
      </Formik> 
    </div>
  )
}