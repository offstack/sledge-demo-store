# Liquid Getting Started

Welcome to the Liquid Demo Store! This repository serves as a demonstration of an Liquid website where you can explore various sledge features.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Demo](#demo)


## Installation

### Requirements:

- Node.js
- npm

### Step 1: Clone the repository

You can clone the repository using the following command:

```bash
git clone https://github.com/offstack/sledge-demo-store.git
```

### Step 2: Go to Liquid directory & Install dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd liquid
npm install
```

### Step 3: Configuration

Create a `config.yaml` file and add your shop's domain and Storefront API token!

`config.yaml` file:

```bash
development:
  password: 0bwef09hn23048sdkl2345n2k3
  theme_id: 123
  store: can-i-buy-a-feeling.myshopify.com
```

[Shopify Theme Kit configuration reference](https://shopify.dev/docs/themes/tools/theme-kit/configuration-reference)

### Step 4: Start the application

To start the application in development mode:

```bash
npm run start
```

To generate tailwind css classes:

```bash
npm run start:css
```

## Usage

Visit [https://your-store.myshopify.com](https://your-store.myshopify.com/) in your web browser and explore the amazing sledge features.


## Documentation

For detailed information and usage instructions, please refer to our [Documentation](https://docs.sledge-app.com/installation/liquid).

## Project Structure

The Liquid Demo Store is organized into the following directory structure:

```md
liquid/
├── assets/
│   └── global.js
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layouts/
│   └── theme.liquid
├── locales/
│   └── en.json
├── snippets/
│   ├── sledge-dark-css.liquid
│   ├── sledge-instant-search-icon-widget.liquid
│   ├── sledge-instant-search-product-filter-widget.liquid
│   ├── sledge-product-review-rating.liquid
│   ├── sledge-product-review-widget.liquid
│   ├── sledge-wishlist-badge-header-menu.liquid
│   ├── sledge-wishlist-button-detail.liquid
│   ├── sledge-wishlist-trigger.liquid
│   ├── sledge-wishlist-widget.liquid
│   └── sledge_embed-script.liquid
├── src/
│   └── index.css
└── templates/
    ├── index.liquid
    └── product.liquid
```

- `assets/`: Contains your project's static assets like CSS and JavaScript files.
- `config/`: Configuration files or data used in your Liquid templates.
- `layouts/`: Stores different layout templates.
- `locales/`: Localization files for different languages.
- `snippets/`: Stores reusable code snippets and Sledge  components.
    - `sledge-dark-css.liquid` : custom style used in the [Sledge Demo Store](https://demo-liquid.sledge-app.com/).
    - [`sledge-instant-search-icon-widget.liquid`](https://docs.sledge-app.com/instant-search#search-icon-popup): 
        Search Icon Popup is an Instant Search's widget you can use to search your product or other data like (collection, page, blog, article) in a popup search form.
    - [`sledge-instant-search-product-filter-widget.liquid`](https://docs.sledge-app.com/product-filters#product-filter-result):
        Search Result is an Instant Search's widget you can use to search your products on a single page. This widget is also known as a "Product Listing Page."  
    - [`sledge-product-review-rating.liquid`](https://docs.sledge-app.com/product-review#rating): 
        Rating is a Product Review's widget you can use to display your review's score and total rating of your product.
    - [`sledge-product-review-widget.liquid`](https://docs.sledge-app.com/product-review#list): 
        You can use this code to display list data of your product reviews. Typically used on product detail page.
    - [`sledge-wishlist-badge-header-menu.liquid`](https://docs.sledge-app.com/wishlist#badge): 
        Badge is a Wishlist's widget you can use to display your wishlist's total in a small text box or an icon.
    - [`sledge-wishlist-button-detail.liquid`](https://docs.sledge-app.com/wishlist#button-detail): 
        Button Detail is a Wishlist's widget you can use to trigger add or remove a wishlist item in a button form. Typically used on product detail page.
    - [`sledge-wishlist-trigger.liquid`](https://docs.sledge-app.com/wishlist#trigger): 
        Trigger is a Wishlist's widget you can use to trigger add or remove a wishlist item in an icon.
    - [`sledge-wishlist-widget.liquid`](https://docs.sledge-app.com/wishlist#list): 
        You can use this code to display list data of user's wishlist.
    - `sledge_embed-script.liquid` :
        Prior using all Sledge's widgets, you can follow the steps in the [Docs](https://docs.sledge-app.com/installation/liquid#setup-with-embed-code-below ) to start integrating Sledge into your Shopify theme. 
- `src/`: tailwind CSS code.
- `templates/`: Contains page templates.


## Demo 

You can check out the live demo at [Sledge Liquid Demo Store](https://demo-liquid.sledge-app.com/)
