import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLendingHistory,
  lendItem,
  returnItem,
  trackDueDate,
} from '../api/lending.api';
import { ITEM_KEYS } from './useItems';
import type { LendItemInput } from '../types/lending.types';

export const LENDING_KEYS = {
  all: ['lending'] as const,
  history: () => [...LENDING_KEYS.all, 'history'] as const,
};

export const useLendingHistory = () => {
  return useQuery({
    queryKey: LENDING_KEYS.history(),
    queryFn: () => getLendingHistory(),
  });
};

export const useLendItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LendItemInput) => lendItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENDING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all });
    },
  });
};

export const useReturnItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => returnItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENDING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all });
    },
  });
};

export const useTrackDueDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trackDueDate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENDING_KEYS.all });
    },
  });
};
