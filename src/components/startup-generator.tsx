'use client';

import { useState } from 'react';
import { handleStartupIdeaGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertCircle, Copy, Save, FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from './loading-spinner';
import type { GenerateStartupIdeasOutput } from '@/ai/flows/generate-startup-ideas';
import jsPDF from 'jspdf';

type GeneratorType = 
  | 'names-taglines'
  | 'elevator-pitch'
  | 'problem-solution'
  | 'audience-uvp'
  | 'hero-copy'
  | 'logo-colors';

interface StartupGeneratorProps {
  generatorType: GeneratorType;
}

export function StartupGenerator({ generatorType }: StartupGeneratorProps) {
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

  const handleExportToPdf = () => {
    if (!generatedIdeas) return;

    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Startup Idea: Problem & Solution', 14, 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Problem Statement', 14, 40);
    doc.setFont('helvetica', 'normal');
    const problemLines = doc.splitTextToSize(generatedIdeas.problemStatement, 180);
    doc.text(problemLines, 14, 48);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const solutionYPos = 48 + (problemLines.length * 7) + 10;
    doc.text('Solution Statement', 14, solutionYPos);
    doc.setFont('helvetica', 'normal');
    const solutionLines = doc.splitTextToSize(generatedIdeas.solutionStatement, 180);
    doc.text(solutionLines, 14, solutionYPos + 8);
    
    doc.save('problem-solution.pdf');
    toast({
        title: "Exported to PDF!",
        description: "Your problem and solution statements have been exported.",
    });
  };

  const ResultCard = ({ title, content, onCopy, extra }: { title: string, content: string | string[], onCopy?: () => void, extra?: React.ReactNode }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onCopy && (
            <Button variant="ghost" size="icon" onClick={onCopy} className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          )}
           <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
              <Save className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {typeof content === 'string' ? <p className="text-muted-foreground">{content}</p> : content}
        {extra}
      </CardContent>
    </Card>
  );
  
  const renderResults = () => {
    if (!generatedIdeas) return null;

    switch (generatorType) {
      case 'names-taglines':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Startup Name" content={generatedIdeas.startupName} onCopy={() => handleCopyToClipboard(generatedIdeas.startupName)} />
            <ResultCard title="Tagline" content={generatedIdeas.tagline} onCopy={() => handleCopyToClipboard(generatedIdeas.tagline)} />
          </div>
        );
      case 'elevator-pitch':
        return <ResultCard title="Elevator Pitch" content={generatedIdeas.pitch} onCopy={() => handleCopyToClipboard(generatedIdeas.pitch)} />;
      case 'problem-solution':
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <ResultCard title="Problem Statement" content={generatedIdeas.problemStatement} onCopy={() => handleCopyToClipboard(generatedIdeas.problemStatement)} />
                <ResultCard title="Solution Statement" content={generatedIdeas.solutionStatement} onCopy={() => handleCopyToClipboard(generatedIdeas.solutionStatement)} />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleExportToPdf}>
                    <FileDown className="mr-2" />
                    Export to PDF
                </Button>
            </div>
          </div>
        );
      case 'audience-uvp':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Target Audience" content={generatedIdeas.targetAudience} onCopy={() => handleCopyToClipboard(generatedIdeas.targetAudience)} />
            <ResultCard title="Unique Value Proposition" content={generatedIdeas.uniqueValueProposition} onCopy={() => handleCopyToClipboard(generatedIdeas.uniqueValueProposition)} />
          </div>
        );
      case 'hero-copy':
        return <ResultCard title="Website Hero Copy" content={generatedIdeas.heroCopy} onCopy={() => handleCopyToClipboard(generatedIdeas.heroCopy)} />;
      case 'logo-colors':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Logo Concept" content={generatedIdeas.logoConcept} onCopy={() => handleCopyToClipboard(generatedIdeas.logoConcept)} />
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
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
              Generate
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
          {Array.from({ length: 2 }).map((_, i) => (
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

      {generatedIdeas && !isLoading && (
        <div className="space-y-6">
          {renderResults()}
        </div>
      )}
    </div>
  );
}
