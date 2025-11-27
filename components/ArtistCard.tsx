
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Project, Language } from '../types';
import { ArrowUpRight, Crosshair } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  language: Language;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, language }) => {
  return (
    <motion.div
      className="group relative h-[450px] w-full overflow-hidden bg-black border border-white/10 cursor-none hover:border-[#00f0ff]/50 transition-colors duration-300"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Tech Markers - Top Left */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <div className="flex flex-col gap-1">
             <span className="text-[10px] font-mono text-[#00f0ff] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               ID_{project.id.padStart(3, '0')}
             </span>
             <span className="text-xs font-mono bg-white text-black px-1.5 py-0.5">
               {project.year}
             </span>
           </div>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 10 },
               hover: { opacity: 1, x: 0 }
             }}
             className="bg-[#00f0ff] text-black p-1"
           >
             <ArrowUpRight className="w-5 h-5" />
           </motion.div>
        </div>
        
        {/* Crosshair overlay on hover */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
           <Crosshair className="w-8 h-8 animate-spin-slow" />
        </motion.div>
      </div>

      {/* Image Background */}
      <div className="absolute inset-0 overflow-hidden bg-[#001020]">
        <motion.img 
          src={new URL(project.image, import.meta.env.BASE_URL).toString()} 
          alt={project.title[language]} 
          className="h-full w-full object-cover transition-all duration-500"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 border-t border-white/5 bg-black/80 backdrop-blur-sm">
        <div className="overflow-hidden">
          <motion.h3 
            className="font-heading text-2xl md:text-3xl font-bold uppercase text-white"
            variants={{
              rest: { y: 0 },
              hover: { x: 5, color: '#00f0ff' }
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title[language]}
          </motion.h3>
        </div>
        <motion.div 
          className="flex items-center gap-2 mt-2"
          variants={{
            rest: { opacity: 0.6 },
            hover: { opacity: 1 }
          }}
        >
          <div className="h-px w-4 bg-[#00f0ff]" />
          <p className="text-xs font-mono uppercase tracking-widest text-gray-300">
            {project.category[language]}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
