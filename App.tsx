
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Code, Layers, Zap, Terminal, Menu, X, Calendar, ChevronLeft, ChevronRight, Globe, MapPin, Cpu, Plus, Minus, Database, Server, Box, Brain, Smartphone, Cloud, Bot, Github, ExternalLink } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import { Project, Language } from './types';

// Multilingual Content
const CONTENT = {
  en: {
    nav: { work: 'Selected_Work', about: 'Database', services: 'Capabilities', talk: "Init_Comm" },
    hero: {
      status: 'SYS:ONLINE',
      remote: 'REMOTE_ACCESS:ENABLED',
      role: 'CREATE THE FUTURE',
    },
    marquee: ['CREATIVE DEV', 'REACT_CORE', 'THREE_JS', 'WEB_GL'],
    work: { title: 'ARCHIVES' },
    workAccent: 'V.1.0',
    about: {
      title: 'SYSTEM',
      subtitle: 'DIAGNOSTICS',
      intro: "I am Eidon.",
      desc: "Executing code symphonies at the intersection of design and engineering. Building immersive, performant web experiences.",
      stackTitle: 'TECH STACK & SPECIALTIES',
      locationTitle: 'COORDINATES',
      location: 'GLOBAL / REMOTE',
      stats: {
        exp: 'UPTIME_YEARS',
        projects: 'PROJECTS_DEPLOYED',
      },
    },
    services: {
      title: 'WHAT I DO',
      subtitle: "CAPABILITIES",
      items: [
        { 
          title: 'AI Agents & Auto-Workflows', 
          desc: 'Autonomous agents dealing with complex logic. Intelligent automation for business processes.',
          icon: 'Bot'
        },
        { 
          title: 'High-Performance Web Software', 
          desc: 'Modern web apps, SaaS platforms, and responsive dashboards built with React & Node.js.',
          icon: 'Code'
        },
        { 
          title: 'AI Feature Integration', 
          desc: 'Embedding LLM capabilities into existing products to unlock new business value.',
          icon: 'Brain'
        }
      ],
      button: { idle: 'INITIALIZE', sending: 'SENDING...', sent: 'ACKNOWLEDGED' }
    },
    techCategories: {
      ai: { title: 'AI / LLM_STACK', skills: ['OpenAI', 'Local Models', 'RAG', 'Evaluation', 'Prompt Tooling'] },
      backend: { title: 'BACKEND_OPS', skills: ['Kotlin', 'Java', 'Node.js', 'Python', 'REST', 'gRPC'] },
      frontend: { title: 'FRONTEND / APP', skills: ['Android (Compose)', 'React', 'HTML/CSS', 'WebGL'] },
      infra: { title: 'INFRA_STRUCTURE', skills: ['Docker', 'AWS', 'Google Cloud', 'CI/CD'] }
    },
    footer: { rights: 'ALL RIGHTS RESERVED.' }
  },
  zh: {
    nav: { work: '精选作品', about: '数据库', services: '能力展示', talk: "发起会话" },
    hero: {
      status: '系统：在线',
      remote: '远程接入：已启用',
      role: '创造未来',
    },
    marquee: ['创意开发', 'REACT 核心', 'THREE_JS', 'WEB_GL'],
    work: { title: '项目档案' },
    workAccent: 'V.1.0',
    about: {
      title: '系统',
      subtitle: '诊断',
      intro: "我是 Eidon。",
      desc: "在设计与工程的交汇处执行代码交响曲。构建沉浸式、高性能的 Web 体验。",
      stackTitle: '技术栈 & 专长',
      locationTitle: '坐标',
      location: '全球 / 远程',
      stats: {
        exp: '运行年限',
        projects: '已部署项目',
      },
    },
    services: {
      title: '我能为你做什么',
      subtitle: '服务范畴',
      items: [
        { 
          title: '🤖 Agent 智能体 & 自动化流', 
          desc: '处理复杂逻辑的自主智能体。业务流程的智能化自动工作流开发。',
          icon: 'Bot'
        },
        { 
          title: '💻 高性能 Web 软件开发', 
          desc: '现代 Web 应用、SaaS 平台以及基于 React & Node.js 的响应式管理后台。',
          icon: 'Code'
        },
        { 
          title: '🧠 现有产品 AI 能力集成', 
          desc: '将大模型能力嵌入现有软件产品，为业务解锁全新的智能化价值。',
          icon: 'Brain'
        }
      ],
      button: { idle: '初始化', sending: '发送中...', sent: '已确认' }
    },
    techCategories: {
      ai: { title: 'AI / 大模型核心', skills: ['OpenAI', 'Local Models', 'RAG', 'Evaluation', 'Prompt Tooling'] },
      backend: { title: '后端架构', skills: ['Kotlin', 'Java', 'Node.js', 'Python', 'REST', 'gRPC'] },
      frontend: { title: '前端 / 移动端', skills: ['Android (Compose)', 'React', 'HTML/CSS', 'WebGL'] },
      infra: { title: '基础设施', skills: ['Docker', 'AWS', 'Google Cloud', 'CI/CD'] }
    },
    footer: { rights: '版权所有.' }
  }
};

