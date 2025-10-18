import { StartupGenerator } from "@/components/startup-generator";

export default function AudienceUVPPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Target Audience & UVP
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Define your primary target audience and unique value proposition.
        </p>
      </div>
      <StartupGenerator generatorType="audience-uvp" />
    </div>
  );
}
