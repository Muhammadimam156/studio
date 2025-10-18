import { ImageGenerator } from "@/components/image-generator";

export default function ImageGeneratorPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Create stunning images from text prompts. Describe the image you want to see, and the AI will generate it for you.
        </p>
      </div>
      <ImageGenerator />
    </div>
  );
}
