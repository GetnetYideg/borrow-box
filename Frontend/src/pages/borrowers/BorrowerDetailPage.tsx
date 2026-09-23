import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  ArrowUpRight,
  Phone,
  Mail,
  User,
  RotateCcw,
  MessageSquare,
  Package,
} from 'lucide-react';
import { useBorrower, useDeleteBorrower } from '../../hooks/useBorrowers';
import { useItems } from '../../hooks/useItems';
import { useLendingHistory, useReturnItem } from '../../hooks/useLending';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LendItemModal } from '../lending/LendItemModal';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { getLendingStatusConfig } from '../../utils/statusBadge';
import { ROUTES } from '../../constants/routes';
import type { LendingRecord } from '../../types/lending.types';
import type { Item } from '../../types/item.types';

export const BorrowerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: borrower, isLoading: isLoadingBorrower } = useBorrower(id);
  const { data: items = [] } = useItems();
  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const deleteMutation = useDeleteBorrower();
  const returnMutation = useReturnItem();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLendOpen, setIsLendOpen] = useState(false);
  const [recordToReturn, setRecordToReturn] = useState<LendingRecord | null>(null);
  const [reminderRecord, setReminderRecord] = useState<LendingRecord | null>(null);

  const itemsMap = new Map<string, Item>(items.map((i: Item) => [i.id, i]));

  // Loans for this borrower
  const borrowerLoans = history.filter((r) => r.borrowerId === id);
  const activeLoans = borrowerLoans.filter((r) => r.status !== 'RETURNED');

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate(ROUTES.BORROWERS);
    } catch (err) {
      console.error('Failed to delete borrower:', err);
    }
  };

  const handleConfirmReturn = async () => {
    if (!recordToReturn) return;
    try {
      await returnMutation.mutateAsync(recordToReturn.id);
      setRecordToReturn(null);
    } catch (err) {
      console.error('Failed to return item:', err);
    }
  };

  if (isLoadingBorrower) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (!borrower) {
    return (
      <EmptyState
        title="Borrower not found"
        description="The borrower you are looking for does not exist or may have been deleted."
        actionText="Back to Borrowers"
        onAction={() => navigate(ROUTES.BORROWERS)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.BORROWERS}
            className="p-2 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 hover:text-forest dark:hover:text-cream transition-colors"
            aria-label="Back to borrowers list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-moss dark:text-gold uppercase tracking-wider">
                Borrower Profile
              </span>
              <span className="text-forest/30 dark:text-cream/30">•</span>
              <span className="text-xs text-forest/60 dark:text-cream/60">
                Added {formatDate(borrower.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
              {borrower.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsLendOpen(true)}
            leftIcon={<ArrowUpRight className="w-4 h-4 text-forest" />}
            className="font-bold"
          >
            Lend Item
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Info Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader title="Contact Information" />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-cream-50 dark:bg-forest-900 border border-moss/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-moss" /> Phone Number
                </span>
                <p className="font-mono text-sm font-semibold text-forest dark:text-cream">
                  {borrower.phone || 'No phone recorded'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-cream-50 dark:bg-forest-900 border border-moss/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-moss" /> Gmail Address
                </span>
                <p className="text-sm font-semibold text-forest dark:text-cream">
                  {borrower.email || 'No email recorded'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60">
                Notes
              </label>
              <p className="mt-1 text-sm text-forest dark:text-cream leading-relaxed">
                {borrower.notes || 'No additional notes provided for this borrower.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loan Stats */}
        <Card>
          <CardHeader title="Loan Activity" />
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-moss/10 border border-moss/20 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-forest/70 dark:text-cream/70">
                  Currently Holding
                </span>
                <div className="text-2xl font-black text-forest dark:text-cream">
                  {activeLoans.length}
                </div>
              </div>
              <Package className="w-8 h-8 text-moss" />
            </div>

            <div className="p-4 rounded-xl bg-cream-100 dark:bg-forest-700/50 border border-moss/15 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-forest/70 dark:text-cream/70">
                  Total Borrowed
                </span>
                <div className="text-2xl font-black text-forest dark:text-cream">
                  {borrowerLoans.length}
                </div>
              </div>
              <RotateCcw className="w-8 h-8 text-forest/40 dark:text-cream/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lending History Table */}
      <Card>
        <CardHeader
          title="All Lending Records"
          subtitle={`History of items borrowed by ${borrower.name}`}
        />
        <CardContent className="p-0">
          {borrowerLoans.length === 0 ? (
            <div className="p-8 text-center text-xs text-forest/60 dark:text-cream/60">
              No items have been lent to this borrower yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Lent Date</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {borrowerLoans.map((rec) => {
                    const item = itemsMap.get(rec.itemId);
                    const statusConfig = getLendingStatusConfig(rec.status);
                    return (
                      <tr key={rec.id} className="hover:bg-cream-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-forest dark:text-cream">
                            {item?.name || 'Unknown Item'}
                          </div>
                          <div className="text-xs text-forest/60 dark:text-cream/60">
                            {item?.category || 'Item'}
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatDate(rec.lentAt)}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {formatDate(rec.expectedReturnDate)}
                          <span className="block text-xs text-forest/60 dark:text-cream/60">
                            {formatRelativeTime(rec.expectedReturnDate)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {rec.status !== 'RETURNED' && (
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip content="Generate Reminder">
                                <button
                                  onClick={() => setReminderRecord(rec)}
                                  className="p-1.5 rounded-lg text-moss dark:text-gold hover:bg-moss/10"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </Tooltip>

                              <Tooltip content="Mark as Returned">
                                <button
                                  onClick={() => setRecordToReturn(rec)}
                                  className="p-1.5 rounded-lg text-forest dark:text-cream hover:bg-moss/10"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <LendItemModal
        isOpen={isLendOpen}
        onClose={() => setIsLendOpen(false)}
        preSelectedBorrowerId={borrower.id}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Borrower"
        message={`Are you sure you want to delete "${borrower.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(recordToReturn)}
        onClose={() => setRecordToReturn(null)}
        onConfirm={handleConfirmReturn}
        title="Confirm Return"
        message={`Mark item as returned by ${borrower.name}?`}
        confirmText="Confirm Return"
        cancelText="Cancel"
        isLoading={returnMutation.isPending}
      />

      {reminderRecord && (
        <ReminderGeneratorModal
          isOpen={Boolean(reminderRecord)}
          onClose={() => setReminderRecord(null)}
          record={reminderRecord}
          item={itemsMap.get(reminderRecord.itemId)}
          borrower={borrower}
        />
      )}
    </div>
  );
};
