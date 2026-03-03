import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Brain, Zap, Copy, Check } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function Generations() {
  // Since we don't have a global "get all generations" endpoint in the schema,
  // we will fetch models first, then ideally we'd fetch generations per model.
  // For UI completeness given the current contract, we'll fetch models and just show a message,
  // or fetch generations for the first few models.
  
  const { data: models } = useQuery({
    queryKey: [api.models.list.path],
    queryFn: async () => {
      const res = await fetch(api.models.list.path, { credentials: "include" });
      return api.models.list.responses[200].parse(await res.json());
    }
  });

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Recent Generations</h1>
        <p className="text-muted-foreground">Content generated across all your models.</p>
      </div>

      <div className="glass-panel rounded-3xl p-12 text-center border-dashed border-white/20">
        <Zap className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
        <h3 className="text-2xl font-display font-semibold text-white mb-2">Global Feed Coming Soon</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Currently, generations are scoped to individual models. Navigate to a specific model to view its generated content history.
        </p>
      </div>
    </AppLayout>
  );
}