// Portfolio Data
const PROJECTS: Project[] = [
  { 
    id: '1', 
    title: { en: 'Xiangqi', zh: 'Xiangqi' }, 
    category: { en: 'Game Engine', zh: 'Web 博弈引擎' }, 
    year: '2025', 
    image: 'images/xiangqi.png',
    description: { 
      en: 'Modern React+TS Web App with high-performance local AI engine. No backend required—experience Grandmaster-level gameplay directly in your browser.',
      zh: '基于 React 和 TypeScript 构建的现代化中国象棋 Web 应用。内置高性能 JavaScript 本地博弈引擎，无需后端服务器，在浏览器中即可体验特级大师水准的对弈。'
    },
    githubUrl: 'https://github.com/Oldcircle/Xiangqi',
    projectUrl: 'https://oldcircle.github.io/Xiangqi/'
  },
  { 
    id: '2', 
    title: { en: 'Neon Survivor', zh: '霓虹幸存者' }, 
    category: { en: 'Web Game', zh: '网页游戏' }, 
    year: '2024', 
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'High-octane zombie survival arcade game. Features roguelike elements, intense action, and optimized WebGL rendering.',
      zh: '包含 Roguelike 元素的僵尸生存街机游戏。高强度的动作射击体验，极致的浏览器性能优化。'
    },
    githubUrl: 'https://github.com/Oldcircle/NeonSurvivor',
    projectUrl: 'https://oldcircle.github.io/NeonSurvivor/'
  },
  { 
    id: '3', 
    title: { en: 'FlashWord', zh: 'FlashWord' }, 
    category: { en: 'Android App', zh: '安卓应用' }, 
    year: '2024', 
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Duolingo-style English learning app. Gamified spaced repetition system built with Kotlin and Jetpack Compose.',
      zh: '类多邻国风格的英语学习安卓应用。采用游戏化机制和间隔重复算法，基于 Kotlin/Compose 原生构建。'
    },
    githubUrl: 'https://github.com/eidon-noctis',
    projectUrl: '#'
  },
  { 
    id: '4', 
    title: { en: 'ChromaCheck', zh: 'ChromaCheck' }, 
    category: { en: 'AI Tool', zh: 'AI 生产力工具' }, 
    year: '2023', 
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Smart color palette generator powered by LLMs. Instantly turns natural language descriptions into professional UI color schemes using Tailwind CSS.',
      zh: '基于大语言模型（LLM）构建的智能调色盘生成与色彩检视工具。利用 React 和 Tailwind CSS 将你的自然语言描述瞬间转化为专业的配色方案。'
    },
    githubUrl: 'https://github.com/Oldcircle/ChromaCheckAI',
    projectUrl: 'https://oldcircle.github.io/ChromaCheckAI/'
  },
  { 
    id: '5', 
    title: { en: 'Meow Justice', zh: '喵喵法庭' }, 
    category: { en: 'Social Web App', zh: '社交应用' }, 
    year: '2023', 
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Humorous dispute resolution platform. A fun web app helping couples and friends resolve conflicts gently with "court" mechanics.',
      zh: '喵喵大公无私法庭。一个有趣的 Web 应用程序，旨在帮助情侣、朋友、家人或同事以幽默和温和的方式解决争端。'
    },
    githubUrl: 'https://github.com/eidon-noctis',
    projectUrl: 'www.catcome.online'
  }
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const t = CONTENT[language];

  const handleContactAction = (index: number) => {
    setContactFormStatus('sending');
    setTimeout(() => {
      setContactFormStatus('sent');
      setTimeout(() => setContactFormStatus('idle'), 3000);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Brain': return <Brain className="w-8 h-8 group-hover:text-black text-[#00f0ff] transition-colors" />;
      case 'Database': return <Database className="w-8 h-8 group-hover:text-black text-[#00f0ff] transition-colors" />;
      case 'Code': return <Code className="w-8 h-8 group-hover:text-black text-[#00f0ff] transition-colors" />;
      case 'Bot': return <Bot className="w-8 h-8 group-hover:text-black text-[#00f0ff] transition-colors" />;
      default: return <Code className="w-8 h-8 group-hover:text-black text-[#00f0ff] transition-colors" />;
    }
  };
  
  const navigateProject = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === selectedProject.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? PROJECTS.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === PROJECTS.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedProject(PROJECTS[newIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#00f0ff] selection:text-black cursor-auto md:cursor-none overflow-x-hidden font-sans bg-transparent">
      <CustomCursor />
      <FluidBackground />
      <AIChat language={language} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-[#00f0ff] animate-pulse"></div>
           <div className="font-heading text-xl font-bold tracking-tighter text-white cursor-default">NOCTIS</div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-xs font-mono tracking-widest uppercase">
          {Object.entries(t.nav).filter(([key]) => key !== 'talk').map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => scrollToSection(key)}
              className="hover:text-[#00f0ff] transition-colors text-gray-400 cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {label}
            </button>
          ))}
          
          <button
             onClick={toggleLanguage}
             className="text-gray-400 hover:text-[#00f0ff] transition-colors flex items-center gap-2 cursor-pointer"
             data-hover="true"
          >
             <Globe className="w-3 h-3" />
             <span>{language === 'en' ? 'EN' : 'CN'}</span>
          </button>
        </div>
        
        <button 
          onClick={() => scrollToSection('services')}
          className="hidden md:inline-block border border-[#00f0ff]/50 px-6 py-2 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-[#00f0ff] hover:text-black transition-all duration-300 text-[#00f0ff] cursor-pointer bg-transparent"
          data-hover="true"
        >
          [{t.nav.talk}]
        </button>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50 flex items-center gap-4">
          <button onClick={toggleLanguage} className="text-sm font-mono font-bold text-[#00f0ff]">
              {language === 'en' ? 'EN' : 'CN'}
           </button>
          <button 
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {Object.entries(t.nav).map(([key, label]) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className="text-2xl font-mono font-bold text-white hover:text-[#00f0ff] transition-colors uppercase"
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
        <div className="z-10 text-center flex flex-col items-center w-full max-w-7xl">
           {/* HUD Elements */}
           <div className="absolute top-32 left-4 md:left-10 flex flex-col gap-1 text-[10px] font-mono text-[#00f0ff]/60 text-left">
             <div>SYS.STATUS: ONLINE</div>
             <div>LOC: {t.hero.remote}</div>
           </div>

          <div className="flex flex-col items-center relative py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-6 relative z-10"
            >
              <GradientText 
                text="NOCTIS" 
                as="h1" 
                className="text-[15vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center mix-blend-exclusion" 
              />
            </motion.div>

            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "200px" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-px bg-[#00f0ff] mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-2xl font-mono uppercase tracking-[0.3em] text-white/90 max-w-2xl text-center px-4"
            >
              {t.hero.role}
            </motion.p>
          </div>
        </div>

        {/* MARQUEE - Bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-[#00f0ff] text-black py-2 overflow-hidden z-20 border-t-2 border-white">
          <motion.div 
            className="flex w-fit"
            animate={{ x: "-50%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0 gap-10 px-5">
                {t.marquee.map((item, i) => (
                  <span key={i} className="text-lg md:text-xl font-mono font-bold tracking-widest flex items-center gap-4">
                    {item} <span className="text-white">///</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* WORK SECTION */}
      <section id="work" className="relative z-10 py-20 md:py-32 border-t border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6">
          <div className="flex items-baseline gap-4 mb-12">
             <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">{t.work.title}</h2>
             <span className="text-[#00f0ff] font-mono text-sm">[{t.workAccent}]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Brutalist Grid */}
      <section id="about" className="relative z-10 py-24 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-4">
             <div>
               <div className="text-[#00f0ff] font-mono text-xs mb-1">:: {t.about.subtitle} ::</div>
               <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white">
                  {t.about.title}
               </h2>
             </div>
             <Cpu className="w-8 h-8 text-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             
             {/* 1. Bio Card */}
             <div className="md:col-span-8 p-8 bg-black border border-white/10 hover:border-[#00f0ff] transition-colors group relative">
                <div className="absolute top-0 right-0 p-2">
                  <Plus className="w-4 h-4 text-white/20 group-hover:text-[#00f0ff]" />
                </div>
                <Code className="w-10 h-10 text-[#00f0ff] mb-6" />
                <h3 className="text-lg md:text-2xl font-light leading-relaxed text-gray-200 font-mono">
                  <span className="text-white font-bold block mb-2">{t.about.intro}</span>
                  {t.about.desc}
                </h3>
             </div>

            {/* 2. Portrait / Identity */}
             <div className="md:col-span-4 md:row-span-2 h-[300px] md:h-auto bg-black border border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${new URL('images/me.jpg', import.meta.env.BASE_URL).toString()})` }}></div>
                {/* No grayscale overlay */}
                <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 bg-black px-3 py-1 border border-white/20">
                   <span className="text-[#00f0ff] font-mono text-xs">ID: EIDON</span>
                </div>
             </div>

             {/* 3. Tech Stack - UPDATED DESIGN */}
             <div className="md:col-span-4 p-6 bg-black border border-white/10 flex flex-col justify-between hover:border-white/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase mb-4 border-b border-white/10 pb-2">
                  <Terminal className="w-3 h-3" />
                  {t.about.stackTitle}
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {(Object.entries(t.techCategories) as [string, { title: string; skills: string[] }][]).map(([key, category]) => (
                    <div key={key} className="group/stack">
                       <div className="flex items-center justify-between mb-2">
                         <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider group-hover/stack:text-white transition-colors">{category.title}</div>
                         <div className="w-2 h-2 rounded-full bg-white/10 group-hover/stack:bg-[#00f0ff] transition-colors"></div>
                       </div>
                       <div className="flex flex-wrap gap-1.5">
                          {category.skills.map((skill) => (
                             <span key={skill} className="text-[10px] px-2 py-1 bg-[#00f0ff]/5 text-[#00f0ff]/80 border border-[#00f0ff]/20 hover:bg-[#00f0ff] hover:text-black transition-all cursor-default font-mono">
                                {skill}
                             </span>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* 4. Stats */}
             <div className="md:col-span-4 grid grid-cols-2 gap-4">
                <div className="bg-black border border-white/10 p-4 flex flex-col justify-center hover:bg-[#00f0ff]/5 transition-colors">
                   <div className="text-3xl font-heading font-bold text-white">05+</div>
                   <div className="text-[10px] font-mono text-gray-400 uppercase mt-1">{t.about.stats.exp}</div>
                </div>
                <div className="bg-black border border-white/10 p-4 flex flex-col justify-center hover:bg-[#00f0ff]/5 transition-colors">
                   <div className="text-3xl font-heading font-bold text-[#00f0ff]">32</div>
                   <div className="text-[10px] font-mono text-gray-400 uppercase mt-1">{t.about.stats.projects}</div>
                </div>
             </div>

             {/* 5. Location */}
             <div className="md:col-span-8 p-6 bg-black border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                      <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">{t.about.locationTitle}</div>
                      <div className="text-lg font-bold text-white tracking-wide">{t.about.location}</div>
                   </div>
                </div>
                <div className="hidden md:block text-[#00f0ff] font-mono text-xs animate-pulse">
                   GPS_SIGNAL: STRONG
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* WHAT I DO SECTION (Updated Services) */}
      <section id="services" className="relative z-10 py-20 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-7xl font-heading font-bold text-white mb-4">
               {t.services.title}
             </h2>
             <div className="flex items-center justify-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-6">
               <Minus className="w-4 h-4" /> {t.services.subtitle} <Minus className="w-4 h-4" />
             </div>
          </div>
          
          {/* 3D Cyberpunk Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
            {t.services.items.map((service, i) => {
              const isSent = contactFormStatus === 'sent';
              const isSending = contactFormStatus === 'sending';

              return (
                <div
                  key={i}
                  className="group relative bg-[#050505] border border-[#00f0ff]/30 p-8 min-h-[420px] flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[4px_4px_0px_0px_#00f0ff]"
                  data-hover="true"
                >
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] transition-all duration-300 group-hover:w-8 group-hover:h-8" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff] transition-all duration-300 group-hover:w-8 group-hover:h-8" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff] transition-all duration-300 group-hover:w-8 group-hover:h-8" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff] transition-all duration-300 group-hover:w-8 group-hover:h-8" />

                  {/* Tech Grid Background Hover Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                     {/* Header */}
                     <div className="flex justify-between items-start mb-8">
                       <div className="p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-sm group-hover:bg-[#00f0ff] transition-colors duration-300">
                         {getIcon(service.icon)}
                       </div>
                       <div className="text-4xl font-black font-heading text-[#00f0ff]/10 group-hover:text-[#00f0ff]/20 transition-colors select-none">
                         0{i + 1}
                       </div>
                     </div>

                     <h3 className="text-2xl font-bold font-heading uppercase text-white mb-4 group-hover:text-[#00f0ff] transition-colors">
                       {service.title}
                     </h3>
                     
                     <p className="font-sans text-sm md:text-base leading-relaxed text-gray-400 mb-8 flex-1">
                       {service.desc}
                     </p>
                     
                     <button 
                       onClick={() => handleContactAction(i)}
                       disabled={isSending || isSent}
                       className={`w-full py-4 text-xs font-bold font-mono uppercase tracking-widest border border-white/20 transition-all duration-300 mt-auto
                         ${isSent 
                           ? 'bg-[#00f0ff] text-black border-[#00f0ff]' 
                           : 'text-white hover:bg-[#00f0ff] hover:text-black hover:border-[#00f0ff]'
                         }`}
                     >
                       {isSending ? t.services.button.sending : isSent ? t.services.button.sent : t.services.button.idle}
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
             <div className="font-heading text-2xl font-bold text-white mb-2">NOCTIS</div>
             <div className="text-[10px] font-mono text-gray-500 uppercase">
               SYSTEM_VERSION: 2.5.0 <br/> &copy; 2025 {t.footer.rights}
             </div>
          </div>
          
          <div className="flex gap-8">
            {['TWITTER', 'LINKEDIN', 'GITHUB'].map(social => (
               <a key={social} href="#" className="text-gray-500 hover:text-[#00f0ff] font-mono text-xs transition-colors cursor-pointer" data-hover="true">
                 {social}
               </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Project Detail Modal - Cyberpunk Style */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-black border border-[#00f0ff]/30 flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,240,255,0.1)] max-h-[90vh] overflow-y-auto md:overflow-hidden"
            >
              {/* Tech Decals */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00f0ff]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00f0ff]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00f0ff]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00f0ff]" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors border border-[#00f0ff]/50"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Side - FULL COLOR FIX */}
              <div className="w-full md:w-3/5 relative min-h-[300px] border-b md:border-b-0 md:border-r border-white/10">
                <img 
                  src={new URL(selectedProject.image, import.meta.env.BASE_URL).toString()} 
                  alt={selectedProject.title[language]} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Removed overlay div to ensure full brightness */}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-black relative">
                <div className="flex items-center gap-2 text-[#00f0ff] mb-6 font-mono text-xs uppercase tracking-widest">
                   <Terminal className="w-4 h-4" />
                   <span>Project_Log_0{selectedProject.id}</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-heading font-bold uppercase leading-none mb-2 text-white">
                  {selectedProject.title[language]}
                </h3>
                
                <p className="text-sm text-gray-400 font-mono uppercase mb-8">
                  {selectedProject.category[language]} // {selectedProject.year}
                </p>
                
                <div className="h-px w-full bg-white/10 mb-8" />
                
                <p className="text-gray-300 leading-relaxed text-base font-light mb-10">
                  {selectedProject.description[language]}
                </p>

                {/* Actions / Buttons */}
                <div className="flex flex-col gap-4 mt-auto">
                   <div className="grid grid-cols-2 gap-4">
                     {selectedProject.githubUrl && (
                       <a 
                         href={selectedProject.githubUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/20 hover:bg-[#00f0ff] hover:text-black hover:border-[#00f0ff] transition-all text-xs font-bold uppercase tracking-widest group"
                       >
                         <Github className="w-4 h-4" />
                         <span>Source_Code</span>
                       </a>
                     )}
                     {selectedProject.projectUrl && (
                        <a 
                          href={selectedProject.projectUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/20 hover:bg-[#00f0ff] hover:text-black hover:border-[#00f0ff] transition-all text-xs font-bold uppercase tracking-widest group"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Init_System</span>
                        </a>
                     )}
                   </div>

                   <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button 
                       onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
                       className="flex-1 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        Prev_Unit
                      </button>
                      <button 
                       onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
                       className="flex-1 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        Next_Unit
                      </button>
                   </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
