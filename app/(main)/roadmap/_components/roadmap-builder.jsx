"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {FaArrowRight} from 'react-icons/fa'
import Link from "next/link";

export default function RoadmapBuilder({ content }) {
  const [roadmap, setRoadmap] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      setLoading(true);
      try {
        if (!content || !Array.isArray(content)) {
          throw new Error("Invalid roadmap data");
        }
        setRoadmap(content);
      } catch (err) {
        setError("Failed to load roadmap data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmapData();
  }, [content]);

  const toggleCompletion = (index) => {
    setRoadmap((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  };

  console.log(content)
  return (
    <div className="p-10 bg-[#0a0a0a] min-h-screen flex flex-col items-center">
      {loading && <p className="text-blue-500 text-center">Loading roadmap...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && roadmap.length > 0 && (
        <div className="relative w-full flex flex-col items-center">
          {roadmap.map((step, index) => (
            <div key={index} className="relative w-full flex flex-col items-center">
              {/* Vertical line between steps */}
              {index !== 0 && (
                <div className="absolute left-1/2 top-[-40px] h-[40px] w-[1px] bg-slate-500 transform -translate-x-1/2"></div>
              )}

              {/* Step content */}
              <div className="w-full max-w-4xl p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-xl border border-gray-700 mb-10">
                <div className="flex items-center space-x-6">
                  {/* Completion toggle button */}
                  <button
                    onClick={() => toggleCompletion(index)}
                    className="w-12 h-12 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow-md transition-transform hover:scale-110"
                  >
                    {step.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>

                  {/* Step details */}
                  <Card className="flex-grow bg-transparent border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-2xl font-semibold text-white ${step.completed ? 'line-through text-gray-400' : ''}`}>
                          {step.milestone}
                        </h3>
                        {step.documentationLink && (
                          <a
                            href={step.documentationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            Docs <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                      <p className={`text-gray-300 mt-2 ${step.completed ? 'line-through text-gray-500' : ''}`}>
                        {step.description}
                      </p>

                      {/* <div className="absolute right-2 pl-4 top-1/3 text-base">
                        <Link href="/preparation" className="group">
                          <FaArrowRight className="inline-block transition-transform duration-500 ease-in-out transform group-hover:translate-x-2" />
                        </Link>
                      </div> */}


                      <Link href="/preparation" className="pt-4 flex gap-4">
                        <Button>Start Preparation</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}