import { Contact } from "components/global";
import { SearchResultPage } from "components/sledge/instantsearch";
import { getPage } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const page = await getPage(params.handle);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const page = await getPage(params.handle);

  if (!page) return notFound();

  if (page.handle === "search-result") {
    return (
      <section className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
        <SearchResultPage />
      </section>
    );
  }

  if (page.handle === "contact-us") {
    return (
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
        <Suspense>
          <Contact />
        </Suspense>
      </div>
    );
  }

  return (
    <div>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="/images/photo-1581084324492-c8076f130f86.avif"
          alt={"Page Header"}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
        </div>
        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
        </div>
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto">
            <h2 className="text-white text-center text-xl lg:text-[48px] font-bold">
              {page?.title}
            </h2>
          </div>
        </div>
      </div>
      <div
        className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8"
        dangerouslySetInnerHTML={{ __html: page?.body }}
      />
    </div>
  );
}
