import { AppLayout } from "@/components/layout/AppLayout";
import { useModels } from "@/hooks/use-models";
import { Link } from "wouter";
import { Brain, Plus, ArrowUpRight, Activity } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: models, isLoading } = useModels();

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Manage your custom AI models and generate new content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-1">
            {isLoading ? "-" : models?.length || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Active Models</p>
        </div>
        
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/20 blur-2xl rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-1">Ready</h3>
          <p className="text-sm text-muted-foreground">System Status</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-white">Your Models</h2>
        <Link href="/models">
          <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-48 rounded-3xl animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : models && models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.slice(0, 3).map((model) => (
            <Link key={model.id} href={`/models/${model.id}`}>
              <div className="glass-card p-6 rounded-3xl h-full flex flex-col cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {model.name}
                  </h3>
                  <div className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/70">
                    {model.industry}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                  {model.description}
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tone: {model.tone}</span>
                  <span>{format(new Date(model.createdAt!), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
          
          <Link href="/models">
            <div className="glass-card border-dashed border-2 border-white/20 p-6 rounded-3xl h-full flex flex-col items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Create New Model</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border-dashed border-white/20">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">No models yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first custom AI model to start generating content in your unique voice.
          </p>
          <Link href="/models">
            <button className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Create AI Model
            </button>
          </Link>
        </div>
      )}
    </AppLayout>
  );
}
