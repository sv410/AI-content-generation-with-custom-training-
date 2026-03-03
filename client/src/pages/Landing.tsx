import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Zap, PenTool, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 border-b-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">Cerebro</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm font-medium text-cyan-400"
          >
            <Zap className="w-4 h-4" />
            Introducing Custom Model Training
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold text-gradient leading-[1.1] mb-8"
          >
            Train AI to sound <br />
            <span className="text-gradient-primary italic">exactly like you.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Stop settling for generic AI content. Upload your best work, fine-tune the tone, and generate blogs, posts, and copy that perfectly matches your brand's unique voice.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-[0_0_30px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(109,40,217,0.6)] hover:-translate-y-1 transition-all text-lg w-full sm:w-auto">
                Start Training Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full glass-card border-white/20 hover:bg-white/10 text-lg w-full sm:w-auto">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                title: "Industry-Specific Logic",
                desc: "Configure base models to understand the nuances, jargon, and logic of your specific vertical."
              },
              {
                icon: Brain,
                title: "Custom Data Training",
                desc: "Feed the AI your past successful content. It learns your sentence structure, vocabulary, and rhythm."
              },
              {
                icon: Globe,
                title: "Omnichannel Output",
                desc: "Generate perfectly formatted content for blogs, social media posts, or product descriptions instantly."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Showcase (Mock App UI) */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-[2.5rem] p-4 md:p-8 border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="rounded-2xl border border-white/5 bg-background/80 overflow-hidden">
              {/* Mock Topbar */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              {/* Mock Content */}
              <div className="p-8 flex gap-8">
                <div className="w-1/3 hidden md:block space-y-4">
                  <div className="h-8 w-2/3 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-primary/20 rounded-xl" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="h-10 w-1/3 bg-white/10 rounded-lg" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-[95%] bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-[80%] bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-white">Generated Output</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "We're thrilled to announce the next evolution in our platform..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
