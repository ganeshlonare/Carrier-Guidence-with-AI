// "use client";

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   BriefcaseIcon,
//   LineChart,
//   TrendingUp,
//   TrendingDown,
//   Brain,
// } from "lucide-react";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

// const DashboardView = ({ insights }) => {
//   // Transform salary data for the chart
//   const salaryData = insights.salaryRanges.map((range) => ({
//     name: range.role,
//     min: range.min / 1000,
//     max: range.max / 1000,
//     median: range.median / 1000,
//   }));

//   const getDemandLevelColor = (level) => {
//     switch (level.toLowerCase()) {
//       case "high":
//         return "bg-green-500";
//       case "medium":
//         return "bg-yellow-500";
//       case "low":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getMarketOutlookInfo = (outlook) => {
//     switch (outlook.toLowerCase()) {
//       case "positive":
//         return { icon: TrendingUp, color: "text-green-500" };
//       case "neutral":
//         return { icon: LineChart, color: "text-yellow-500" };
//       case "negative":
//         return { icon: TrendingDown, color: "text-red-500" };
//       default:
//         return { icon: LineChart, color: "text-gray-500" };
//     }
//   };

//   const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
//   const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

//   // Format dates using date-fns
//   const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
//   const nextUpdateDistance = formatDistanceToNow(
//     new Date(insights.nextUpdate),
//     { addSuffix: true }
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
//       </div>

//       {/* Market Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Market Outlook
//             </CardTitle>
//             <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{insights.marketOutlook}</div>
//             <p className="text-xs text-muted-foreground">
//               Next update {nextUpdateDistance}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Industry Growth
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {insights.growthRate.toFixed(1)}%
//             </div>
//             <Progress value={insights.growthRate} className="mt-2" />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
//             <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{insights.demandLevel}</div>
//             <div
//               className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
//                 insights.demandLevel
//               )}`}
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
//             <Brain className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-1">
//               {insights.topSkills.map((skill) => (
//                 <Badge key={skill} variant="secondary">
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Salary Ranges Chart */}
//       <Card className="col-span-4">
//         <CardHeader>
//           <CardTitle>Salary Ranges by Role</CardTitle>
//           <CardDescription>
//             Displaying minimum, median, and maximum salaries (in thousands)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={salaryData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip
//                   content={({ active, payload, label }) => {
//                     if (active && payload && payload.length) {
//                       return (
//                         <div className="bg-background border rounded-lg p-2 shadow-md">
//                           <p className="font-medium">{label}</p>
//                           {payload.map((item) => (
//                             <p key={item.name} className="text-sm">
//                               {item.name}: ${item.value}K
//                             </p>
//                           ))}
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
//                 <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
//                 <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Industry Trends */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Key Industry Trends</CardTitle>
//             <CardDescription>
//               Current trends shaping the industry
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-4">
//               {insights.keyTrends.map((trend, index) => (
//                 <li key={index} className="flex items-start space-x-2">
//                   <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
//                   <span>{trend}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recommended Skills</CardTitle>
//             <CardDescription>Skills to consider developing</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {insights.recommendedSkills.map((skill) => (
//                 <Badge key={skill} variant="outline">
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DashboardView;

/////////////////////////////////////////////////////////////////////////


"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardHeader,CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, Moon, TrendingUp, TrendingDown, LineChart as LineChartIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";


const getDemandLevelColor = (level) => {
  switch (level.toLowerCase()) {
    case "high":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getMarketOutlookInfo = (outlook) => {
  switch (outlook.toLowerCase()) {
    case "positive":
      return { icon: TrendingUp, color: "text-green-500" };
    case "neutral":
      return { icon: LineChartIcon, color: "text-yellow-500" };
    case "negative":
      return { icon: TrendingDown, color: "text-red-500" };
    default:
      return { icon: LineChartIcon, color: "text-gray-500" };
  }
};

export default function Dashboard({ insights }) {
  const [darkMode, setDarkMode] = useState(true);

  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className={darkMode ? "bg-[#0a0a0a] text-white min-h-screen p-6" : "bg-gray-100 text-gray-900 min-h-screen p-6"}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1 className="text-3xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          AI Career Dashboard
        </motion.h1>
        <Button onClick={() => setDarkMode(!darkMode)} variant="ghost">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      {/* Top Skills Card */}
      <Card className="bg-[#181818] border border-gray-700 mb-6">
        <CardContent className="p-4">
          <p className="text-lg font-semibold text-gray-400 mb-2">Top Skills</p>
          <div className="flex flex-wrap gap-2">
            {insights.topSkills.map((skill, index) => (
              <span key={index} className="bg-white text-black px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#181818] border border-gray-700">
          <CardContent className="p-4">
            <p className="text-lg font-semibold text-gray-400">Market Outlook</p>
            <div className={`flex items-center gap-2 ${outlookColor}`}>
              <OutlookIcon size={24} />
              <p className="text-2xl">{insights.marketOutlook}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border border-gray-700">
          <CardContent className="p-4">
            <p className="text-lg font-semibold text-gray-400">Last Updated</p>
            <p className="text-2xl text-gray-100">{lastUpdatedDate}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border border-gray-700">
          <CardContent className="p-4">
             <p className="text-lg font-semibold text-gray-400">Next Update</p>
             <p className="text-2xl text-gray-200">{nextUpdateDistance}</p>
          </CardContent>
        </Card>
    </div>

      {/* Salary Chart */}
      <Card className="bg-[#181818] border border-gray-700">
        <CardContent className="p-6">
          <p className="text-xl font-bold text-gray-400 mb-4">Salary Trends by Role</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: "#222", color: "#fff" }} />
              <Line type="monotone" dataKey="min" stroke="#4ade80" strokeWidth={2} dot={{ fill: "#4ade80" }} />
              <Line type="monotone" dataKey="median" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa" }} />
              <Line type="monotone" dataKey="max" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Industry Trends */}
      <div className="mt-6 bg-[#181818] p-4 md:p-6 rounded-lg">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Key Industry Trends */}
    <Card className="bg-[#181818] border border-gray-700 text-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Key Industry Trends</CardTitle>
        <CardDescription className="text-gray-400">
          Current trends shaping the industry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {insights.keyTrends.map((trend, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
              <span className="text-gray-300">{trend}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {/* Recommended Skills */}
    <Card className="bg-[#181818] border border-gray-700 text-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recommended Skills</CardTitle>
        <CardDescription className="text-gray-400">
          Skills to consider developing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {insights.recommendedSkills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-gray-300 border-gray-600">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
    
  </div>
</div>

    </div>
  );
}