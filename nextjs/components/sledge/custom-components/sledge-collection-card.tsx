import { Link } from "components/global";

export default function SledgeCollectionCard({ data }: any) {
  const { handle, image, title, body_html } = data;
  return (
    <Link href={`/collections/${handle}`}>
      <div className="sledge__collection-grid-card">
        <div className="sledge__collection-grid-card-image-wrapper">
          <div className="sledge__collection-grid-card-image">
            <img src={image?.src} alt="sledge-card-image" loading="lazy" />
          </div>
        </div>
        <div className="sledge__collection-grid-card-content">
          <div className="sledge__collection-grid-card-content-title">
            {title}
          </div>
          <div
            className="sledge__collection-grid-card-content-description"
            dangerouslySetInnerHTML={{
              __html: body_html,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
