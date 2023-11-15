type IAccordionItem = {
  title: string;
  description: string | React.ReactNode;
};

export default function Accordions({
  accordions,
}: {
  accordions: IAccordionItem[];
}) {
  return (
    <section
      aria-labelledby="details-heading"
      className="mt-[20px] lg:mt-[40px]"
    >
      {accordions.map((item, index) => {
        return <Item item={item} index={index} key={index} />;
      })}
    </section>
  );
}

const Item = ({ item, index }: { item: IAccordionItem; index: number }) => (
  <div
    className="pt-[18px] lg:pt-[22px] hover:opacity-75 first:pt-0"
    key={index}
  >
    <details className="group" {...(index === 0 && { open: true })}>
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
        <h6 className="leading-[21.6px] font-bold text-white">{item.title}</h6>
        <span className="transition group-open:rotate-180">
          <svg
            fill="none"
            height={24}
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width={24}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="break-all mt-[12px] lg:mt-[16px] font-inter font-medium text-dark4 text-[12px] lg:text-[16px] leading-[25.6px] tracking-[-2%] group-open:animate-fadeIn">
        {item.description}
      </div>
    </details>
  </div>
);
