import {Link} from '~/components';

export function SledgeSearchViewMoreResult({
  keyword,
  setShowPopupComponent,
  setRenderSearchResult,
}: any) {
  return (
    <Link
      to={`/pages/search-result?q=${keyword}`}
      className="sledge-instant-search__icon-widget-button-more"
      onClick={() => {
        setShowPopupComponent && setShowPopupComponent(false);
        setRenderSearchResult && setRenderSearchResult(keyword);
      }}
    >
      View More Result
    </Link>
  );
}
