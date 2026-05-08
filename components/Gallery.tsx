import fs from 'fs';
import path from 'path';
import DomeGallery from "./DomeGallery";

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