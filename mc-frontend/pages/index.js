import { useState } from "react"
import { Article } from "../components/Article"


export default function Home(pageProps) {
  return (
    <div className="flex">
      <div className="hidden md:block md:h-fit w-1/6 flex-auto bg-slate-200 mr-4">
        Make this the UserPanel component and import and such. should be sticky and only show on medium screen and up.
        Otherwise the left panel up top will be the toggle for the menu
      </div>

      <div className="flex-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-5/6 bg-white">
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
  )
}
