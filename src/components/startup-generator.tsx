'use client';

import { useState } from 'react';
import { handleStartupIdeaGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertCircle, Copy, Save, FileDown, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from './loading-spinner';
import type { GenerateStartupIdeasOutput } from '@/ai/flows/generate-startup-ideas';
import jsPDF from 'jspdf';
import { useAuth, useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const CodePreview = ({ code }: { code: string }) => {
  const { toast } = useToast();
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleCopyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ResultWithCode = ({ title, preview, code }: { title: string, preview: React.ReactNode, code: string }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="pt-4">
                    {preview}
                </TabsContent>
                <TabsContent value="code" className="pt-4">
                    <CodePreview code={code} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
);

export function StartupGenerator({ generatorType }: StartupGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateStartupIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { user } = useFirebase();
  const auth = useAuth();
  const { firestore } = useFirebase();

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

  const handleRegenerate = () => {
    if (!prompt) return;
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };
  
  const handleSave = (contentToSave: any, type: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to save content.",
      });
      return;
    }

    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not available.",
          });
        return;
    }

    const contentRef = collection(firestore, `users/${user.uid}/generatedContent`);
    addDocumentNonBlocking(contentRef, {
        ...contentToSave,
        type: type,
        prompt: prompt,
        createdAt: new Date().toISOString(),
    });

    toast({
      title: "Saved to Library!",
      description: "Your content has been saved successfully.",
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

  const ResultCard = ({ title, content, onCopy, onSave, onDownload, extra, onContentChange, rows }: { title: string, content: string | string[], onCopy?: () => void, onSave?: () => void, onDownload?: () => void, extra?: React.ReactNode, onContentChange: (value: string) => void, rows?: number }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onDownload && (
             <Button variant="ghost" size="icon" onClick={onDownload} className="h-8 w-8">
              <FileDown className="h-4 w-4" />
            </Button>
          )}
          {onCopy && (
            <Button variant="ghost" size="icon" onClick={onCopy} className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          )}
           {onSave && (
            <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8">
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={Array.isArray(content) ? content.join(', ') : content}
          onChange={(e) => onContentChange(e.target.value)}
          className="text-muted-foreground bg-transparent border-0 p-0 text-base"
          rows={rows || (Array.isArray(content) ? 1 : (content.match(/\n/g) || []).length + 2)}
        />
        {extra}
      </CardContent>
    </Card>
  );
  
  const renderResults = () => {
    if (!generatedIdeas) return null;

    const handleFieldChange = (field: keyof GenerateStartupIdeasOutput, value: string) => {
        setGeneratedIdeas(prev => {
            if (!prev) return null;
            if (field === 'colorPalette') {
                return { ...prev, [field]: value.split(',').map(s => s.trim()) };
            }
            return { ...prev, [field]: value };
        });
    }

    switch (generatorType) {
      case 'names-taglines':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Startup Name" content={generatedIdeas.startupName} onCopy={() => handleCopyToClipboard(generatedIdeas.startupName)} onSave={() => handleSave({ startupName: generatedIdeas.startupName }, 'startup-name')} onDownload={() => handleDownload(generatedIdeas.startupName, 'startup-name.txt')} onContentChange={(value) => handleFieldChange('startupName', value)} rows={1} />
            <ResultCard title="Tagline" content={generatedIdeas.tagline} onCopy={() => handleCopyToClipboard(generatedIdeas.tagline)} onSave={() => handleSave({ tagline: generatedIdeas.tagline }, 'tagline')} onDownload={() => handleDownload(generatedIdeas.tagline, 'tagline.txt')} onContentChange={(value) => handleFieldChange('tagline', value)} />
          </div>
        );
      case 'elevator-pitch':
        return <ResultCard title="Elevator Pitch" content={generatedIdeas.pitch} onCopy={() => handleCopyToClipboard(generatedIdeas.pitch)} onSave={() => handleSave({ pitch: generatedIdeas.pitch }, 'pitch')} onDownload={() => handleDownload(generatedIdeas.pitch, 'elevator-pitch.txt')} onContentChange={(value) => handleFieldChange('pitch', value)} />;
      case 'problem-solution':
        const problemSolutionCode = `<div>
  <h3 class="text-xl font-bold">Problem</h3>
  <p>${generatedIdeas.problemStatement}</p>
  <h3 class="text-xl font-bold mt-4">Solution</h3>
  <p>${generatedIdeas.solutionStatement}</p>
</div>`;

        return (
          <div className="space-y-6">
            <ResultWithCode 
              title="Problem & Solution"
              preview={
                <div>
                  <h3 className="text-lg font-semibold">Problem</h3>
                  <Textarea value={generatedIdeas.problemStatement} onChange={(e) => handleFieldChange('problemStatement', e.target.value)} className="text-muted-foreground bg-transparent border-0 p-0" rows={(generatedIdeas.problemStatement.match(/\n/g) || []).length + 2} />

                  <h3 className="text-lg font-semibold mt-4">Solution</h3>
                   <Textarea value={generatedIdeas.solutionStatement} onChange={(e) => handleFieldChange('solutionStatement', e.target.value)} className="text-muted-foreground bg-transparent border-0 p-0" rows={(generatedIdeas.solutionStatement.match(/\n/g) || []).length + 2} />
                </div>
              }
              code={problemSolutionCode}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button onClick={() => handleSave({ problemStatement: generatedIdeas.problemStatement, solutionStatement: generatedIdeas.solutionStatement }, 'problem-solution')} className="w-full sm:w-auto">
                    <Save className="mr-2" />
                    Save to Library
                </Button>
                <Button onClick={handleExportToPdf} className="w-full sm:w-auto">
                    <FileDown className="mr-2" />
                    Export to PDF
                </Button>
            </div>
          </div>
        );
      case 'audience-uvp':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Target Audience" content={generatedIdeas.targetAudience} onCopy={() => handleCopyToClipboard(generatedIdeas.targetAudience)} onSave={() => handleSave({ targetAudience: generatedIdeas.targetAudience }, 'target-audience')} onDownload={() => handleDownload(generatedIdeas.targetAudience, 'target-audience.txt')} onContentChange={(value) => handleFieldChange('targetAudience', value)} />
            <ResultCard title="Unique Value Proposition" content={generatedIdeas.uniqueValueProposition} onCopy={() => handleCopyToClipboard(generatedIdeas.uniqueValueProposition)} onSave={() => handleSave({ uniqueValueProposition: generatedIdeas.uniqueValueProposition }, 'uvp')} onDownload={() => handleDownload(generatedIdeas.uniqueValueProposition, 'uvp.txt')} onContentChange={(value) => handleFieldChange('uniqueValueProposition', value)} />
          </div>
        );
      case 'hero-copy':
        return <ResultCard title="Website Hero Copy" content={generatedIdeas.heroCopy} onCopy={() => handleCopyToClipboard(generatedIdeas.heroCopy)} onSave={() => handleSave({ heroCopy: generatedIdeas.heroCopy }, 'hero-copy')} onDownload={() => handleDownload(generatedIdeas.heroCopy, 'hero-copy.txt')} onContentChange={(value) => handleFieldChange('heroCopy', value)} />;
      case 'logo-colors':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <ResultCard title="Logo Concept" content={generatedIdeas.logoConcept} onCopy={() => handleCopyToClipboard(generatedIdeas.logoConcept)} onSave={() => handleSave({ logoConcept: generatedIdeas.logoConcept }, 'logo-concept')} onDownload={() => handleDownload(generatedIdeas.logoConcept, 'logo-concept.txt')} onContentChange={(value) => handleFieldChange('logoConcept', value)} />
            <ResultCard 
              title="Color Palette" 
              content={generatedIdeas.colorPalette.join(', ')}
              onCopy={() => handleCopyToClipboard(generatedIdeas.colorPalette.join(', '))}
              onSave={() => handleSave({ colorPalette: generatedIdeas.colorPalette }, 'color-palette')}
              onDownload={() => handleDownload(generatedIdeas.colorPalette.join(', '), 'color-palette.txt')}
              onContentChange={(value) => handleFieldChange('colorPalette', value)}
              rows={1}
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
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button type="submit" disabled={isLoading || !prompt} className="w-full sm:w-auto" size="lg">
                {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2" />}
                Generate
              </Button>
              {generatedIdeas && (
                <Button onClick={handleRegenerate} disabled={isLoading || !prompt} className="w-full sm:w-auto" size="lg" variant="outline">
                  {isLoading ? <LoadingSpinner className="mr-2" /> : <RefreshCw className="mr-2" />}
                  Regenerate
                </Button>
              )}
            </div>
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

    