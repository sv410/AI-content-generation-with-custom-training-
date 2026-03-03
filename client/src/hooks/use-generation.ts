import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useGeneratedContent(modelId: number) {
  return useQuery({
    queryKey: [api.generate.list.path, modelId],
    queryFn: async () => {
      const url = buildUrl(api.generate.list.path, { modelId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch generated content");
      return api.generate.list.responses[200].parse(await res.json());
    },
    enabled: !!modelId,
  });
}

export function useGenerateContent(modelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { prompt: string; contentType: string }) => {
      const url = buildUrl(api.generate.create.path, { modelId });
      const validated = api.generate.create.input.parse(data);
      
      const res = await fetch(url, {
        method: api.generate.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to generate content");
      return api.generate.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.generate.list.path, modelId] });
    },
  });
}
