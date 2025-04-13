import FreelancerService from "@shared/api/freelancerService";
import type { SearchFreelancerQueryDto } from "@dto/freelancer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useSearchFreelancersAction = () => {
  const [queryParams, setQueryParams] = useState<
    SearchFreelancerQueryDto | undefined
  >(undefined);

  const { data, error } = useQuery({
    queryKey: [FreelancerService.keys.searchedFreelancers, queryParams],
    queryFn: () => FreelancerService.searchFreelancers(queryParams),
    enabled: true,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const searchFreelancers = async (searchQuery?: SearchFreelancerQueryDto) => {
    try {
      setQueryParams(searchQuery);
    } catch (err) {
      console.error("Error setting search params:", err);
    }
  };

  return { searchedFreelancers: data ?? [], searchFreelancers, error };
};

export const useFreelancerProfileAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [FreelancerService.keys.freelancerProfile, id],
    queryFn: () => FreelancerService.getFreelancerProfile(id),
  });

  return { freelancerProfile: data };
};

export const useFreelancerSalariesAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [FreelancerService.keys.freelancerSalaries, id],
    queryFn: () => FreelancerService.getFreelancerSalaries(id),
  });

  return { freelancerSalaries: data ?? [] };
};

export const useFavoriteFreelancerAction = (id: number) => {
  const queryClient = useQueryClient();
  const { data: isFavorite } = useQuery({
    queryKey: [FreelancerService.keys.isFavorite, id],
    queryFn: () => FreelancerService.isFavorite(id),
    retry: false,
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: () => FreelancerService.toggleFavorite(id),
    onError: (error: Error) => {
      console.error("切換收藏狀態失敗:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FreelancerService.keys.isFavorite, id],
      });
    },
  });

  return { isFavorite: isFavorite ?? false, toggleFavorite };
};
