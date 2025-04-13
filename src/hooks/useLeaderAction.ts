import type { SearchedServiceCompanyDto } from "@dto/serviceCompany";

import { useState } from "react";

export const useLeaderFavoriteAction = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const storedIds = localStorage.getItem("favoriteLeaders");
    return storedIds ? JSON.parse(storedIds) : [];
  });

  const toggleFavorite = (leader: SearchedServiceCompanyDto) => {
    setFavoriteIds((prev) => {
      const isInFavorites = prev.includes(leader.id);
      const newFavorites = isInFavorites
        ? prev.filter((id) => id !== leader.id)
        : [...prev, leader.id];

      localStorage.setItem("favoriteLeaders", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => favoriteIds.includes(id);

  return { favoriteIds, toggleFavorite, isFavorite };
};
