import fs from 'fs';
import path from 'path';
import Link from "next/link";
import DomeGallery from "./DomeGallery";
import SectionHeading from "./SectionHeading";

function getImagesRecursively(dir: string, baseDir: string = dir): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getImagesRecursively(fullPath, baseDir));
        } else {
            if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                const relativePath = path.relative(baseDir, fullPath);
                results.push(`/images/gallery/${relativePath.replace(/\\/g, '/')}`);
            }
        }
    });
    return results;
}

export default function Gallery() {
    const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
    const images = getImagesRecursively(galleryDir);

    return (
        <div id="gallery" className="w-full min-h-screen flex flex-col justify-center items-center bg-[#FAFAFA] py-12 scroll-mt-28">
            <div className="mb-4 flex flex-col items-center gap-4">
                <SectionHeading first="Making" second="Memories Special" />
                <Link href="/gallery" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
                    Full gallery →
                </Link>
            </div>
            <div className="w-full h-full max-h-[80vh] mt-10">
                <DomeGallery
                    images={images}
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