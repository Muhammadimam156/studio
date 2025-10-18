import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextGenerator } from "@/components/text-generator"
import { ImageGenerator } from "@/components/image-generator"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-0">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">
        Content Generation
      </h1>
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="text">Text Generation</TabsTrigger>
          <TabsTrigger value="image">Image Generation</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <TextGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ImageGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
