import DomeGallery from "./DomeGallery";
import { getStorageImageUrl } from "@/lib/supabase/storage";

const galleryFiles = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg",
  "image6.jpg", "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg",
  "image11.jpg", "image12.jpg", "image13.jpg", "image14.jpg", "image15.jpg",
  "image16.jpg", "image17.jpg", "image18.jpg", "image19.jpg", "kingFisher.png"
];

const galleryImages = galleryFiles.map((file) => getStorageImageUrl(`/images/gallery/${file}`));

export default function Gallery() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
                <h2 className="text-4xl md:text-5xl font-serif">
                    <span className="text-[#71A129]">Making</span> <span className="text-[#111111]">Memories Special</span>
                </h2>
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
            </div>
            <div className="w-full h-full max-h-[80vh] mt-10">
                <DomeGallery
                    images={galleryImages}
                    fit={0.5}
                    minRadius={800}
                    maxVerticalRotationDeg={0}
                    segments={34}
                    dragDampening={2}
                    grayscale={false}
                />
            </div>
        </div>
    );
}