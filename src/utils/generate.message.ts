import { generateMessageInputModel } from "../models/generate.message.model.js"
export const overdueReminderMessage = ( userData: generateMessageInputModel) =>{
    const { user, borrower, item, dueDate } = userData;

    const dueDateMessage = dueDate
    ? ` It was due on ${dueDate}.`
    : "";

    return `🔔 Reminder: Hi ${user}, ${borrower} has your "${item}".${dueDateMessage} You may want to remind them to return it.`;

}

export const dueSoonReminderMessage = (userData: generateMessageInputModel) =>{
    const { user, borrower, item, dueDate } = userData;

    const dueDateMessage = dueDate
    ? ` It is due on ${dueDate}.`
    : "";

    return `🔔 Reminder: Hi ${user}, ${borrower} has your "${item}".${dueDateMessage} You may want to remind them to return it.`;

}