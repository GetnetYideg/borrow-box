import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllItems,
  filterItemsByCategory,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../api/items.api';
import type { Category } from '../constants/categories';
import type { Item, CreateItemInput, UpdateItemInput } from '../types/item.types';

export const ITEM_KEYS = {
  all: ['items'] as const,
  lists: () => [...ITEM_KEYS.all, 'list'] as const,
  list: (category?: Category) => [...ITEM_KEYS.lists(), { category }] as const,
  details: () => [...ITEM_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ITEM_KEYS.details(), id] as const,
};

export const useItems = (category?: Category) => {
  return useQuery<Item[]>({
    queryKey: ITEM_KEYS.list(category),
    queryFn: () => (category ? filterItemsByCategory(category) : getAllItems()),
  });
};

export const useItem = (id?: string) => {
  return useQuery({
    queryKey: ITEM_KEYS.detail(id || ''),
    queryFn: () => getItemById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemInput }) =>
      updateItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.detail(id) });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all });
    },
  });
};
