import { Helmet } from 'react-helmet-async';
import { SITE } from '../../lib/siteConfig';

export default function Seo({ title, description, path = '', image }) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.address}`;
  const url = `${SITE.url}${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}


