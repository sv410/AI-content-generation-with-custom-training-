import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTrainingData(modelId: number) {
  return useQuery({
    queryKey: [api.trainingData.list.path, modelId],
    queryFn: async () => {
      const url = buildUrl(api.trainingData.list.path, { modelId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch training data");
      return api.trainingData.list.responses[200].parse(await res.json());
    },
    enabled: !!modelId,
  });
}

export function useAddTrainingData(modelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const url = buildUrl(api.trainingData.add.path, { modelId });
      const validated = api.trainingData.add.input.parse({ content });
      
      const res = await fetch(url, {
        method: api.trainingData.add.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to add training data");
      return api.trainingData.add.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trainingData.list.path, modelId] });
    },
  });
}
