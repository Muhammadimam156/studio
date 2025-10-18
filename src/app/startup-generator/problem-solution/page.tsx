import { StartupGenerator } from "@/components/startup-generator";

export default function ProblemSolutionPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Problem & Solution Statement
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Generate a clear statement of the problem your startup solves and how it solves it.
        </p>
      </div>
      <StartupGenerator generatorType="problem-solution" />
    </div>
  );
}
