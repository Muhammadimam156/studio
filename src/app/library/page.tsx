import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LibraryPage() {
  const content = PlaceHolderImages;

  return (
    <div className="container mx-auto px-0">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">
        My Library
      </h1>
      {content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <div className="aspect-[3/2] relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-base font-medium line-clamp-2">
                  {item.description}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Your library is empty.</p>
          <p className="text-muted-foreground mt-2">Start creating to save your content here.</p>
        </div>
      )}
    </div>
  );
}
