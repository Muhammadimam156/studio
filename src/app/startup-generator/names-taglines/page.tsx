import { StartupGenerator } from "@/components/startup-generator";

export default function NamesTaglinesPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Creative Names & Taglines
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate creative startup names and taglines. Just enter your idea and let our AI do the rest.
        </p>
      </div>
      <StartupGenerator generatorType="names-taglines" />
    </div>
  );
}
