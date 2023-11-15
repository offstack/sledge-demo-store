import {Link} from '~/components/Global/Link';
import {Logo} from '~/components/Global/Logo';
import {CartDrawer} from '~/components/Global/CartDrawer';
import {Input} from './Global/Input';
import {CardImage} from './Global/CardImage';
import Button from './Global/Button';
import LoadingDots from './Global/LoadingDots';

// Account
import {AccountDetails} from '~/components/Global/Account/AccountDetails';
import {AccountAddressBook} from '~/components/Global/Account/AccountAddressBook';
import {OrderCard} from '~/components/Global/Account/OrderCard';

// Product
import {ProductCard} from '~/components/Global/ProductCard';
import {AddToCartButton} from '~/components/Global/AddToCartButton';
import {Skeleton} from './Global/Skeleton';
import {Accordions} from './Global/Accordion';

//Collection
import {CollectionCard} from './Global/CollectionCard';

//Pages
import {Contact} from './Pages/Contact';

//Cart
import {CartComponents} from './Global/Cart/CartComponents';

export * from './Global/Icon';

//Sledge Component
import {SledgeProductCard} from './Sledge/CustomComponents/SledgeProductCard';
import {SledgeWishlistWidgetAlert} from './Sledge/CustomComponents/SledgeWishlistWidgetAlert';
import {SledgeSearchViewMoreResult} from './Sledge/CustomComponents/SledgeSearchViewMoreResult';
import SledgeOtherIndexList from './Sledge/CustomComponents/SledgeOtherIndexList';
import {SledgeArticleCard} from './Sledge/CustomComponents/SledgeArticleCard';
import {SledgeBlogCard} from './Sledge/CustomComponents/SledgeBlogCard';
import {SledgeSuggestionKeywordList} from './Sledge/CustomComponents/SledgeSuggestionKeywordList';

const SledgeCustom = {
  SledgeProductCard,
  SledgeWishlistWidgetAlert,
  SledgeSearchViewMoreResult,
  SledgeOtherIndexList,
  SledgeArticleCard,
  SledgeBlogCard,
  SledgeSuggestionKeywordList,
};

export {
  Link,
  Logo,
  CartDrawer,
  ProductCard,
  Accordions,
  AddToCartButton,
  Skeleton,
  CollectionCard,
  Input,
  Contact,
  CardImage,
  Button,
  AccountDetails,
  AccountAddressBook,
  OrderCard,
  CartComponents,
  SledgeCustom,
  LoadingDots,
};
