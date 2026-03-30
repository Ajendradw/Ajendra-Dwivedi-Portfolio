import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

function MagneticLink({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.5);
    y.set((e.clientY - centerY) * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
    >
      <span className="relative z-10">{children}</span>
      <motion.span 
        className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-0"
      />
    </motion.a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex justify-between items-center px-8 py-4 rounded-full transition-all duration-500 ${
          scrolled ? 'glass border-white/10 shadow-[0_0_30px_rgba(0,242,255,0.1)]' : 'bg-transparent'
        }`}>
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl group-hover:rotate-12 transition-transform">
              A
            </div>
            <span className="text-2xl font-display uppercase tracking-tighter text-white">
              jendra<span className="text-primary">.</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <MagneticLink href={link.href}>{link.name}</MagneticLink>
              </motion.div>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-primary transition-colors"
            >
              Let's Talk
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-10 h-10 glass rounded-xl flex items-center justify-center text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 md:hidden glass rounded-[32px] overflow-hidden border border-white/10"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-display uppercase text-white hover:text-primary transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
