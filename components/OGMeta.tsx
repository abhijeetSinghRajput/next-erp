import Head from "next/head";

interface OGMetaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: string; // website, article, etc.
  twitterCard?: "summary_large_image" | "summary";
  keywords?: string[];
}

const OGMeta = ({
  title,
  description,
  url,
  image = "https://geu-quick-access.vercel.app/geu-circular-logo.png",
  imageAlt = "GEU Quick Access Dashboard",
  type = "website",
  twitterCard = "summary_large_image",
  keywords = [
    "GEU Quick Access",
    "Graphic Era University",
    "GEU ERP",
    "Student Dashboard",
    "Attendance Tracker",
    "Fees Portal",
  ],
}: OGMetaProps) => {
  return (
    <Head>
      {/* Standard Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Meta */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Head>
  );
};

export default OGMeta;
