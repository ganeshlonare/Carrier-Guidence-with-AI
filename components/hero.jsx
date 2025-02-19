"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <div className="absolute bottom-0 right-0 w-1/2 h-full">
        <Image
          src={"/banner.png"} // Path to your image in the public folder
          alt="Hero Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-6 text-center z-10">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-7xl gradient-title animate-gradient">
          Your AI-Powered Personalized <br />Pathway to Career Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
          Empower your career journey with AI-Powered personalized roadmaps, 
          personalized study plan, interview mastery, and job-winning strategies.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/preparation">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          {/* <Link href="https://www.youtube.com/roadsidecoder">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
