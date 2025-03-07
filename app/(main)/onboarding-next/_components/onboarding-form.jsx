// "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Loader2 } from "lucide-react";
// // import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Link from "next/link";
// const OnboardingForm = () => {
//   // const router = useRouter();
//   // const [selectedIndustry, setSelectedIndustry] = useState(null);

//   // const {
//   //   loading: updateLoading,
//   //   fn: updateUserFn,
//   //   data: updateResult,
//   // } = useFetch(updateUser);

//   // const {
//   //   register,
//   //   handleSubmit,
//   //   formState: { errors },
//   //   setValue,
//   //   watch,
//   // } = useForm({
//   //   resolver: zodResolver(onboardingSchema),
//   // });

//   // const onSubmit = async (values) => {
//   //   try {
//   //     const formattedIndustry = `${values.industry}-${values.subIndustry
//   //       .toLowerCase()
//   //       .replace(/ /g, "-")}`;

//   //     await updateUserFn({
//   //       ...values,
//   //       industry: formattedIndustry,
//   //     });
//   //   } catch (error) {
//   //     console.error("Onboarding error:", error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (updateResult?.success && !updateLoading) {
//   //     toast.success("Profile completed successfully!");
//   //     router.push("/dashboard");
//   //     router.refresh();
//   //   }
//   // }, [updateResult, updateLoading]);

//   // const watchIndustry = watch("industry");

//   return (
//     <div className="flex items-center justify-center bg-background">
//       <Card className="w-full max-w-lg mt-10 mx-2">
//         <CardHeader>
//           <CardTitle className="gradient-title text-4xl">
//             Complete Your Profile
//           </CardTitle>
//           <CardDescription>
//             Select what you want to achieve and what you have done so far
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-6">
            
//           <div className="space-y-2">
//               <Label htmlFor="experience">What is your target</Label>
//               <Input
//                 id="experience"
//                 type="string"
//                 min="0"
//                 max="50"
//                 placeholder="Job at Google"
//                 // {...register("experience")}
//               />
//               {/* {errors.experience && (
//                 <p className="text-sm text-red-500">
//                   {errors.experience.message}
//                 </p>
//               )} */}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="experience">What have you done so far</Label>
//               <Input
//                 id="experience"
//                 type="string"
//                 placeholder="Certification , Achievement ..."
//                 // {...register("experience")}
//               />
//               {/* {errors.experience && (
//                 <p className="text-sm text-red-500">
//                   {errors.experience.message}
//                 </p>
//               )} */}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="bio">Projects</Label>
//               <Textarea
//                 id="bio"
//                 placeholder="Projects Completed..."
//                 className="h-32"
//                 // {...register("bio")}
//               />
//               {/* {errors.bio && (
//                 <p className="text-sm text-red-500">{errors.bio.message}</p>
//               )} */}
//             </div>

//             <Link href="/interview/mock">
//             <Button className="w-full mt-4">
//               Move forward to test
//             </Button>
//             </Link>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OnboardingForm;






"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { handleNextOnboarding } from "@/actions/user"; // Ensure you have this backend action

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// Schema for form validation
const onboardingSchema = z.object({
  target: z.string().min(3, "Target must be at least 3 characters."),
  achievements: z.string().min(3, "Please mention at least one achievement."),
  projects: z.string().min(5, "Describe your projects in detail."),
});

const OnboardingForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await handleNextOnboarding(values);
        toast.success("Profile updated successfully!");
        router.push("/interview/mock");
    } catch (error) {
      console.log(error)
      toast.error("Error updating profile.");
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select what you want to achieve and what you have done so far
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target">What is your target?</Label>
              <Input id="target" placeholder="Job at Google" {...register("target")} />
              {errors.target && <p className="text-sm text-red-500">{errors.target.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">What have you done so far?</Label>
              <Input id="achievements" placeholder="Certifications, Achievements..." {...register("achievements")} />
              {errors.achievements && <p className="text-sm text-red-500">{errors.achievements.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea id="projects" placeholder="Projects Completed..." className="h-32" {...register("projects")} />
              {errors.projects && <p className="text-sm text-red-500">{errors.projects.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Updating..." : "Move forward to test"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
