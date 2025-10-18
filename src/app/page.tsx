import { StartupGenerator } from "@/components/startup-generator";

export default function Home() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Your Personal AI Startup Partner
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate creative startup names, taglines, pitches, and more in seconds. Just enter your idea and let our AI do the rest.
        </p>
      </div>
      <StartupGenerator />
    </div>
  );
}
