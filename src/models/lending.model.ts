import { LendingStatus } from "../generated/prisma/enums.js";

export interface lendingInputModel{
    itemId: string,
    borrowerId: string, 
    expectedReturnDate: Date,
    notes: string,
    status: LendingStatus
}