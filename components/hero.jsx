"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={"/banner.png"}
          alt="Hero Background"
          fill
          className="object-cover brightness-75"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5 }} 
        className="text-center z-10 space-y-6"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-5xl font-extrabold md:text-6xl lg:text-7xl text-white drop-shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Your AI-Powered Personalized <br />Pathway to Career Success
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="mx-auto max-w-[600px] text-gray-200 md:text-xl hover:text-white transition-colors duration-300"
        >
          Empower your career journey with AI-Powered personalized roadmaps, 
          personalized study plan, interview mastery, and job-winning strategies.
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="/preparation">
              <Button size="lg" className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-purple-600 hover:to-blue-500 shadow-lg">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
