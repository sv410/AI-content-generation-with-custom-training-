import { useState } from "react";
import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useModel } from "@/hooks/use-models";
import { useTrainingData, useAddTrainingData } from "@/hooks/use-training";
import { useGeneratedContent, useGenerateContent } from "@/hooks/use-generation";
import { Brain, ArrowLeft, FileText, Database, Sparkles, Plus, Loader2, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ModelDetail() {
  const { id } = useParams<{ id: string }>();
  const modelId = parseInt(id);
  
  const { data: model, isLoading: modelLoading } = useModel(modelId);
  const { data: trainingData, isLoading: trainingLoading } = useTrainingData(modelId);
  const { data: generatedContent, isLoading: generatedLoading } = useGeneratedContent(modelId);
  
  const addTrainingMutation = useAddTrainingData(modelId);
  const generateMutation = useGenerateContent(modelId);

  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'generate'>('overview');
  
  // Forms state
  const [trainingInput, setTrainingInput] = useState("");
  const [genPrompt, setGenPrompt] = useState("");
  const [genType, setGenType] = useState("post");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (modelLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!model) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Model not found</h2>
          <Link href="/models">
            <Button variant="outline" className="border-white/20 text-white">Back to Models</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingInput.trim()) return;
    addTrainingMutation.mutate(trainingInput, {
      onSuccess: () => setTrainingInput("")
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genPrompt.trim()) return;
    generateMutation.mutate({ prompt: genPrompt, contentType: genType }, {
      onSuccess: () => {
        setGenPrompt("");
        setActiveTab('overview'); // Switch back to see result or scroll down
      }
    });
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <Link href="/models" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Models
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{model.name}</h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-white/80">
                  Industry: {model.industry}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-white/80">
                  Tone: {model.tone}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-white/80">
                  Base: {model.baseModel}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setActiveTab('generate')}
            className="bg-white text-black hover:bg-white/90 rounded-full px-6 h-12 shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Generate Content
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'training', label: 'Training Data', icon: Database },
          { id: 'generate', label: 'Generate', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
              ${activeTab === tab.id 
                ? "border-primary text-white" 
                : "border-transparent text-muted-foreground hover:text-white hover:border-white/20"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-xl font-display font-semibold text-white mb-4">About this Model</h3>
              <p className="text-white/80 leading-relaxed text-lg">{model.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="text-white font-medium">{format(new Date(model.createdAt!), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Training Samples</p>
                  <p className="text-white font-medium text-2xl">{trainingData?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Generations</p>
                  <p className="text-white font-medium text-2xl">{generatedContent?.length || 0}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-display font-semibold text-white mb-6">Recent Output</h3>
              {generatedLoading ? (
                <div className="space-y-4">
                  <div className="h-32 glass-card animate-pulse rounded-2xl" />
                  <div className="h-32 glass-card animate-pulse rounded-2xl" />
                </div>
              ) : generatedContent && generatedContent.length > 0 ? (
                <div className="space-y-4">
                  {generatedContent.slice(0, 5).map(item => (
                    <div key={item.id} className="glass-card p-6 rounded-2xl group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/60 border border-white/5 uppercase tracking-wider">
                            {item.contentType.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.createdAt!), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(item.outputContent, item.id)}
                          className="text-muted-foreground hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm font-medium text-white mb-2 line-clamp-1">Prompt: {item.prompt}</p>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                        {item.outputContent}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl text-center">
                  <p className="text-muted-foreground mb-4">No content generated yet.</p>
                  <Button onClick={() => setActiveTab('generate')} variant="outline" className="border-white/20 text-white">
                    Create your first piece
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TRAINING DATA TAB */}
        {activeTab === 'training' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl sticky top-24">
                <h3 className="text-xl font-display font-semibold text-white mb-2">Feed the AI</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Paste examples of content that perfectly matches the voice and style you want this model to learn.
                </p>
                <form onSubmit={handleAddTraining}>
                  <textarea
                    required
                    value={trainingInput}
                    onChange={e => setTrainingInput(e.target.value)}
                    placeholder="Paste an article, email, or social post here..."
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none mb-4"
                  />
                  <Button 
                    type="submit" 
                    disabled={addTrainingMutation.isPending}
                    className="w-full bg-white text-black hover:bg-white/90 font-medium h-11"
                  >
                    {addTrainingMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add to Knowledge Base
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Current Knowledge Base</h3>
              {trainingLoading ? (
                 <div className="h-32 glass-card animate-pulse rounded-2xl" />
              ) : trainingData && trainingData.length > 0 ? (
                trainingData.map(data => (
                  <div key={data.id} className="glass-card p-6 rounded-2xl">
                    <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed line-clamp-4">
                      {data.content}
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-muted-foreground text-right">
                      Added {format(new Date(data.createdAt!), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed border-white/20 rounded-2xl text-center text-muted-foreground">
                  Your knowledge base is empty. Add samples to start training.
                </div>
              )}
            </div>
          </div>
        )}

        {/* GENERATE TAB */}
        {activeTab === 'generate' && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
              
              <h2 className="text-3xl font-display font-bold text-white mb-2">Create Content</h2>
              <p className="text-muted-foreground mb-8">Harness your trained model to write perfectly tailored copy.</p>
              
              <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">What should we write about?</label>
                  <textarea
                    required
                    value={genPrompt}
                    onChange={e => setGenPrompt(e.target.value)}
                    placeholder="e.g., A launch announcement for our new AI feature..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'post', label: 'Social Post' },
                      { id: 'blog', label: 'Blog Article' },
                      { id: 'product_description', label: 'Product Desc' },
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setGenType(type.id)}
                        className={`
                          py-3 px-4 rounded-xl text-sm font-medium transition-all border
                          ${genType === type.id 
                            ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(109,40,217,0.3)]" 
                            : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5 hover:border-white/20"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={generateMutation.isPending}
                    className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white shadow-[0_0_30px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all font-bold group"
                  >
                    {generateMutation.isPending ? (
                      <span className="flex items-center"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating Magic...</span>
                    ) : (
                      <span className="flex items-center"><Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" /> Generate Content</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
