import { StartupGenerator } from "@/components/startup-generator";

export default function HeroCopyPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Website Hero Section Copy
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate compelling copy for a website hero section.
        </p>
      </div>
      <StartupGenerator generatorType="hero-copy" />
    </div>
  );
}
