export function GenericError({
  error,
}: {
  error?: { message: string; stack?: string };
}) {
  const heading = (
    <h1 className="text-[48px] lg:text-[min(10vw,_144px)] font-medium leading-[48px] lg:leading-[min(10vw,_144px)] tracking-[-2.88px]">
      <span className="bg-[linear-gradient(102deg,_#43C6AC_9.83%,_#F8FFAE_58.53%)] bg-clip-text [-webkit-text-fill-color:transparent]">
        Whoops!
      </span>{" "}
      Something Wrong.
    </h1>
  );
  let description = `We’re investigating the problem impacting demo store outage, sorry for the inconvenience. Please come back later.`;

  console.log("error", error);

  // TODO hide error in prod?
  if (error?.stack) {
    description += `\n${error.message}`;
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <div
      className="pt-[80px] pb-[56px] flex flex-col-reverse lg:flex-row gap-[57px] lg:gap-0 text-white text-center lg:text-start 
        justify-center lg:justify-start mx-auto max-w-[1440px] [@media(max-width:1440px)]:overflow-x-hidden min-h-screen h-full"
    >
      <div className="flex flex-col max-w-[625px] mx-auto lg:m-0 px-[40px] lg:px-[80px] lg:pr-[0] h-full lg:h-auto">
        {heading}
        <p className="font-inter text-[14px] lg:text-[20px] leading-[22.4px] lg:leading-[32px] tracking-[-0.4px] mt-[16px] max-w-[515px]">
          {description}
        </p>
        {error?.stack && (
          <pre
            style={{
              padding: "2rem",
              background: "hsla(10, 50%, 50%, 0.1)",
              color: "red",
              overflow: "auto",
              maxWidth: "100%",
              marginTop: "20px",
            }}
            dangerouslySetInnerHTML={{
              __html: addLinksToStackTrace(error.stack),
            }}
          />
        )}
        <a
          href="mailto:support@sledge-app.com"
          target={"_blank"}
          className="font-inter text-[14px] lg:text-[20px] leading-[22.4px] lg:leading-[32px] tracking-[-0.4px] font-normal mt-auto"
        >
          support@sledge-app.com
        </a>
      </div>
      <div className="w-full">
        <img
          className="max-w-[223.64px] w-full lg:max-w-full max-h-[656.43px] m-auto lg:ml-[60px]"
          src="/images/whoops.png"
          alt="whoops"
        />
      </div>
    </div>
  );
}

function addLinksToStackTrace(stackTrace: string) {
  return stackTrace?.replace(
    /^\s*at\s?.*?[(\s]((\/|\w\:).+)\)\n/gim,
    (all, m1) =>
      all.replace(
        m1,
        `<a href="vscode://file${m1}" class="hover:underline">${m1}</a>`
      )
  );
}
