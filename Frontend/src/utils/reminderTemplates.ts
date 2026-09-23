export type ReminderTone = 'friendly' | 'casual' | 'formal' | 'funny';

interface TemplateParams {
  borrowerName?: string;
  itemName?: string;
  dueDate?: string;
  isOverdue?: boolean;
}

export const generateReminderMessage = (
  tone: ReminderTone,
  { borrowerName = 'Friend', itemName = 'the item', dueDate, isOverdue = false }: TemplateParams
): string => {
  const dateStr = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'soon';

  if (isOverdue) {
    switch (tone) {
      case 'friendly':
        return `Hi ${borrowerName}! Hope you're doing well. Just a gentle reminder that ${itemName} was due back on ${dateStr}. Whenever you have a moment, I'd really appreciate getting it back. Thanks so much!`;
      case 'casual':
        return `Hey ${borrowerName}, quick heads up — looks like ${itemName} is past the return date (${dateStr}). Let me know when you're free so we can arrange the handover!`;
      case 'formal':
        return `Dear ${borrowerName},\n\nThis is a formal notification that the borrowed item, "${itemName}", was scheduled for return on ${dateStr} and is currently overdue. Please arrange for its return at your earliest convenience.\n\nThank you for your prompt attention to this matter.`;
      case 'funny':
        return `Knock knock, ${borrowerName}! Who's there? It's ${itemName}, wondering when it gets to come home! It was supposed to return by ${dateStr}. Don't worry, no late fees yet! 📦`;
    }
  }

  // Due soon or active
  switch (tone) {
    case 'friendly':
      return `Hi ${borrowerName}! Hope you're enjoying ${itemName}. Just a friendly heads up that it's scheduled to be returned on ${dateStr}. Let me know if that still works for you!`;
    case 'casual':
      return `Hey ${borrowerName}, just checking in on ${itemName} — reminder that the return date is ${dateStr}. Catch you soon!`;
    case 'formal':
      return `Dear ${borrowerName},\n\nThis is a courtesy reminder regarding "${itemName}", which is scheduled to be returned on ${dateStr}. Please let me know if any adjustment is needed.\n\nBest regards.`;
    case 'funny':
      return `Hey ${borrowerName}! ${itemName} asked me to remind you that your return date of ${dateStr} is coming up soon. Thanks for keeping it safe! 🌟`;
  }
};
