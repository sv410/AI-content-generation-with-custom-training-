import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useModels, useCreateModel } from "@/hooks/use-models";
import { Link } from "wouter";
import { Plus, Brain, Search, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Models() {
  const { data: models, isLoading } = useModels();
  const createMutation = useCreateModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    tone: "",
  });

  const filteredModels = models?.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", industry: "", tone: "" });
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">AI Models</h1>
          <p className="text-muted-foreground">Your custom trained intelligences.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black hover:bg-white/90 rounded-full px-6 h-12 shadow-lg shadow-white/10"
        >
          <Plus className="w-5 h-5 mr-2" /> New Model
        </Button>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card h-48 rounded-3xl animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : filteredModels && filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Link key={model.id} href={`/models/${model.id}`}>
              <div className="glass-card p-6 rounded-3xl h-full flex flex-col cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/5">
                    {model.industry}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{model.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                  {model.description}
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    {model.tone}
                  </span>
                  <span>{format(new Date(model.createdAt!), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No models found.</p>
        </div>
      )}

      {/* Create Model Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-[2rem] p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-display font-bold text-white mb-6">Create New AI Model</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Model Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g., Marketing Copywriter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="What does this model specialize in?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Industry</label>
                  <input 
                    required
                    type="text"
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g., SaaS, Retail"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Tone of Voice</label>
                  <input 
                    required
                    type="text"
                    value={formData.tone}
                    onChange={e => setFormData({...formData, tone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g., Professional, Witty"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all font-semibold"
                >
                  {createMutation.isPending ? "Creating..." : "Create Model"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
