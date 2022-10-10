import Link from "next/link";
import { useEffect } from "react";

// Hide filters here
export default function Faq({
  pageContent,
  setPageContent,
  currentPage,
  setCurrentPage,
  contentLoading,
  setContentLoading,
}) {
  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);
  return (
    <div className="mx-auto">
      <div className="h-full w-full flex-col px-6">
        <div className="w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2 text-[#222] dark:text-[#f0f0f0] text-left">
          <h1 className="font-bold text-3xl md:text-4xl pt-3">
            About myChattanooga
          </h1>
          <p className="py-4">
            myChattanooga was made with the goal of keeping Chattanooga-area
            residents up to date with the local news. Designed as a one-stop
            shop for Chattanooga news, myChattanooga sifts through each local
            news site to only show you articles that are relevant to Chattanooga
            and the surrounding region. No national or statewide news (that
            doesn&apos;t mention Chattanooga) will be shown in an effort to only
            highlight news from our community. Local news awareness is more
            important than ever, and we thank you for using myChattanooga.
          </p>
          <h1 className="font-bold text-3xl md:text-4xl pt-8">
            How does it work?
          </h1>
          <p className="py-4">
            myChattanooga&apos;s news scraping algorithm scans local news sites
            for all of today&apos;s available articles to determine if they are
            relevant (more on relevancy below). The scraper is run multiple
            times every hour, so what you see on the homepage is always
            up-to-date. The sources we scrape are listed below. NOTE: If you
            know of another reliable site that provides news for the region,
            please contact us using the email at the bottom of this page.
          </p>
          <div className="text-[#F39887]">
            <Link href="https://www.chattanoogan.com/">
              <a target="_blank">The Chattanoogan</a>
            </Link>
            <br></br>
            <Link href="http://www.chattanoogapulse.com/">
              <a target="_blank">Chattanooga Pulse</a>
            </Link>
            <br></br>
            <Link href="https://www.timesfreepress.com/">
              <a target="_blank">Chattanooga Times Free Press</a>
            </Link>
            <br></br>
            <Link href="https://foxchattanooga.com/">
              <a target="_blank">Fox Chattanooga</a>
            </Link>
            <br></br>
            <Link href="https://www.local3news.com/">
              <a target="_blank">Local 3 News</a>
            </Link>
            <br></br>
            <Link href="https://noogatoday.6amcity.com/category/news/">
              <a target="_blank">Nooga Today</a>
            </Link>
            <br></br>
            <Link href="https://wdef.com/">
              <a target="_blank">WDEF News 12</a>
            </Link>
            <br></br>
          </div>
          <h1 className="font-bold text-3xl md:text-4xl pt-8">
            What makes an article relevant?
          </h1>
          <p className="py-4">
            The algorithm currently searches articles and headlines for keywords
            referring to Chattanooga or the surrounding region (in Tennessee).
            Any match of a keyword results in that article being flagged as
            relevant, while articles that mention other states or do not have
            any keyword matches are passed over. We still recommend going to
            each news source&apos;s website to see what else they have published
            throughout the day.
          </p>
          <h1 className="font-bold text-3xl md:text-4xl pt-8">
            Where can I provide feedback and/or suggestions?
          </h1>
          <p className="py-4">
            Please send all feedback and inquiries to{" "}
            <Link href="mailto:feedback@mychattanooga.app">
              <a className="text-[#F39887]">feedback@mychattanooga.app</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
