# Next.js Getting Started

Welcome to the Next.js Demo Store! This repository serves as a demonstration of an Next.js Demo Store website where you can explore various sledge features.


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Demo](#demo)


## Installation

### Requirements:

- Node.js
- pnpm

### Step 1: Clone the repository

You can clone the repository using the following command:

```bash
git clone https://github.com/offstack/sledge-demo-store.git
```

### Step 2: Go to Next.js directory & Install dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd nextjs
pnpm install
```

### Step 3: Configuration

Create a `.env` file and add your shop's domain and Storefront API token!

`.env` file:

```bash
COMPANY_NAME=""
TWITTER_CREATOR=""
TWITTER_SITE=""
SITE_NAME=""
SHOPIFY_REVALIDATION_SECRET=""
SHOPIFY_STOREFRONT_ACCESS_TOKEN=""
SHOPIFY_STORE_DOMAIN=""

NEXT_PUBLIC_STORE_URL=""

# Admin Api Token for Contact Us form App
PRIVATE_ADMIN_API_TOKEN=""
PRIVATE_ADMIN_API_VERSION=""

# Sledge Api key
SLEDGE_API_KEY=""
SLEDGE_IS_KEY=""

```

### Step 4: Start the application

To start the application in development mode:

```bash
pnpm dev
```

### Step 5: Building for production

```bash
pnpm build
```

## Usage

Visit [http://localhost:3000](http://localhost:3000) in your web browser and explore the amazing sledge features.


## Documentation

For detailed information and usage instructions, please refer to our [Documentation](https://docs.sledge-app.com/installation/nextjs).

## Project Structure

The Next.js Demo Store is organized into the following directory structure:

```md
nextjs/
├── app/
├── components/
│   └── sledge
│       └── custom-components
│   	    ├── sledge-article-card.tsx
│           ├── sledge-blog-card.tsx
│           ├── sledge-collection-card.tsx
│           ├── sledge-other-index-list.tsx
│           ├── sledge-product-card.tsx
│           ├── sledge-suggestion-keyword-list.tsx
│           └── sledge-wishlist-widget-alert.tsx
└── lib/
    └── shopify/
```


- `app/`: Routes file.
- `components/`
	- `sledge/`
		- `custom-components/`
            - [`sledge-article-card.tsx`](https://docs.sledge-app.com/custom-components/instant-search#article-card): 
            Article card are component will show on tab article of search result. 
            - [`sledge-blog-card.tsx`](https://docs.sledge-app.com/custom-components/instant-search#blog-card):
            Blog card are component will show on tab blog of search result.
            - [`sledge-collection-card.tsx`](https://docs.sledge-app.com/custom-components/instant-search#other-index-list): 
            Other Index List is custom component for showing sidebar of popup search result except [Suggestion Keyword List](https://docs.sledge-app.com/custom-components/instant-search#suggestion-keyword-list).
            - [`sledge-other-index-list.tsx`](https://docs.sledge-app.com/custom-components/global#product-card): 
            Product cards are a very important component for wishlist and instant search applications and you can use your product cards to keep them displayed on sledge apps.
            - [`sledge-product-card.tsx`](https://docs.sledge-app.com/custom-components/instant-search#search-view-more-result): 
            Search View More Result is custom component for showing button for view all search result. You can add custom url and custom onclick action to button.
            - [`sledge-suggestion-keyword-list.tsx`](https://docs.sledge-app.com/custom-components/instant-search#suggestion-keyword-list): Suggestion Keyword List is custom component for showing suggestion keyword from [suggestion setting](https://docs.sledge-app.com/backend-instant-search-and-product-filters#suggestion-when-no-character) on backend.
            - [`sledge-wishlist-widget-alert.tsx`](https://docs.sledge-app.com/custom-components/wishlist#widget-alert): 
            Widget Alert is custom component will show on top of wishlist page or wihslist pop up for notify not logged in user.
- `lib/`
    - `shopify/`: GraphQL queries & fragments.

## Demo 

You can check out the live demo at [Sledge Next.js Demo Store](https://demo-nextjs.sledge-app.com/)
