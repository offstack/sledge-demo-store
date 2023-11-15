window.ProductFormScript = () => {
  if (!customElements.get("product-form")) {
    customElements.define(
      "product-form",
      class ProductForm extends HTMLElement {
        constructor() {
          super();

          this.form = this.querySelector("form");
          this.form.querySelector("[name=id]").disabled = false;
          this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
          this.cart =
            document.querySelector("cart-notification") ||
            document.querySelector("cart-drawer");
          this.submitButton = this.querySelector('[type="submit"]');
          if (document.querySelector("cart-drawer"))
            this.submitButton.setAttribute("aria-haspopup", "dialog");
        }

        onSubmitHandler(evt) {
          evt.preventDefault();
          if (this.submitButton.getAttribute("aria-disabled") === "true")
            return;

          this.handleErrorMessage();

          this.submitButton.setAttribute("aria-disabled", true);
          this.submitButton.disabled = true;

          if (this.querySelector(".btn-checkout")) {
            this.querySelector(".btn-checkout").disabled = true;
          }

          this.submitButton.classList.add("loading");
          if (this.querySelector(".cart-icon"))
            this.querySelector(".cart-icon").classList.add("hidden");
          if (this.querySelector(".add-to-cart-text")) {
            this.querySelector(".add-to-cart-text").classList.add("hidden");
          }
          if (this.querySelector(".loading-overlay__spinner"))
            this.querySelector(".loading-overlay__spinner").classList.remove(
              "hidden"
            );

          //add to card loader
          const setProductCardLoader = (el, isLoading) => {
            if (el.querySelector(".product-card-loader")) {
              const productCardLoader = el.querySelector(
                ".product-card-loader"
              );
              const addToCardButton = el.querySelector("button");

              if (isLoading) {
                addToCardButton.disabled = true;
                productCardLoader.classList.replace("hidden", "inline-flex");
                productCardLoader.previousElementSibling.classList.add(
                  "hidden"
                );
              } else {
                addToCardButton.disabled = false;
                productCardLoader.classList.replace("inline-flex", "hidden");
                productCardLoader.previousElementSibling.classList.remove(
                  "hidden"
                );
              }
            }
          };

          setProductCardLoader(this, true);

          const config = fetchConfig("javascript");
          config.headers["X-Requested-With"] = "XMLHttpRequest";
          delete config.headers["Content-Type"];

          const formData = new FormData(this.form);
          if (this.cart) {
            formData.append(
              "sections",
              this.cart.getSectionsToRender().map((section) => section.id)
            );
            formData.append("sections_url", window.location.pathname);
            this.cart.setActiveElement(document.activeElement);
          }
          config.body = formData;

          fetch(`${routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                this.handleErrorMessage(response.description);

                if (
                  response.status === 422 &&
                  window.location.pathname.split("/")[1] !== "products"
                ) {
                  sledgeToastNotification({
                    title: response.message,
                    message: response.description,
                    location: "bottom-right",
                    icon: null,
                    type: "a",
                  });
                }

                let sectionRerender = [
                  {
                    id: "cart-drawer",
                    selector: "#CartDrawer .drawer__inner",
                  },
                  {
                    id: "cart-icon-bubble",
                    selector: "#cart-icon-bubble",
                  },
                ];

                sectionRerender.forEach((section, index) => {
                  document
                    .querySelectorAll(section.selector)
                    .forEach((el, index) => {
                      fetch(
                        window.location.pathname + `?sections=${section.id}`
                      )
                        .then((res) => res.json())
                        .then((html) => {
                          document.querySelector(section.selector).innerHTML =
                            html[section.id];
                        });
                    });
                });

                const soldOutMessage =
                  this.submitButton.querySelector(".sold-out-message");
                if (!soldOutMessage) return;
                this.submitButton.setAttribute("aria-disabled", true);
                this.submitButton.querySelector("span").classList.add("hidden");
                soldOutMessage.classList.remove("hidden");
                this.error = true;
                return;
              } else if (!this.cart) {
                window.location = window.routes.cart_url;
                return;
              }

              this.error = false;
              const quickAddModal = this.closest("quick-add-modal");
              if (quickAddModal) {
                document.body.addEventListener(
                  "modalClosed",
                  () => {
                    setTimeout(() => {
                      this.cart.renderContents(response);
                    });
                  },
                  { once: true }
                );
                quickAddModal.hide(true);
              } else {
                this.cart.renderContents(response);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              setProductCardLoader(this, false);
              this.submitButton.disabled = false;

              if (this.querySelector(".btn-checkout")) {
                this.querySelector(".btn-checkout").disabled = false;
              }

              this.submitButton.classList.remove("loading");
              if (this.cart && this.cart.classList.contains("is-empty"))
                this.cart.classList.remove("is-empty");
              if (!this.error)
                this.submitButton.removeAttribute("aria-disabled");
              if (this.querySelector(".loading-overlay__spinner"))
                this.querySelector(".loading-overlay__spinner").classList.add(
                  "hidden"
                );
              if (this.querySelector(".cart-icon"))
                this.querySelector(".cart-icon").classList.remove("hidden");
              if (this.querySelector(".add-to-cart-text"))
                this.querySelector(".add-to-cart-text").classList.remove(
                  "hidden"
                );
            });
        }

        handleErrorMessage(errorMessage = false) {
          this.errorMessageWrapper =
            this.errorMessageWrapper ||
            this.querySelector(".product-form__error-message-wrapper");
          if (!this.errorMessageWrapper) return;
          this.errorMessage =
            this.errorMessage ||
            this.errorMessageWrapper.querySelector(
              ".product-form__error-message"
            );

          this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

          if (errorMessage) {
            this.errorMessage.textContent = errorMessage;
          }
        }
      }
    );
  }
};

window.ProductFormScript();
