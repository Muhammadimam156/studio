import { StartupGenerator } from "@/components/startup-generator";

export default function ElevatorPitchPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Elevator Pitch
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate a concise elevator pitch for your startup.
        </p>
      </div>
      <StartupGenerator generatorType="elevator-pitch" />
    </div>
  );
}
