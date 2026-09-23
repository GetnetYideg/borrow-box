import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ArrowUpRight,
  Package,
  Calendar,
  Tag,
  Clock,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { useItem, useDeleteItem } from '../../hooks/useItems';
import { useBorrowers } from '../../hooks/useBorrowers';
import { useLendingHistory, useReturnItem } from '../../hooks/useLending';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ItemFormModal } from './ItemFormModal';
import { LendItemModal } from '../lending/LendItemModal';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { getItemStatusConfig, getLendingStatusConfig } from '../../utils/statusBadge';
import { getCategoryLabel } from '../../utils/categoryLabel';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { ROUTES } from '../../constants/routes';
import type { LendingRecord } from '../../types/lending.types';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: item, isLoading: isLoadingItem } = useItem(id);
  const { data: borrowers = [] } = useBorrowers();
  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const deleteMutation = useDeleteItem();
  const returnMutation = useReturnItem();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLendOpen, setIsLendOpen] = useState(false);
  const [recordToReturn, setRecordToReturn] = useState<LendingRecord | null>(null);
  const [reminderRecord, setReminderRecord] = useState<LendingRecord | null>(null);

  const borrowersMap = new Map(borrowers.map((b) => [b.id, b]));

  // Filter lending records for this item
  const itemLendingHistory = history.filter((r) => r.itemId === id);
  const activeLending = itemLendingHistory.find((r) => r.status !== 'RETURNED');

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate(ROUTES.ITEMS);
    } catch (err) {
      console.error('Failed to delete item:', err);
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

  if (isLoadingItem) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (!item) {
    return (
      <EmptyState
        title="Item not found"
        description="The item you requested does not exist or may have been deleted."
        actionText="Back to Items"
        onAction={() => navigate(ROUTES.ITEMS)}
      />
    );
  }

  const statusConfig = getItemStatusConfig(item.status);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top back navigation & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ITEMS}
            className="p-2 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 hover:text-forest dark:hover:text-cream transition-colors"
            aria-label="Back to items list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-moss dark:text-gold uppercase tracking-wider">
                {getCategoryLabel(item.category)}
              </span>
              <span className="text-forest/30 dark:text-cream/30">•</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                {statusConfig.label}
              </span>
            </div>
            <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
              {item.name}
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {item.status === 'AVAILABLE' ? (
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsLendOpen(true)}
              leftIcon={<ArrowUpRight className="w-4 h-4 text-forest" />}
              className="font-bold"
            >
              Lend Item
            </Button>
          ) : (
            activeLending && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRecordToReturn(activeLending)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Mark Returned
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            leftIcon={<Pencil className="w-3.5 h-3.5" />}
          >
            Edit
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

      {/* Item Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Info details */}
        <Card className="md:col-span-2">
          <CardHeader title="Item Information" />
          <CardContent className="space-y-4">
            {item.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-moss/5 border border-moss/10 mb-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60">
                Description
              </label>
              <p className="mt-1 text-sm text-forest dark:text-cream leading-relaxed">
                {item.description || 'No description provided for this item.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-moss/10 dark:border-forest-700">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60">
                  Tag / Serial Identifier
                </span>
                <p className="mt-0.5 font-mono text-sm text-forest dark:text-cream">
                  {item.identifier || '—'}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60">
                  Date Added
                </span>
                <p className="mt-0.5 text-sm text-forest dark:text-cream">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Current lending status box */}
        <Card>
          <CardHeader title="Current Status" />
          <CardContent className="space-y-4">
            {activeLending ? (
              <div className="p-4 rounded-xl bg-gold/15 border border-gold/30 space-y-3">
                <div className="flex items-center gap-2 text-gold-600 dark:text-gold font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Currently Lent Out
                </div>
                <div>
                  <span className="text-xs text-forest/70 dark:text-cream/70">
                    Borrower:
                  </span>
                  <div className="font-bold text-forest dark:text-cream">
                    {borrowersMap.get(activeLending.borrowerId)?.name || 'Unknown'}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-forest/70 dark:text-cream/70">
                    Expected Return:
                  </span>
                  <div className="font-bold text-forest dark:text-cream">
                    {formatDate(activeLending.expectedReturnDate)}
                  </div>
                  <span className="text-xs text-forest/60 dark:text-cream/60">
                    ({formatRelativeTime(activeLending.expectedReturnDate)})
                  </span>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setReminderRecord(activeLending)}
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                    className="w-full font-bold text-xs"
                  >
                    Generate Reminder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <Package className="w-4 h-4" />
                </div>
                <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  In Your Custody
                </div>
                <p className="text-xs text-forest/70 dark:text-cream/70">
                  This item is available to be lent to any registered borrower.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsLendOpen(true)}
                  className="w-full text-xs font-semibold"
                >
                  Lend Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lending History for this Item */}
      <Card>
        <CardHeader
          title="Lending History"
          subtitle={`Past and active loans for ${item.name}`}
        />
        <CardContent className="p-0">
          {itemLendingHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-forest/60 dark:text-cream/60">
              This item has not been lent out yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                  <tr>
                    <th className="py-3 px-4">Borrower</th>
                    <th className="py-3 px-4">Lent On</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Returned On</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {itemLendingHistory.map((rec) => {
                    const borrower = borrowersMap.get(rec.borrowerId);
                    const recStatusConfig = getLendingStatusConfig(rec.status);
                    return (
                      <tr key={rec.id} className="hover:bg-cream-50/50">
                        <td className="py-3 px-4 font-semibold text-forest dark:text-cream">
                          {borrower?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">{formatDate(rec.lentAt)}</td>
                        <td className="py-3 px-4">{formatDate(rec.expectedReturnDate)}</td>
                        <td className="py-3 px-4">{formatDate(rec.returnedAt)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${recStatusConfig.className}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${recStatusConfig.dotColor}`} />
                            {recStatusConfig.label}
                          </span>
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
      <ItemFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        itemToEdit={item}
      />

      <LendItemModal
        isOpen={isLendOpen}
        onClose={() => setIsLendOpen(false)}
        preSelectedItemId={item.id}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to permanently delete "${item.name}"?`}
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
        message={`Mark "${item.name}" as safely returned by ${borrowersMap.get(recordToReturn?.borrowerId || '')?.name || 'borrower'}?`}
        confirmText="Confirm Return"
        cancelText="Cancel"
        isLoading={returnMutation.isPending}
      />

      {reminderRecord && (
        <ReminderGeneratorModal
          isOpen={Boolean(reminderRecord)}
          onClose={() => setReminderRecord(null)}
          record={reminderRecord}
          item={item}
          borrower={borrowersMap.get(reminderRecord.borrowerId)}
        />
      )}
    </div>
  );
};
