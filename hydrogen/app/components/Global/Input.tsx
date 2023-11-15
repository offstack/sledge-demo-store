interface InputInterface {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  colSpan?: string;
  autoComplete?: 'on' | 'off';
  required?: boolean;
  className?: any;
  quantityState?: number;
  setQuantityState: any;
  maxQuantity: number;
}

export function Input({
  label,
  type,
  name,
  placeholder,
  colSpan = 'col-span-3',
  autoComplete = 'on',
  required = true,
  className,
  quantityState,
  setQuantityState,
  maxQuantity,
  ...props
}: any) {
  return (
    <>
      {(type === 'quantity' && (
        <div className="w-fit">
          <label htmlFor={name} className="sr-only">
            {label}
          </label>
          <div className="flex items-center bg-dark2 rounded-[8px] py-[4px] px-[8px]">
            <button
              type="button"
              className="flex justify-center items-center text-dark4 w-[16px] h-[16px] transition hover:opacity-75"
              onClick={() => {
                if (quantityState > 1) setQuantityState(quantityState - 1);
              }}
            >
              -
            </button>
            <input
              {...props}
              type="number"
              id={name}
              name={name}
              min="1"
              onChange={(e) => {
                if (Number(e.target.value) === 0) e.target.value = '1';
                if (Number(e.target.value) > maxQuantity)
                  e.target.value = maxQuantity;
                setQuantityState(Number(e.target.value));
              }}
              value={quantityState}
              autoComplete="off"
              className="main-product quantity__input bg-dark2 font-sledge-font-family-3 text-white
              !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center 
              [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
              focus:border-none focus:box-shadow-none"
            />
            <button
              type="button"
              className="flex justify-center items-center text-dark4 w-[16px] h-[16px] transition hover:opacity-75"
              onClick={() => {
                if (quantityState < maxQuantity)
                  setQuantityState(quantityState + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      )) || (
        <div className={colSpan}>
          <label htmlFor={name} className="sr-only">
            {label}
          </label>

          {(type !== 'textarea' && (
            <input
              type={type}
              name={name}
              id={name}
              autoComplete={autoComplete}
              placeholder={placeholder}
              required={required}
              className={`block bg-dark2 border-none pl-[24px] text-[14px] md:text-[16px] focus:ring-inset focus:border focus:border-solid focus:border-green appearance-none rounded-[12px] focus:ring-0 w-full py-[22px] text-dark4 placeholder:text-dark4 leading-tight focus:shadow-outline ${className}`}
              {...props}
            />
          )) || (
            <textarea
              placeholder={placeholder}
              rows={4}
              name={name}
              id={name}
              className="block bg-dark2 border-none pl-[24px] text-[14px] md:text-[16px] focus:ring-inset focus:border focus:border-solid focus:border-green appearance-none rounded-[12px] focus:ring-0 w-full py-[22px] text-dark4 placeholder:text-dark4 leading-tight focus:shadow-outline "
            ></textarea>
          )}
        </div>
      )}
    </>
  );
}
