import { motion } from 'motion/react';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#030014]">
      {/* Primary Glow */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]" 
      />
      
      {/* Secondary Glow */}
      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[120px]" 
      />

      {/* Accent Glow */}
      <motion.div 
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" 
      />
      
      {/* Grid pattern with fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: [null, "-20px", "20px", null],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
}
