import { useQuery } from '@tanstack/react-query';
import { generateMessage } from '../api/message.api';
import { getReminder } from '../api/reminder.api';

export const useBorrowerMessage = (lendId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['message', lendId],
    queryFn: () => generateMessage(lendId!),
    enabled: Boolean(lendId) && enabled,
    staleTime: 0, // fresh on request
  });
};

export const useLenderReminder = (lendId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['reminder', lendId],
    queryFn: () => getReminder(lendId!),
    enabled: Boolean(lendId) && enabled,
    staleTime: 0,
  });
};
