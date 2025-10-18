import { TextGenerator } from "@/components/text-generator";

export default function TextGeneratorPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          AI Text Generator
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate any kind of text content you can imagine. Just enter a prompt and let the AI work its magic.
        </p>
      </div>
      <TextGenerator />
    </div>
  );
}
