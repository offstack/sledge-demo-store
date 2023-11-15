# Hydrogen Getting Started

Welcome to the Hydrogen Demo Store! This repository serves as a demonstration of an Hydrogen Demo Store website where you can explore various sledge features.


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

### Step 2: Go to Hydrogen directory & Install dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd hydrogen
npm install
```

### Step 3: Configuration

Create a `.env` file and add your shop's domain and Storefront API token!

`.env` file:

```bash
SESSION_SECRET=""
PUBLIC_STOREFRONT_API_TOKEN=""
PUBLIC_STORE_DOMAIN=""

# Admin Api Token for Contact Us form App
# ref : https://github.com/juanpprieto/hydrogen-contact-form-metaobject
PRIVATE_ADMIN_API_TOKEN=""
PRIVATE_ADMIN_API_VERSION=""

# Sledge Api key
SLEDGE_API_KEY=""
SLEDGE_INSTANT_SEARCH_API_KEY=""
```

### Step 4: Start the application

To start the application in development mode:

```bash
npm run dev
```

### Step 5: Building for production

```bash
npm run build
```

## Usage

Visit [http://localhost:3000](http://localhost:3000) in your web browser and explore the amazing sledge features.


## Documentation

For detailed information and usage instructions, please refer to our [Documentation](https://docs.sledge-app.com/installation/hydrogen).

## Project Structure

The Hydrogen Demo Store is organized into the following directory structure:

```md
app/
├── components/
│   └── Sledge/
│   	└── CustomComponents/
│   	    ├── SledgeArticleCard.tsx
│           ├── SledgeSearchViewMoreResult.tsx
│           ├── SledgeBlogCard.tsx
│           ├── SledgeSuggestionKeywordList.tsx
│           ├── SledgeOtherIndexList.tsx
│           ├── SledgeWishlistWidgetAlert.tsx
│           └── SledgeProductCard.tsx
├── data/
│   └── queries
│   	    └── cart.ts
│   └── fragments.ts
└── routes/
    └── ($locale).___.tsx

```

- `components/`
	- `Sledge/`
		- `CustomComponents/`
            - [`SledgeArticleCard.tsx`](https://docs.sledge-app.com/custom-components/instant-search#article-card): 
            Article card are component will show on tab article of search result. 
            - [`SledgeBlogCard.tsx`](https://docs.sledge-app.com/custom-components/instant-search#blog-card):
            Blog card are component will show on tab blog of search result.
            - [`SledgeOtherIndexList.tsx`](https://docs.sledge-app.com/custom-components/instant-search#other-index-list): 
            Other Index List is custom component for showing sidebar of popup search result except [Suggestion Keyword List](https://docs.sledge-app.com/custom-components/instant-search#suggestion-keyword-list).
            - [`SledgeProductCard.tsx`](https://docs.sledge-app.com/custom-components/global#product-card): 
            Product cards are a very important component for wishlist and instant search applications and you can use your product cards to keep them displayed on sledge apps.
            - [`SledgeSearchViewMoreResult.tsx`](https://docs.sledge-app.com/custom-components/instant-search#search-view-more-result): 
            Search View More Result is custom component for showing button for view all search result. You can add custom url and custom onclick action to button.
            - [`SledgeSuggestionKeywordList.tsx`](https://docs.sledge-app.com/custom-components/instant-search#suggestion-keyword-list): Suggestion Keyword List is custom component for showing suggestion keyword from [suggestion setting](https://docs.sledge-app.com/backend-instant-search-and-product-filters#suggestion-when-no-character) on backend.
            - [`SledgeWishlistWidgetAlert.tsx`](https://docs.sledge-app.com/custom-components/wishlist#widget-alert): 
            Widget Alert is custom component will show on top of wishlist page or wihslist pop up for notify not logged in user.
- `data/`: GraphQL queries & fragments.
- `routes/`: Routes file.


## Demo 

You can check out the live demo at [Sledge Hydrogen Demo Store](https://demo-hydrogen.sledge-app.com/)
