import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export default function SEO({ 
  title = "Crystal RO Care | Pure Water. Trusted Service.", 
  description = "Premium RO water purifiers, AMC plans, and expert service in Ahmedabad. Keep your family healthy with Crystal RO Care.",
  path
}: SEOProps) {
  const [location] = useLocation();
  const currentPath = path || location;
  const canonicalUrl = `https://crystalrocare.com${currentPath === '/' ? '' : currentPath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
