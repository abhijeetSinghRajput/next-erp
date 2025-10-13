import { Metadata } from "next";

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
  url,
  image = "https://geu-quick-access.vercel.app/geu-circular-logo.png",
  imageAlt = "GEU Quick Access Dashboard",
  keywords = ["GEU Quick Access", "Graphic Era University", "GEU ERP"],
}: MetadataProps): Metadata {
  return {
    title,
    description,
    keywords,
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
