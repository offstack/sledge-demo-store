'use client';

import Link from 'next/link';

export default function SledgeSearchViewMoreResult({ keyword, setShowPopupComponent }: any) {

  return (
    <Link
      href={`/pages/search-result?q=${keyword}`}
      className="sledge-instant-search__icon-widget-button-more"
      onClick={() => setShowPopupComponent && setShowPopupComponent(false)}
    >
      View More Result
    </Link>
  );
}
