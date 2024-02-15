import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Posts from "./Posts";

type ContentProps = {
  id: string;
};

const Content = ({ id }: ContentProps) => {
  return (
    <Tabs defaultValue="posts" className="w-full ">
      <TabsList className="w-full flex items-center justify-around">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="reels">Reels</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="">
        <Posts id={id} />
      </TabsContent>
      <TabsContent value="reels">No reels yet has been uploaded.</TabsContent>
    </Tabs>
  );
};

export default Content;
