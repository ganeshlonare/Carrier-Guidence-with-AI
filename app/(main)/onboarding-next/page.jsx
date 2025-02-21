import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingNextStatus } from "@/actions/user";

export default async function OnboardingPage() {

  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingNextStatus();

  if (isOnboarded) {
    redirect("/interview/mock");
  }

  return (
    <main>
      <OnboardingForm />
    </main>
  );
}