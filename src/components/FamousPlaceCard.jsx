import SmartImage from './SmartImage';

/** FamousPlaceCard — visual card for one notable place, photo fetched
 *  dynamically from the Wikipedia REST API via SmartImage. */
export default function FamousPlaceCard({ place }) {
  return (
    <article className="place-card panel">
      <div className="place-card-media">
        <SmartImage
          src={place.image}
          wikiTitle={place.wiki}
          alt={place.name}
          className="place-card-img"
        />
        {place.mustSee && <span className="place-card-badge">Must see</span>}
      </div>
      <div className="place-card-body">
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <p className="place-card-meta">
          {place.category}
          {place.duration && <> · {place.duration}</>}
        </p>
      </div>
    </article>
  );
}
