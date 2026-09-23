import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllBorrowers,
  getBorrowerById,
  createBorrower,
  deleteBorrower,
} from '../api/borrowers.api';
import type { CreateBorrowerInput } from '../types/borrower.types';

export const BORROWER_KEYS = {
  all: ['borrowers'] as const,
  lists: () => [...BORROWER_KEYS.all, 'list'] as const,
  details: () => [...BORROWER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BORROWER_KEYS.details(), id] as const,
};

export const useBorrowers = () => {
  return useQuery({
    queryKey: BORROWER_KEYS.lists(),
    queryFn: () => getAllBorrowers(),
  });
};

export const useBorrower = (id?: string) => {
  return useQuery({
    queryKey: BORROWER_KEYS.detail(id || ''),
    queryFn: () => getBorrowerById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateBorrower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBorrowerInput) => createBorrower(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BORROWER_KEYS.all });
    },
  });
};

export const useDeleteBorrower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBorrower(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BORROWER_KEYS.all });
    },
  });
};
