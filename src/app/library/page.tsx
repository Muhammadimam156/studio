
export default function LibraryPage() {
  return (
    <div className="container mx-auto px-0">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">
        My Library
      </h1>
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Your library is empty.</p>
        <p className="text-muted-foreground mt-2">Start creating to save your content here.</p>
      </div>
    </div>
  );
}
