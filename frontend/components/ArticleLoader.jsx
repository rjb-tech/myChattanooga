import { EmptyArticle } from "./EmptyArticle";

export const ArticleLoader = () => {
  return (
    <>
      <div className="py-2 sm:px-2">
        <EmptyArticle />
      </div>
      <div className="py-2 sm:px-2">
        <EmptyArticle delay={200} />
      </div>
      <div className="py-2 sm:px-2">
        <EmptyArticle delay={400} />
      </div>
      <div className="py-2 sm:px-2">
        <EmptyArticle delay={600} />
      </div>
      <div className="py-2 sm:px-2">
        <EmptyArticle delay={800} />
      </div>
      <div className="py-2 sm:px-2">
        <EmptyArticle delay={1000} />
      </div>
    </>
  );
};
