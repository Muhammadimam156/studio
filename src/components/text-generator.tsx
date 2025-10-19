'use client';

import { useState } from 'react';
import { handleTextGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Copy, Save, AlertCircle, FileDown, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from './loading-spinner';
import { useAuth, useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';

export function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
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
    setGeneratedText('');

    const result = await handleTextGeneration(prompt);

    if (result.success && result.data) {
      setGeneratedText(result.data.text);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const handleRegenerate = () => {
    if (!prompt) return;
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  const handleCopyToClipboard = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied to clipboard!",
      description: "The generated text has been copied.",
    });
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Generated text has been downloaded.",
    });
  };

  const handleSave = () => {
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
      text: generatedText,
      type: 'text',
      prompt: prompt,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Saved to Library!",
      description: "Your content has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., Write a short sci-fi story about a sentient AI on a lonely space probe."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="text-base"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isLoading || !prompt} size="lg">
                {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2" />}
                Generate Text
              </Button>
              {generatedText && (
                <Button onClick={handleRegenerate} disabled={isLoading || !prompt} size="lg" variant="outline">
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
        <Card>
          <CardHeader>
            <CardTitle>Generating...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {generatedText && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Text</CardTitle>
          </Header>
          <CardContent>
            <Textarea
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              rows={10}
              className="text-base bg-background"
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={handleDownload} variant="secondary">
              <FileDown className="mr-2" /> Download
            </Button>
            <Button onClick={handleCopyToClipboard} variant="secondary">
              <Copy className="mr-2" /> Copy
            </Button>
            <Button onClick={handleSave} variant="secondary">
              <Save className="mr-2" /> Save to Library
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
