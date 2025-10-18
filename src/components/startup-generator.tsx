'use client';

import { useState } from 'react';
import { handleStartupIdeaGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertCircle, Copy, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from './loading-spinner';
import type { GenerateStartupIdeasOutput } from '@/ai/flows/generate-startup-ideas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StartupGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateStartupIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedIdeas(null);

    const result = await handleStartupIdeaGeneration(prompt);

    if (result.success && result.data) {
      setGeneratedIdeas(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Feature not available",
      description: "Saving content will be implemented soon.",
    });
  };

  const ResultCard = ({ title, content, onCopy, extra }: { title: string, content: string | string[], onCopy?: () => void, extra?: React.ReactNode }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {onCopy && (
          <Button variant="ghost" size="icon" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {typeof content === 'string' ? <p className="text-muted-foreground">{content}</p> : content}
        {extra}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <Card className="p-4">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., I want to build an app that connects students with mentors."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !prompt} className="w-full sm:w-auto" size="lg">
              {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2" />}
              Generate Ideas
            </Button>
          </form>
        </CardContent>
      </Card>
      

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {generatedIdeas && (
        <div className="space-y-6">
          <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{generatedIdeas.startupName}</CardTitle>
                <p className="text-muted-foreground text-lg">{generatedIdeas.tagline}</p>
              </CardHeader>
              <CardFooter className="gap-2">
                  <Button onClick={handleSave} variant="outline">
                      <Save className="mr-2" /> Save to Library
                  </Button>
              </CardFooter>
          </Card>
          
          <Tabs defaultValue="pitch" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4 h-auto">
              <TabsTrigger value="pitch">Pitch</TabsTrigger>
              <TabsTrigger value="uvp">UVP</TabsTrigger>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="pitch">
              <ResultCard title="Elevator Pitch" content={generatedIdeas.pitch} onCopy={() => handleCopyToClipboard(generatedIdeas.pitch)} />
            </TabsContent>
            <TabsContent value="uvp">
              <ResultCard title="Unique Value Proposition" content={generatedIdeas.uniqueValueProposition} onCopy={() => handleCopyToClipboard(generatedIdeas.uniqueValueProposition)} />
            </TabsContent>
            <TabsContent value="problem">
              <ResultCard title="Problem Statement" content={generatedIdeas.problemStatement} onCopy={() => handleCopyToClipboard(generatedIdeas.problemStatement)} />
            </TabsContent>
            <TabsContent value="solution">
              <ResultCard title="Solution Statement" content={generatedIdeas.solutionStatement} onCopy={() => handleCopyToClipboard(generatedIdeas.solutionStatement)} />
            </TabsContent>
            <TabsContent value="audience">
              <ResultCard title="Target Audience" content={generatedIdeas.targetAudience} onCopy={() => handleCopyToClipboard(generatedIdeas.targetAudience)} />
            </TabsContent>
            <TabsContent value="logo">
              <ResultCard title="Logo Concept" content={generatedIdeas.logoConcept} onCopy={() => handleCopyToClipboard(generatedIdeas.logoConcept)} />
            </TabsContent>
            <TabsContent value="colors">
              <ResultCard 
                title="Color Palette" 
                content={generatedIdeas.colorPalette.join(', ')}
                onCopy={() => handleCopyToClipboard(generatedIdeas.colorPalette.join(', '))}
                extra={
                  <div className="flex gap-2 mt-2">
                    {generatedIdeas.colorPalette.map(color => (
                      <div key={color} className="h-8 w-8 rounded-full border" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                }
              />
            </TabsContent>
          </Tabs>

          <ResultCard title="Website Hero Copy" content={generatedIdeas.heroCopy} onCopy={() => handleCopyToClipboard(generatedIdeas.heroCopy)} />
        </div>
      )}
    </div>
  );
}
