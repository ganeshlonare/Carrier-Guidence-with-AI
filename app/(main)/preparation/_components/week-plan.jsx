"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Video } from "lucide-react"; // Import icons for a professional look
import { useState } from "react";

export default function WeekPlan({ content }) {
    const [videoLink, setVideoLink] = useState(content[0].data[0].youtube_link);

    const handleVideoLinkChange = (link) => {
        setVideoLink(link);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="w-full md:w-1/3">
            <h1 className="text-3xl font-bold gradient-title">
          Your Personalized Study Plan
        </h1>
                <Accordion type="single" collapsible className="w-full">
                    {content.map((week, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`}>
                            <AccordionTrigger className="text-lg font-semibold p-6 rounded-lg transition-colors">
                                {week.title}
                            </AccordionTrigger>
                            <AccordionContent className="p-6 text-white">
                                <ul className="space-y-4">
                                    {week.data.map((subpoint, subIndex) => (
                                        <li key={subIndex} className="flex items-start gap-3">
                                            {/* Icon for sub-point */}
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-white font-medium">
                                                    {subpoint.subpoint}
                                                </p>
                                                {/* YouTube link with icon */}
                                                {subpoint.youtube_link && (
                                                    <a
                                                        href={subpoint.youtube_link}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleVideoLinkChange(subpoint.youtube_link);
                                                        }}
                                                        className="text-blue-600 hover:underline flex items-center gap-2 mt-1"
                                                    >
                                                        <Video className="w-4 h-4" />
                                                        Watch Video
                                                    </a>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Video Player and Documentation Section (60% width on medium screens and above) */}
            <div className="w-full md:w-[67%]">
                {/* Video Player */}
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        className="w-full h-full"
                        src={videoLink}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Documentation Section */}
                <div className="mt-6 p-6 rounded-lg shadow-sm bg-gray-800">
                    <h2 className="text-xl font-bold mb-4 text-white">Video Documentation</h2>
                    <p className="text-white">
                        This video provides an introduction to the project roadmap. It covers the following key points:
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quod et eius beatae blanditiis facilis quibusdam repellendus tenetur pariatur, modi quae? Quos molestiae incidunt magni. Suscipit repudiandae tempore atque! Repellat!
                    </p>
                    <ul className="list-disc list-inside mt-2 text-white">
                        <li>Overview of the project goals and objectives.</li>
                        <li>Explanation of the timeline and milestones.</li>
                        <li>Key deliverables for each phase of the project.</li>
                    </ul>
                    <p className="mt-4 text-white">
                        For more details, refer to the{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                            project documentation
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}