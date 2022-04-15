import { useState } from "react"
import { Article } from "../components/Article"


export default function Home(pageProps) {
  return (
    <div className="flex mx-auto">
      <div className="hidden md:block md:h-fit w-3/12 flex-auto md:mr-2 lg:mr-4 border-r-2">
        <p className="px-4">
          Make this the UserPanel component and import and such. should be sticky and only show on medium screen and up.
          Otherwise the left panel up top will be the toggle for the menu. Do fancy borders and outlines next. Make it look nice
        </p>
      </div>

      <div className="h-full w-full flex-col">
        <h1 className="text-left font-bold text-4xl pl-4 md:pl-6">All Local Articles</h1>
        <div className="flex-auto grid sm:grid-cols-2 md:grid-cols-3 w-full">
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
          <div className="py-2 md:px-2">
            <Article />
          </div>
        </div>
      </div>
    </div>
  )
}
