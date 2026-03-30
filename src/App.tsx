/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Globe, 
  Database, 
  Cloud, 
  Link as LinkIcon,
  GraduationCap,
  Award,
  ChevronRight,
  Send,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import Navbar from './components/Navbar';
import BackgroundEffect from './components/BackgroundEffect';
import TypingAnimation from './components/TypingAnimation';
import Hero3D from './components/Hero3D';

const skills = [
  { name: 'C', icon: <Code2 className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
  { name: 'C++', icon: <Code2 className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
  { name: 'AI/ML', icon: <Cpu className="w-6 h-6" />, color: 'from-purple-400 to-pink-600' },
  { name: 'HTML', icon: <Globe className="w-6 h-6" />, color: 'from-orange-400 to-red-600' },
  { name: 'CSS', icon: <Globe className="w-6 h-6" />, color: 'from-blue-400 to-cyan-600' },
  { name: 'JavaScript', icon: <Globe className="w-6 h-6" />, color: 'from-yellow-400 to-orange-500' },
  { name: 'SQL', icon: <Database className="w-6 h-6" />, color: 'from-indigo-400 to-blue-600' },
  { name: 'Cloud Computing', icon: <Cloud className="w-6 h-6" />, color: 'from-cyan-400 to-blue-500' },
  { name: 'Blockchain', icon: <LinkIcon className="w-6 h-6" />, color: 'from-emerald-400 to-teal-600' },
];

const projects = [
  {
    title: 'Interactive Recipe Finder',
    description: 'A cutting-edge web application leveraging real-time data to help users discover culinary inspirations based on available ingredients.',
    tech: ['React', 'Tailwind', 'API Integration', 'Motion'],
    link: '#',
    github: 'https://github.com/Ajendradw',
    image: 'https://picsum.photos/seed/recipe-wow/800/600'
  },
];

const education = [
  {
    degree: 'B.Tech (Pursuing)',
    institution: 'Sagar Institute of Science, Bhopal',
    period: 'Present',
    description: 'Specializing in Computer Science with a focus on Cyber Security.'
  },
  {
    degree: 'Class 12th',
    institution: 'Vidhya Bharti School, Bhopal',
    period: '84%',
    description: 'Core Science stream with Mathematics.'
  },
  {
    degree: 'Class 10th',
    institution: 'Vidhya Bharti School, Bhopal',
    period: '95.5%',
    description: 'Distinction in all subjects.'
  },
];

const certifications = [
  { name: 'Python Essentials', provider: 'Cisco Networking Academy' },
  { name: 'CCNA', provider: 'Cisco' },
  { name: 'Introduction to Cyber Security', provider: 'Cisco' },
  { name: 'Salesforce', provider: 'Trailhead' },
];

// Animation 2: Magnetic Button/Icon
function MagneticElement({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={!disabled ? { x: springX, y: springY } : {}}
    >
      {children}
    </motion.div>
  );
}

// Animation 4: 3D Tilt Card
function TiltCard({ children, className, disabled = false }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={!disabled ? { rotateX, rotateY, perspective: 1000 } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Animation 1: 3D Floating Profile Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cursorX = useSpring(useMotionValue(0), { stiffness: 500, damping: 28 });
  const cursorY = useSpring(useMotionValue(0), { stiffness: 500, damping: 28 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const moveCursor = (e: MouseEvent) => {
      if (!isMobile) {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen selection:bg-primary/30 selection:text-white bg-mesh animate-gradient-x ${isMobile ? 'cursor-auto' : 'cursor-none'}`}
    >
      {/* Scanning Line Effect */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          />
        </div>
      )}

      {/* Custom Cursor */}
      {!isMobile && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 border-2 border-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          />
          <motion.div
            className="fixed top-0 left-0 w-2 h-2 bg-secondary rounded-full pointer-events-none z-[9999]"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          />
        </>
      )}

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[10000] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <BackgroundEffect />
      <Navbar />

      <main className="overflow-hidden">
        {/* Hero Section - 3D & Picture Focus */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: isMobile ? 90 : 75 }}>
              <Suspense fallback={null}>
                <ScrollControls pages={isMobile ? 2 : 3} damping={0.1}>
                  <Hero3D />
                </ScrollControls>
              </Suspense>
            </Canvas>
          </div>

          <div className="max-w-7xl w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 p-3 glass w-fit rounded-full mx-auto lg:mx-0"
              >
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-300">Cyber Security Enthusiast</span>
                </div>
              </motion.div>

              {/* Animation 3: Text Reveal */}
              <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-9xl font-display uppercase leading-[0.85] mb-6 tracking-tighter group cursor-default"
              >
                <motion.span 
                  whileHover={!isMobile ? { skewX: -10, x: 10 } : {}}
                  className="inline-block transition-all duration-300"
                >
                  Ajendra
                </motion.span> <br />
                <span className="text-gradient text-glow relative inline-block">
                  Dwivedi
                  {!isMobile && (
                    <>
                      <motion.span 
                        className="absolute inset-0 text-primary opacity-0 group-hover:opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-100 -z-10"
                        aria-hidden="true"
                      >
                        Dwivedi
                      </motion.span>
                      <motion.span 
                        className="absolute inset-0 text-accent opacity-0 group-hover:opacity-50 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-100 -z-10"
                        aria-hidden="true"
                      >
                        Dwivedi
                      </motion.span>
                    </>
                  )}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-lg md:text-2xl lg:text-3xl font-heading font-light text-slate-400 mb-10 lg:mb-12 tracking-wide"
              >
                <TypingAnimation 
                  texts={['Computer Science Student', 'Cyber Security Enthusiast', 'Full Stack Developer']} 
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6"
              >
                <MagneticElement disabled={isMobile}>
                  <motion.a
                    href="#contact"
                    whileHover={!isMobile ? { scale: 1.05, boxShadow: "0 0 20px rgba(0, 242, 255, 0.4)" } : {}}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 lg:px-10 py-3 lg:py-4 bg-primary text-black font-bold rounded-full transition-all inline-block text-sm lg:text-base"
                  >
                    Hire Me
                  </motion.a>
                </MagneticElement>
                <MagneticElement disabled={isMobile}>
                  <motion.a
                    href="#projects"
                    whileHover={!isMobile ? { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" } : {}}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 lg:px-10 py-3 lg:py-4 glass text-white font-bold rounded-full transition-all inline-block text-sm lg:text-base"
                  >
                    View Portfolio
                  </motion.a>
                </MagneticElement>
              </motion.div>
            </motion.div>

            {/* Animation 1: 3D Floating Profile Picture with Glitch Effect */}
            <motion.div
              style={{ rotateX, rotateY, perspective: 1000, opacity: heroOpacity, scale: heroScale }}
              className="relative group block"
            >
              <div className="relative aspect-[4/5] glass rounded-[30px] lg:rounded-[40px] overflow-hidden p-3 lg:p-4 shadow-2xl shadow-primary/10 border border-white/10 max-w-[320px] lg:max-w-none mx-auto">
                <div className="absolute inset-0 z-10 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <motion.div 
                  className="w-full h-full relative"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="/ajendra.jpg" 
                    alt="Ajendra Dwivedi" 
                    className="w-full h-full object-cover rounded-[20px] lg:rounded-[30px] grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glitch Overlay Effect */}
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  )}
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-10 group-hover:translate-y-0 z-20">
                  <h3 className="text-2xl lg:text-4xl font-display uppercase text-white mb-1 lg:mb-2">Ajendra Dwivedi</h3>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className="w-6 lg:w-8 h-[1px] bg-primary" />
                    <p className="text-primary font-bold tracking-widest uppercase text-[10px] lg:text-sm">Cyber Security Specialist</p>
                  </div>
                </div>
              </div>
              
              {/* Floating 3D Elements with Parallax */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 lg:-top-12 lg:-right-12 glass p-4 lg:p-8 rounded-2xl lg:rounded-3xl z-20 shadow-2xl border border-primary/20 backdrop-blur-xl"
              >
                <ShieldCheck className="w-6 h-6 lg:w-12 lg:h-12 text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 lg:-bottom-12 lg:-left-12 glass p-4 lg:p-8 rounded-2xl lg:rounded-3xl z-20 shadow-2xl border border-secondary/20 backdrop-blur-xl"
              >
                <Terminal className="w-6 h-6 lg:w-12 lg:h-12 text-secondary drop-shadow-[0_0_10px_rgba(112,0,255,0.5)]" />
              </motion.div>

              {/* Decorative Glow */}
              <div className="absolute -inset-10 bg-primary/10 blur-[120px] -z-10 group-hover:bg-primary/20 transition-colors duration-700" />
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Scroll</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
            />
          </motion.div>
        </section>

        {/* About Section - Editorial Layout */}
        <section id="about" className="py-20 lg:py-40 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : -100, y: isMobile ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute -top-20 lg:-top-40 -left-20 lg:-left-40 w-[300px] lg:[500px] h-[300px] lg:[500px] bg-primary/5 blur-[100px] lg:blur-[150px] -z-10 animate-pulse" />
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-primary font-mono text-[10px] lg:text-xs uppercase tracking-[0.5em] mb-8 lg:mb-12 block"
                >
                  01 // Biography
                </motion.span>
                <h2 className="text-4xl md:text-6xl lg:text-9xl font-display uppercase leading-[0.85] mb-10 lg:mb-16 tracking-tighter">
                  The <span className="italic-serif text-slate-500">Mind</span> <br />
                  Behind The <span className="text-primary text-glow">Code</span>
                </h2>
                <div className="space-y-6 lg:space-y-10 text-lg lg:text-2xl text-slate-400 leading-relaxed font-light max-w-xl">
                  <p>
                    I am a Computer Science student specializing in <span className="text-white font-bold">Cyber Security</span> with a strong foundation in core engineering principles.
                  </p>
                  <p>
                    Passionate about building <span className="text-white font-bold">secure and scalable</span> applications and continuously learning emerging technologies.
                  </p>
                </div>
                
                <div className="mt-12 lg:mt-20 grid grid-cols-2 gap-8 lg:gap-12 border-t border-white/10 pt-8 lg:pt-12">
                  <motion.div whileHover={!isMobile ? { y: -5 } : {}}>
                    <div className="text-3xl lg:text-5xl font-display text-white mb-1 lg:mb-2">95.5%</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Class 10th Score</div>
                  </motion.div>
                  <motion.div whileHover={!isMobile ? { y: -5 } : {}}>
                    <div className="text-3xl lg:text-5xl font-display text-white mb-1 lg:mb-2">84%</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Class 12th Score</div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative group"
              >
                <div className="absolute inset-0 glass rounded-[60px] rotate-6 -z-10 group-hover:rotate-3 transition-transform duration-700" />
                <div className="absolute inset-0 border border-primary/20 rounded-[60px] -rotate-6 -z-10 group-hover:-rotate-3 transition-transform duration-700" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[60px] glass p-4">
                  <img
                    src="/ajendra.jpg"
                    alt="Ajendra Dwivedi"
                    className="w-full h-full object-cover rounded-[40px] grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                {/* Floating Badge */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-12 -right-12 w-48 h-48 glass rounded-full flex items-center justify-center p-10 text-center border border-white/10 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary absolute" />
                    <svg className="w-full h-full absolute animate-spin-slow" viewBox="0 0 100 100">
                      <defs>
                        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                      </defs>
                      <text className="text-[8px] uppercase tracking-[0.2em] fill-primary font-bold">
                        <textPath xlinkHref="#circlePath">
                          Security • Innovation • Excellence •
                        </textPath>
                      </text>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills - Bento Grid Style */}
        <section id="skills" className="py-20 lg:py-40 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-6 translate-y-40 -z-10" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 lg:mb-24">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] lg:text-sm font-bold tracking-[0.4em] uppercase text-primary mb-4 lg:mb-6"
              >
                Expertise
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-8xl font-display uppercase text-glow"
              >
                Technical Arsenal
              </motion.h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <TiltCard className="h-full" disabled={isMobile}>
                    <div className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-[32px] flex flex-col items-center justify-center gap-4 lg:gap-6 group cursor-default h-full hover:border-primary/50 transition-colors">
                      <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/20 transition-all group-hover:scale-110`}>
                        {skill.icon}
                      </div>
                      <span className="text-xs lg:text-base font-heading font-bold text-slate-300 group-hover:text-white transition-colors text-center">{skill.name}</span>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects - Immersive Cards */}
        <section id="projects" className="py-20 lg:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 lg:mb-20 gap-6 lg:gap-8 text-center lg:text-left">
              <div>
                <h2 className="text-[10px] lg:text-sm font-bold tracking-[0.3em] uppercase text-primary mb-3 lg:mb-4">Portfolio</h2>
                <h3 className="text-4xl lg:text-5xl font-display uppercase">Selected Works</h3>
              </div>
              <p className="text-sm lg:text-base text-slate-400 max-w-md">
                A collection of projects that demonstrate my ability to bridge the gap between complex engineering and user-centric design.
              </p>
            </div>

            <div className="grid gap-16 lg:gap-20">
              {projects.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                    <TiltCard className="lg:col-span-7 relative group/card" disabled={isMobile}>
                      <div className="aspect-video glass rounded-2xl lg:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 lg:opacity-60 group-hover:opacity-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent ${isMobile ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 lg:p-12`}>
                          <div className="flex gap-4 lg:gap-6">
                            <motion.a 
                              href={project.link}
                              whileHover={!isMobile ? { scale: 1.1 } : {}}
                              whileTap={{ scale: 0.9 }}
                              className="px-6 lg:px-8 py-2 lg:py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] lg:text-xs rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                            >
                              Live Demo
                            </motion.a>
                            <motion.a 
                              href={project.github}
                              whileHover={!isMobile ? { scale: 1.1 } : {}}
                              whileTap={{ scale: 0.9 }}
                              className="px-6 lg:px-8 py-2 lg:py-3 bg-white/10 backdrop-blur-xl text-white font-black uppercase tracking-widest text-[10px] lg:text-xs rounded-full border border-white/20"
                            >
                              Source Code
                            </motion.a>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -inset-10 bg-gradient-to-br from-primary/30 to-secondary/30 blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </TiltCard>

                  <div className="lg:col-span-5 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-primary mb-4 lg:mb-6">
                      <Layers className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">Web Application</span>
                    </div>
                    <h4 className="text-3xl lg:text-6xl font-display uppercase mb-4 lg:mb-6 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-base lg:text-xl text-slate-400 mb-6 lg:mb-8 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-3 mb-8 lg:mb-10">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 lg:px-4 py-1.5 lg:py-2 glass rounded-full text-[10px] lg:text-xs font-bold text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Certs */}
        <section id="education" className="py-20 lg:py-32 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              {/* Education */}
              <div>
                <h2 className="text-[10px] lg:text-sm font-bold tracking-[0.3em] uppercase text-primary mb-8 lg:mb-12">Academic Path</h2>
                <div className="space-y-8 lg:space-y-12">
                  {education.map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-8 lg:pl-12 group"
                    >
                      <div className="absolute left-0 top-0 w-[1px] lg:w-1 h-full bg-slate-800 group-hover:bg-primary transition-colors" />
                      <div className="absolute left-[-4px] lg:left-[-4px] top-0 w-2 h-2 lg:w-3 lg:h-3 bg-slate-900 border-2 border-primary rounded-full group-hover:scale-150 transition-transform" />
                      <span className="text-[10px] lg:text-xs font-mono text-primary mb-2 block">{edu.period}</span>
                      <h3 className="text-xl lg:text-2xl font-display uppercase text-white mb-1 lg:mb-2">{edu.degree}</h3>
                      <p className="text-base lg:text-lg text-slate-300 mb-1 lg:mb-2">{edu.institution}</p>
                      <p className="text-xs lg:text-sm text-slate-500">{edu.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-[10px] lg:text-sm font-bold tracking-[0.3em] uppercase text-secondary mb-8 lg:mb-12">Credentials</h2>
                <div className="grid gap-3 lg:gap-4">
                  {certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={!isMobile ? { x: 10, backgroundColor: "rgba(255, 255, 255, 0.05)" } : {}}
                      className="glass p-4 lg:p-6 rounded-xl lg:rounded-2xl flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                          <Award size={isMobile ? 18 : 24} />
                        </div>
                        <div>
                          <h4 className="text-sm lg:text-base font-bold text-white">{cert.name}</h4>
                          <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-widest">{cert.provider}</p>
                        </div>
                      </div>
                      <ChevronRight size={isMobile ? 16 : 24} className="text-slate-700 group-hover:text-secondary transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-40 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 -z-10" />
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-[30px] lg:rounded-[60px] overflow-hidden relative border border-white/10">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 blur-[150px] -z-10" />
              
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-24">
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-primary font-mono text-[10px] lg:text-xs uppercase tracking-[0.5em] mb-8 lg:mb-12 block"
                  >
                    04 // Connection
                  </motion.span>
                  <h3 className="text-4xl md:text-6xl lg:text-8xl font-display uppercase mb-8 lg:mb-12 leading-[0.9] tracking-tighter">
                    Let's Build <br />
                    Something <br />
                    <span className="text-gradient text-glow">Epic</span>
                  </h3>
                  
                  <div className="space-y-8 lg:space-y-12 mt-12 lg:mt-16">
                    <motion.div whileHover={!isMobile ? { x: 10 } : {}} className="group">
                      <a href="mailto:dwivediajendra1@gmail.com" className="flex items-center gap-4 lg:gap-8">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 glass rounded-xl lg:rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                          <Mail size={isMobile ? 20 : 32} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Email Me</p>
                          <span className="text-sm lg:text-2xl font-display text-white group-hover:text-primary transition-colors truncate block">dwivediajendra1@gmail.com</span>
                        </div>
                      </a>
                    </motion.div>
                    <motion.div whileHover={!isMobile ? { x: 10 } : {}} className="group">
                      <div className="flex items-center gap-4 lg:gap-8">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 glass rounded-xl lg:rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-[0_0_20px_rgba(112,0,255,0.2)]">
                          <Phone size={isMobile ? 20 : 32} />
                        </div>
                        <div>
                          <p className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Call Me</p>
                          <span className="text-sm lg:text-2xl font-display text-white group-hover:text-secondary transition-colors">930297473</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 md:p-12 lg:p-24 bg-white/[0.01] border-t lg:border-t-0 lg:border-l border-white/5 relative">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <form className="space-y-8 lg:space-y-10" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                      <div className="space-y-2 lg:space-y-3">
                        <label className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold ml-2">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-b border-slate-800 py-2 lg:py-4 focus:outline-none focus:border-primary transition-all text-white text-base lg:text-xl placeholder:text-slate-700" 
                          placeholder="Ajendra Dwivedi" 
                        />
                      </div>
                      <div className="space-y-2 lg:space-y-3">
                        <label className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold ml-2">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full bg-transparent border-b border-slate-800 py-2 lg:py-4 focus:outline-none focus:border-primary transition-all text-white text-base lg:text-xl placeholder:text-slate-700" 
                          placeholder="ajendra@example.com" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 lg:space-y-3">
                      <label className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold ml-2">Your Message</label>
                      <textarea 
                        rows={isMobile ? 3 : 4} 
                        className="w-full bg-transparent border-b border-slate-800 py-2 lg:py-4 focus:outline-none focus:border-primary transition-all text-white text-base lg:text-xl resize-none placeholder:text-slate-700" 
                        placeholder="Tell me about your vision..."
                      ></textarea>
                    </div>
                    <MagneticElement disabled={isMobile}>
                      <motion.button 
                        whileHover={!isMobile ? { scale: 1.02, boxShadow: "0 0 40px rgba(0, 242, 255, 0.4)" } : {}}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 lg:py-6 bg-white text-black font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] rounded-xl lg:rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 lg:gap-4 group shadow-2xl text-xs lg:text-base"
                      >
                        Send Message 
                        <Send size={isMobile ? 16 : 24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                      </motion.button>
                    </MagneticElement>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 lg:py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          <div className="text-center lg:text-left">
            <h4 className="text-3xl lg:text-4xl font-display uppercase mb-2">Ajendra Dwivedi</h4>
            <p className="text-slate-500 font-mono text-[10px] lg:text-sm">© 2026 — All Rights Reserved</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
            <MagneticElement disabled={isMobile}>
              <a href="https://github.com/Ajendradw" className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">GitHub</a>
            </MagneticElement>
            <MagneticElement disabled={isMobile}>
              <a href="https://www.linkedin.com/in/ajendra-dwivedi-7697a0325/" className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-secondary transition-colors">LinkedIn</a>
            </MagneticElement>
            <MagneticElement disabled={isMobile}>
              <a href="mailto:dwivediajendra1@gmail.com" className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">Email</a>
            </MagneticElement>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
