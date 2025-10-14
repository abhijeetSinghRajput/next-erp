import { Metadata } from 'next';

interface MetadataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  url = "https://geu-quick-access.vercel.app",
  image = "https://geu-quick-access.vercel.app/geu-circular-logo.png",
  imageAlt = "GEU Quick Access Dashboard",
  keywords = ["GEU Quick Access", "Graphic Era University", "GEU ERP"],
  robots = "index, follow", // <-- add default robots
}: MetadataProps & { twitterSite?: string; robots?: string }): Metadata {
  return {
    title,
    description,
    keywords,
    robots,  // <-- adds robots meta tag
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      type: "website",
      siteName: "GEU Quick Access",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
