import { savePreparation } from "@/actions/preparation";
import WeekPlan from "./_components/week-plan"

export default async function Preparation() {
  const content = await savePreparation();

  // console.log(content);

  return (
    <div>
      <WeekPlan content={content}/>
    </div>
  );
}