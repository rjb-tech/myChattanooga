import { useState } from "react"
import { Article } from "../components/Article"


export default function Home(pageProps) {
  return (
    <div className="flex">
      <div className="hidden md:block sticky w-1/6 flex-auto">
        Make this the UserPanel component and import and such. should be sticky
      </div>
      {/* Userpanel here? */}
      <div className="flex-auto md:flex md:flex-wrap w-5/6 justify-evenly">
        <div className="py-2 md:p-2 md:flex-auto">
          <Article />
        </div>
        <div className="py-2 md:p-2 md:flex-auto">
          <Article />
        </div>
        <div className="py-2 md:p-2 md:flex-auto">
          <Article />
        </div>

      </div>
    </div>
  )
}
