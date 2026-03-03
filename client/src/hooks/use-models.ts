import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertAiModel } from "@shared/schema";

export function useModels() {
  return useQuery({
    queryKey: [api.models.list.path],
    queryFn: async () => {
      const res = await fetch(api.models.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch models");
      return api.models.list.responses[200].parse(await res.json());
    },
  });
}

export function useModel(id: number) {
  return useQuery({
    queryKey: [api.models.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.models.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch model");
      return api.models.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAiModel) => {
      const validated = api.models.create.input.parse(data);
      const res = await fetch(api.models.create.path, {
        method: api.models.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = api.models.create.responses[400].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Failed to create model");
      }
      return api.models.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.models.list.path] });
    },
  });
}
