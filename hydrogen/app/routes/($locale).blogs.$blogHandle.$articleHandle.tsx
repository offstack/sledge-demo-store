import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type V2_MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';

export async function loader({params, context, request}: LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle, articleHandle},
  });

  const seo = seoPayload.article({
    article: blog.articleByHandle,
    url: request.url,
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return defer({article, seo});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="/assets/images/photo-1581084324492-c8076f130f86.avif"
          alt="Blog Header"
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
              {title}
            </h2>
          </div>
        </div>
      </div>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
        <div style={{marginBottom: 24}}>
          <p>Created at : {publishedDate}</p>
          <p>Author : {author.name}</p>
        </div>
        <div style={{marginBottom: 50}}>
          {image && (
            <Image
              data={image}
              className="w-full h-[450px] object-cover"
              loading="eager"
            />
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: contentHtml,
          }}
        />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
