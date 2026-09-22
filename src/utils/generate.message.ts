import { generateMessageInputModel } from "../models/generate.message.model.js"
export const overdueReminderMessage = ( userData: generateMessageInputModel) =>{
    const { user, borrower, item, dueDate } = userData;

    const dueDateMessage = dueDate
    ? ` It was due on ${dueDate.getDate()}.`
    : "";

    return `🔔 Reminder: Hi ${user}, ${borrower} has your "${item}".${dueDateMessage} You may want to remind them to return it.`;

}

export const dueSoonReminderMessage = (userData: generateMessageInputModel) =>{
    const { user, borrower, item, dueDate } = userData;

    const dueDateMessage = dueDate
    ? ` It is due on ${dueDate.getDate()}.`
    : "";

    return `🔔 Reminder: Hi ${user}, ${borrower} has your "${item}".${dueDateMessage} You may want to remind them to return it.`;

}

export const generateOverdueMessage = (userData: generateMessageInputModel) =>{
    const { borrower, item , dueDate } = userData;

    return `Hi ${borrower},
The item "${item}" you borrowed was due to be returned on ${dueDate.getDate()} and is now overdue.
Please return the item as soon as possible.

Thank you.`;
}

export const generateDuesoonMessage = (userData: generateMessageInputModel) =>{
    const { borrower, item, dueDate } = userData;

    return `Hi ${borrower},
This is a reminder that the item "${item}" you borrowed is due to be returned tomorrow (${dueDate.getDate()}).
Please make sure to return it on time.

Thank you.`;
}