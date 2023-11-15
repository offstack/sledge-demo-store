import {Link} from '~/components';

export default function SledgeOtherIndexList({
  name,
  items,
  setShowPopupComponent,
}: any) {
  return (
    <>
      <div className="sledge-instant-search__icon-widget-search-form-result-title">
        {name}
      </div>
      {items?.length ? (
        <ul className="sledge-instant-search__icon-widget-search-form-result-list">
          {items.map((hit: any, index: number) => {
            const {title, handle, blog_handle} = hit;

            let linkTo = '';

            if (String(name)?.toLowerCase().includes('collections')) {
              linkTo = `/collections/${handle}`;
            } else if (String(name)?.toLowerCase().includes('pages')) {
              linkTo = `/pages/${handle}`;
            } else if (String(name)?.toLowerCase().includes('blogs')) {
              linkTo = `/blogs/${handle}`;
            } else if (String(name)?.toLowerCase().includes('articles')) {
              linkTo = `/blogs/${blog_handle}/${handle}`;
            }

            return (
              <li key={index}>
                <Link
                  to={linkTo}
                  className="sledge-instant-search__icon-widget-search-form-result-list-link"
                  onClick={() =>
                    setShowPopupComponent && setShowPopupComponent(false)
                  }
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="sledge-instant-search__icon-widget-search-form-result-list">
          <li className="sledge-instant-search__icon-widget-search-form-result-item-disabled">
            No {name?.toLowerCase()} were found
          </li>
        </ul>
      )}
    </>
  );
}
