/* eslint-disable @next/next/no-img-element */
import { addToCartTrigger, productClickTrigger } from "@sledge-app/api";
import { Rating } from "@sledge-app/react-product-review";
import { Trigger } from "@sledge-app/react-wishlist";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Link from "next/link";
import { useState } from "react";

export default function SledgeProductCard({
  product,
  setShowPopupComponent,
  sourceApp,
}: any) {
  const firstVariant = product.variants[0];

  const defaultSelectedVariantId = product.variants?.length
    ? firstVariant.admin_graphql_api_id
    : "";
  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultSelectedVariantId
  );

  if (!firstVariant) return null;

  const { id, title, image, handle, url, vendor, currency, variants } =
    product || {};
  const {
    id: variant_id = "",
    title: variant_title = "",
    price = "",
    sku = "",
    is_out_of_stock = false,
  } = variants?.length ? variants[0] : {};

  if (product.currency) product.currency = "USD";

  const options = product.options ? Object.entries(product?.options) : [];
  const images = product?.images ?? [];

  const defaultSelected: any = {};

  function setDefaultFunction() {
    if (!variants?.length) return;

    defaultSelected["data-product-id"] = id;
    defaultSelected["data-product-handle"] = handle;
    defaultSelected["data-selected-option1"] = variants[0].option1;
    if (variants[0].option2) {
      defaultSelected["data-selected-option2"] = variants[0].option2;
    }
    defaultSelected["data-variant-id"] = variants[0].admin_graphql_api_id;
  }

  setDefaultFunction();

  function setSelectedOption(element: any, optionName: any) {
    const optionsButton = element.target.offsetParent
      .querySelector(`.options-button-${optionName}`)
      .querySelectorAll(`button`);

    const defaultSelectedClassChanger = () => {
      optionsButton.forEach((button: any) => {
        button.classList.remove("is-selected", "bg-green", "!text-black");
        button.classList.add("text-dark4");
        element.target.className += " is-selected bg-green !text-black";
      });
    };

    const colorSelectedClassChanger = () => {
      optionsButton.forEach((button: any) => {
        button.classList.remove("border-green");
        element.target.className += " border-green";
      });
    };

    switch (optionName) {
      case "Color":
        colorSelectedClassChanger();
        break;
      case "Size":
        defaultSelectedClassChanger();
        break;
      default:
        defaultSelectedClassChanger();
    }
  }

  function setSelectedVariant(element: any, value: any, optionIndex: number) {
    const selectedInput = element.target.parentNode.parentNode.firstChild;
    const parentCard = element.target.offsetParent;

    const setOptionAttribute = () => {
      //set option attribute
      selectedInput.attributes[`data-selected-option${optionIndex}`].value =
        value;
    };
    setOptionAttribute();

    // define option1 and option 2
    const option1 = `[data-option-1="${selectedInput.attributes["data-selected-option1"].value}"]`;
    const option2 = `${
      selectedInput.attributes["data-selected-option2"]
        ? `[data-option-2="${selectedInput.attributes["data-selected-option2"].value}"]`
        : ""
    }`;

    // define selected option
    const selectOption = parentCard.querySelector(
      `select option${option1}${option2}`
    );
    const variantId = selectOption.attributes["data-graphql-id"].value;
    const imageId = selectOption.attributes["data-image-id"]?.value;

    const setOther = () => {
      //set data-variant-id attribute
      selectedInput.attributes[`data-variant-id`].value =
        selectOption.attributes["data-graphql-id"].value;

      //change product image by variant
      if (variantId) setSelectedVariantId(variantId);
      if (imageId)
        parentCard.querySelector(`img.featured-image`).src =
          parentCard.querySelector(
            `div.variant-images img[id="${imageId}"]`
          ).src;
    };

    setOther();

    const result = {
      variantId,
      imageId,
    };

    return result;
  }

  return (
    <div
      key={product.id}
      className="group relative product-card min-w-fit lg:min-w-[270px] lg:max-w-min rounded-[21.593px] border-[0.9px] border-solid border-dark5 flex flex-col justify-between"
    >
      <div>
        <Trigger
          params={{
            productId: id,
            productVariantId: variant_id,
            productName: title,
            productVendor: vendor,
            productSku: sku,
            productVariantName: variant_title,
            productLink: url,
            productImage: image?.src || "",
            productCurrency: currency,
            productPrice: price,
          }}
        />

        <div className="aspect-h-1 bg-dark2 aspect-w-1 w-full overflow-hidden rounded-t-[24px] lg:aspect-none group-hover:opacity-75 lg:max-h-[270px] h-fit lg:h-[270px] flex justify-center items-center relative">
          <img
            decoding="async"
            height="270"
            loading="lazy"
            src={image?.src}
            alt={product?.title}
            width={269.92}
            style={{ aspectRatio: 269.92 / 270 }}
            className="w-[269.92px] h-full max-h-[270px] featured-image"
          />
          <div className="variant-images hidden">
            {images?.map((image: any) => (
              <img
                key={image?.id}
                decoding="async"
                id={image?.id}
                height="270"
                loading="lazy"
                src={image?.src}
                alt={product?.title}
                width={269.92}
                style={{ aspectRatio: 269.92 / 270 }}
                className="w-[269.92px] h-full max-h-[270px]"
              />
            ))}
          </div>
          {is_out_of_stock ? (
            <div className="sledge__product-grid-card-out-of-stock">
              Sold out
            </div>
          ) : null}
        </div>
        <div className="mt-[16px] space-y-[8px] px-[16px] pb-[16.69px]">
          <div className="flex justify-between">
            <Price
              className="font-bold text-[21.59px] leading-[25.91px]"
              currencyCode="USD"
              amount={price}
              currencyCodeClassName="hidden"
            />
            {product.vendor && (
              <div className="flex border-[0.9px] border-solid border-dark3 rounded-[323.9px] w-fit">
                <div className="flex px-[9px] py-[3.6px] justify-center items-center">
                  <p className="text-dark4 font-inter text-[10.8px] leading-[17.27px] tracking-[-0.216px]">
                    Vendor: {product.vendor}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Rating
            params={{
              productId: id,
            }}
            size="xs"
          />
          <div>
            <Link
              className="text-[18px] leading-[21.6px] font-bold "
              href={"/product/" + product.handle}
              onClick={() => {
                setShowPopupComponent && setShowPopupComponent(false);
                productClickTrigger({
                  sourceApp,
                  productId: id,
                });
              }}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {title}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-[16px] pb-[16px] z-10">
        {/* variant trigger */}
        <input type="hidden" {...defaultSelected} className="selected-option" />
        <select className="variant-picker hidden">
          {variants?.map((variant: any) => {
            const {
              title,
              option1,
              option2,
              position,
              id,
              admin_graphql_api_id,
              image_id,
            }: any = variant;

            const optionAttributes = {
              "data-option-1": option1,
              "data-option-2": option2,
              "data-position": position,
              "data-id": id,
              "data-graphql-id": admin_graphql_api_id,
              "data-image-id": image_id,
            };

            return (
              <option key={id} {...optionAttributes}>
                {title}
              </option>
            );
          })}
        </select>

        {/* variant picker */}
        {options.map((option: any, optionParentIndex: number) => {
          const optionName = option[0];
          const optionValues = option[1];

          const selectedOption = optionValues[0];

          return (
            <>
              {optionValues[0] !== "Default Title" && (
                <div
                  className={`flex gap-[6px] z-10 options-button-${optionName}`}
                >
                  {optionValues.map((item: any, index: number) => {
                    const defaultOptionClass = `
                ${
                  selectedOption === item
                    ? "bg-green text-black"
                    : "bg-dark2 text-dark4"
                } z-10 py-[2px] px-2 rounded-[360px] font-inter text-[12px] leading-[19.2px] tracking-[-0.24px] capitalize`;

                    const colorOptionClass = `${
                      selectedOption === item ? "border-green" : ""
                    } z-10 w-[23px] h-[23px] rounded-[360px] border border-solid`;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={
                          optionName === "Color"
                            ? colorOptionClass
                            : defaultOptionClass
                        }
                        style={{
                          backgroundColor: optionName === "Color" ? item : null,
                        }}
                        onClick={(el) => {
                          setSelectedVariant(el, item, optionParentIndex + 1);
                          setSelectedOption(el, optionName);
                        }}
                      >
                        {optionName === "Color" ? null : item.substring(0, 11)}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          );
        })}
      </div>
      <div className="px-[16px] pb-[16px]">
        <AddToCart
          autoSelect={true}
          variants={product.variants}
          selectedVariantIdProp={selectedVariantId}
          availableForSale={!is_out_of_stock}
          additionalEventOnClick={() =>
            addToCartTrigger({
              sourceApp,
              productId: id,
            })
          }
        />
      </div>
    </div>
  );
}
