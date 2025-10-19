'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Inbox } from 'lucide-react';
import { format } from 'date-fns';

export default function LibraryPage() {
  const { user, isUserLoading, firestore } = useFirebase();

  const generatedContentRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/generatedContent`), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: items, isLoading, error } = useCollection<any>(generatedContentRef);

  const renderContent = (item: any) => {
    switch (item.type) {
      case 'startup-name':
        return <p><span className="font-semibold">Name:</span> {item.startupName}</p>;
      case 'tagline':
        return <p><span className="font-semibold">Tagline:</span> {item.tagline}</p>;
      case 'pitch':
        return <p><span className="font-semibold">Pitch:</span> {item.pitch}</p>;
      case 'problem-statement':
        return <p><span className="font-semibold">Problem:</span> {item.problemStatement}</p>;
      case 'solution-statement':
        return <p><span className="font-semibold">Solution:</span> {item.solutionStatement}</p>;
      case 'target-audience':
        return <p><span className="font-semibold">Audience:</span> {item.targetAudience}</p>;
      case 'uvp':
        return <p><span className="font-semibold">UVP:</span> {item.uniqueValueProposition}</p>;
      case 'hero-copy':
        return <p><span className="font-semibold">Hero Copy:</span> {item.heroCopy}</p>;
      case 'logo-concept':
        return <p><span className="font-semibold">Logo Concept:</span> {item.logoConcept}</p>;
      case 'color-palette':
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Colors:</span>
            {item.colorPalette.map((color: string) => (
              <div key={color} className="h-6 w-6 rounded-full border" style={{ backgroundColor: color }} />
            ))}
          </div>
        );
      case 'text':
        return <p className="line-clamp-3"><span className="font-semibold">Text:</span> {item.text}</p>;
      default:
        return <p>Unsupported content type.</p>;
    }
  };

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-0">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">
        My Library
      </h1>

      {isUserLoading && renderSkeleton()}

      {!isUserLoading && !user && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Please sign in to view your library.</p>
        </div>
      )}

      {user && (
        <>
          {isLoading && !items && renderSkeleton()}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {items && items.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map(item => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{item.type.replace('-', ' ')}</CardTitle>
                    <CardDescription>
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2 line-clamp-2">Prompt: {item.prompt}</p>
                    {renderContent(item)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {items && items.length === 0 && !isLoading && (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
               <div className="flex justify-center mb-4">
                <Inbox className="h-12 w-12 text-muted-foreground" />
               </div>
              <p className="text-muted-foreground">Your library is empty.</p>
              <p className="text-muted-foreground mt-2">Start creating to save your content here.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
