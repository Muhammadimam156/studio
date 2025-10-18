import { StartupGenerator } from "@/components/startup-generator";

export default function LogoColorsPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Logo Concept & Color Palette
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Get a concept idea for your startup's logo and a suggested color palette.
        </p>
      </div>
      <StartupGenerator generatorType="logo-colors" />
    </div>
  );
}
