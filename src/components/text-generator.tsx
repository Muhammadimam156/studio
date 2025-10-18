'use client';

import { useState } from 'react';
import { handleTextGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Copy, Save, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from './loading-spinner';

export function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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
  
  const handleCopyToClipboard = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied to clipboard!",
      description: "The generated text has been copied.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Feature not available",
      description: "Saving content will be implemented soon.",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="e.g., Write a short sci-fi story about a sentient AI on a lonely space probe."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="text-base"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !prompt} className="w-full sm:w-auto" variant="outline">
          {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2" />}
          Generate Text
        </Button>
      </form>

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

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              rows={10}
              className="text-base"
            />
          </CardContent>
          <CardFooter className="gap-2">
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
