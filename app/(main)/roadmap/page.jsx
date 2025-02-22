import { getRoadmap, saveRoadmap } from "@/actions/roadmap";
import RoadmapBuilder from "./_components/roadmap-builder"
import MarkdownRenderer from "@/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RoadMap() {
  const savedRoadmapContent = await saveRoadmap();
  // const readme=await getRoadmap();
  // console.log(readme)
  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Your Personalized Learning Roadmap
        </h1>
        <RoadmapBuilder content={savedRoadmapContent}/>

        <Link href="/preparation">
          {/* <MarkdownRenderer content={readme}/> */}
          <Button>Start Preparation</Button>
        </Link> 
      </div>
    </div>
  );
}