export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sundarbangreenviewhomestay.com";

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": ["BedAndBreakfast", "Hotel", "LodgingBusiness"],
    "@id": `${siteUrl}/#lodging`,
    "name": "Sundarban Greenview Homestay",
    "alternateName": "Greenview Homestay Sundarban",
    "url": siteUrl,
    "logo": `${siteUrl}/images/hero/hero1.jpg`,
    "image": [
      `${siteUrl}/images/gallery/image1.jpg`,
      `${siteUrl}/images/gallery/image2.jpg`,
      `${siteUrl}/images/gallery/image3.jpg`
    ],
    "description": "Sundarban Greenview Homestay is a premier riverside eco-resort near Pakhiralay, Gosaba. Offering air-conditioned & non-AC river view rooms, authentic home-cooked Bengali cuisine, and curated boat safaris in the Sundarbans.",
    "telephone": "+91 7679756846",
    "email": "bideshmondal50@gmail.com",
    "priceRange": "₹1500 - ₹4500 per night",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
    "checkinTime": "12:00:00",
    "checkoutTime": "10:00:00",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pakhiralay, Gosaba Island",
      "addressLocality": "Sundarbans, South 24 Parganas",
      "addressRegion": "West Bengal",
      "postalCode": "743370",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.1333,
      "longitude": 88.8500
    },
    "hasMap": "https://maps.google.com/?q=Sundarban+Greenview+Homestay+Pakhiralay",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4.9"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "520",
      "reviewCount": "520"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "River View Rooms", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi in Common Areas", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Authentic Bengali Dining", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Jungle Boat Safaris & Sightseeing", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning & Power Backup", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Hot Water & Housekeeping", "value": true }
    ]
  };

  const tourAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travelagency`,
    "name": "Sundarban Greenview Homestay & Safaris",
    "url": `${siteUrl}/trips`,
    "telephone": "+91 7679756846",
    "email": "bideshmondal50@gmail.com",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pakhiralay, Gosaba",
      "addressLocality": "Sundarbans",
      "addressRegion": "West Bengal",
      "postalCode": "743370",
      "addressCountry": "IN"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": "Sundarban 1 Day / 1 Night Express Tour",
          "description": "Essential Sundarban jungle boat safari, watchtower visits, and local cultural experience."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": "Sundarban 2 Days / 1 Night Classic Package",
          "description": "Complete Sundarban jungle boat safari, Dobanki canopy walk, Sajnekhali watchtower, and riverside homestay."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": "Sundarban 3 Days / 2 Nights Deep Explorer",
          "description": "Immersive 3-day delta expedition through deep mangrove channels, Sudhanyakhali, Dobanki, and village walks."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Rooms & Accommodations",
        "item": `${siteUrl}/rooms`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Tour Packages & Safaris",
        "item": `${siteUrl}/trips`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "About Us",
        "item": `${siteUrl}/about`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Book Stay",
        "item": `${siteUrl}/booking`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourAgencySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
