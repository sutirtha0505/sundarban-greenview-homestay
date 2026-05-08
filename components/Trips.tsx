import Image from 'next/image';

const tripsData = [
  {
    id: 1,
    image: "/images/trips/trip1.jpg",
    pillText: "Night on board | One Day, One Night | Sundarban",
    durationText: "Sundarban 1 Day, 1 Night",
    title: "Sundarban Tour: Sajnekhali Bird Sanctuary, Watch Tower, Eco Garden, Hiron Point etc.",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 3,675",
    buttonType: "outline"
  },
  {
    id: 2,
    image: "/images/trips/trip2.jpg",
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 2 Days, 3 Nights",
    title: "Sundarban Tour: Sajnekhali Bird Sanctuary, Watch Towe, Eco Garden, Hiron Point etc.",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 4,675",
    buttonType: "outline"
  },
  {
    id: 3,
    image: "/images/trips/trip3.jpg",
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 5 Days, 7 Nights",
    title: "Sundarban Tour: Sajnekhali Bird Sanctuary, Watch Towe, Eco Garden, Hiron Point etc.",
    rating: "4.7",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 5,695",
    buttonType: "outline"
  }
];

export default function Trips() {
  return (
    <section className="w-full h-screen py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
          <h2 className="text-4xl md:text-5xl font-serif">
            <span className="text-[#71A129]">Book your</span> <span className="text-[#111111]">Trips</span>
          </h2>
          <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tripsData.map((trip) => (
            <div 
              key={trip.id}
              className="bg-[#FFFFFF] border border-[#71A129] rounded-[32px] p-4 shadow-[0_8px_30px_#71A1291A] hover:shadow-[0_12px_40px_#71A1292A] transition-shadow duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-4/3 rounded-[24px] overflow-hidden bg-[#F5F5F5]">
                <Image 
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Pill */}
              <div className="flex justify-center -mt-4 relative z-10 mb-4">
                <div className="bg-[#FFFFFF] border border-[#555555] rounded-full px-5 py-1.5 text-[10px] text-[#111111] shadow-sm">
                  {trip.pillText}
                </div>
              </div>

              {/* Content */}
              <div className="px-2 pb-2 grow flex flex-col">
                <p className="text-[10px] font-bold text-[#444444] mb-1">
                  {trip.durationText}
                </p>
                
                <h3 className="text-[16px] font-bold text-[#888888] leading-tight mb-4">
                  {trip.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#71A129] text-[#FFFFFF] px-2 py-0.5 rounded-md text-[11px] font-bold">
                    {trip.rating}
                  </div>
                  <span className="text-[#71A129] text-[11px] font-semibold">
                    {trip.reviews}
                  </span>
                </div>

                <div className="mt-auto mb-5 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-[#111111]">{trip.price}</span>
                  <span className="text-[12px] text-[#888888] font-medium">/ per person</span>
                </div>

                <button 
                  className={`w-full py-3 px-6 rounded-[24px] flex items-center justify-between text-base font-serif transition-colors border border-[#71A129] cursor-pointer ${
                    trip.buttonType === 'solid' 
                      ? 'bg-[#71A129] text-[#FFFFFF] hover:bg-[#5b851f]' 
                      : 'bg-[#FFFFFF] text-[#71A129] hover:bg-[#71A129] hover:text-[#FFFFFF] group'
                  }`}
                >
                  View Details
                  <svg 
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform ${trip.buttonType === 'outline' ? 'group-hover:translate-x-1' : ''}`}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}