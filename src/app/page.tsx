import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Presentation, Target, Code, Palette, Text, Image as ImageIcon } from "lucide-react";

const tools = [
  {
    title: "Startup Toolkit",
    href: "/startup-generator/names-taglines",
    icon: <Lightbulb className="h-6 w-6" />,
    description: "Generate names, taglines, pitches, and more for your startup idea."
  },
  {
    title: "AI Text Generator",
    href: "/text-generator",
    icon: <Text className="h-6 w-6" />,
    description: "Generate any kind of text content you can imagine. Just enter a prompt."
  },
  {
    title: "AI Image Generator",
    href: "/image-generator",
    icon: <ImageIcon className="h-6 w-6" />,
    description: "Create stunning images from text prompts. Describe what you want to see."
  }
];

const startupTools = [
  {
    title: "Names & Taglines",
    href: "/startup-generator/names-taglines",
    icon: <Lightbulb className="h-5 w-5 text-primary" />,
    description: "Get creative names and memorable taglines."
  },
  {
    title: "Elevator Pitch",
    href: "/startup-generator/elevator-pitch",
    icon: <Presentation className="h-5 w-5 text-primary" />,
    description: "Craft a compelling, concise elevator pitch."
  },
  {
    title: "Problem & Solution",
    href: "/startup-generator/problem-solution",
    icon: <Target className="h-5 w-5 text-primary" />,
    description: "Clearly define the problem and your solution."
  },
  {
    title: "Audience & UVP",
    href: "/startup-generator/audience-uvp",
    icon: <Target className="h-5 w-5 text-primary" />,
    description: "Define your target audience and unique value proposition."
  },
   {
    title: "Website Hero Copy",
    href: "/startup-generator/hero-copy",
    icon: <Code className="h-5 w-5 text-primary" />,
    description: "Generate engaging copy for your landing page."
  },
  {
    title: "Logo & Colors",
    href: "/startup-generator/logo-colors",
    icon: <Palette className="h-5 w-5 text-primary" />,
    description: "Get ideas for your logo and brand color palette."
  },
];


export default function Home() {
  return (
    <div className="container mx-auto px-0">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Your Personal AI Startup Partner
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
          A suite of AI-powered tools to help you brainstorm, build, and launch your next big idea. Get started by selecting a tool below.
        </p>
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool.title} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
                <CardContent>
                   <Button asChild variant="outline">
                    <Link href={tool.href}>
                      Get Started <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
             <h2 className="font-headline text-3xl font-bold text-center mb-8">Startup Toolkit</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {startupTools.map((tool) => (
                <Link href={tool.href} key={tool.title} className="block hover:bg-card/50 p-4 rounded-lg border bg-card transition-colors">
                  <div className="flex items-start gap-4">
                    {tool.icon}
                    <div>
                      <h3 className="font-semibold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                 </Link>
               ))}
             </div>
          </div>
      </div>
    </div>
  );
}
