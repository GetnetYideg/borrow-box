import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Repeat,
  Clock,
  AlertTriangle,
  RotateCcw,
  Plus,
  ArrowUpRight,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useItems } from '../../hooks/useItems';
import { useBorrowers } from '../../hooks/useBorrowers';
import { useLendingHistory, useReturnItem } from '../../hooks/useLending';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ItemFormModal } from '../items/ItemFormModal';
import { BorrowerFormModal } from '../borrowers/BorrowerFormModal';
import { LendItemModal } from '../lending/LendItemModal';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { getLendingStatusConfig } from '../../utils/statusBadge';
import { ROUTES } from '../../constants/routes';
import type { LendingRecord } from '../../types/lending.types';
import type { Item } from '../../types/item.types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  const { data: borrowers = [], isLoading: isLoadingBorrowers } = useBorrowers();
  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const returnMutation = useReturnItem();

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddBorrowerOpen, setIsAddBorrowerOpen] = useState(false);
  const [isLendOpen, setIsLendOpen] = useState(false);

  // Return confirmation state
  const [recordToReturn, setRecordToReturn] = useState<LendingRecord | null>(null);

  // Reminder generator state
  const [reminderRecord, setReminderRecord] = useState<LendingRecord | null>(null);

  const isLoading = isLoadingItems || isLoadingBorrowers || isLoadingHistory;

  // Compute metric cards
  const totalItems = items.length;
  const availableItems = items.filter((i: Item) => i.status === 'AVAILABLE').length;
  const activeLendings = history.filter((r) => r.status !== 'RETURNED');
  const currentlyLent = activeLendings.length;
  const dueSoon = history.filter((r) => r.status === 'DUESOON').length;
  const overdue = history.filter((r) => r.status === 'OVERDUE').length;
  const returnedCount = history.filter((r) => r.status === 'RETURNED').length;

  // Lookup maps for fast join resolution
  const itemsMap = new Map<string, Item>(items.map((i: Item) => [i.id, i]));
  const borrowersMap = new Map(borrowers.map((b) => [b.id, b]));

  const handleConfirmReturn = async () => {
    if (!recordToReturn) return;
    try {
      await returnMutation.mutateAsync(recordToReturn.id);
      setRecordToReturn(null);
    } catch (err) {
      console.error('Failed to return item:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-600 dark:text-gold text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-forest dark:text-cream tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 dark:text-cream/70">
            Real-time status of your items, borrowers, and scheduled returns.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddBorrowerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Borrower
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddItemOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Item
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsLendOpen(true)}
            leftIcon={<ArrowUpRight className="w-4 h-4 text-forest" />}
            className="font-bold shadow-xs"
          >
            Lend Item
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : (
        <>
          {/* Key Metrics Grid (60/30/10 with #DDA15E highlights) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total Items */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-moss/40 transition-colors">
              <div className="flex items-center justify-between text-forest/60 dark:text-cream/60">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Items
                </span>
                <Package className="w-4 h-4 text-forest dark:text-cream" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-forest dark:text-cream">
                  {totalItems}
                </span>
              </div>
            </Card>

            {/* Available Items */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Available
                </span>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                  {availableItems}
                </span>
              </div>
            </Card>

            {/* Currently Lent */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-moss/40 transition-colors">
              <div className="flex items-center justify-between text-moss dark:text-moss-400">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Lent Out
                </span>
                <Repeat className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-forest dark:text-cream">
                  {currentlyLent}
                </span>
              </div>
            </Card>

            {/* Due Soon (Gold Highlight) */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between bg-gold/10 dark:bg-forest-800 border-gold/40 hover:border-gold transition-colors">
              <div className="flex items-center justify-between text-gold-600 dark:text-gold">
                <span className="text-xs font-semibold uppercase tracking-wider font-bold">
                  Due Soon
                </span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-gold-600 dark:text-gold">
                  {dueSoon}
                </span>
              </div>
            </Card>

            {/* Overdue (Danger Highlight) */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between bg-red-500/10 dark:bg-forest-800 border-red-500/30 hover:border-red-500/60 transition-colors">
              <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                <span className="text-xs font-semibold uppercase tracking-wider font-bold">
                  Overdue
                </span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400">
                  {overdue}
                </span>
              </div>
            </Card>

            {/* Returned */}
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div className="flex items-center justify-between text-forest/60 dark:text-cream/60">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Returned
                </span>
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-forest dark:text-cream">
                  {returnedCount}
                </span>
              </div>
            </Card>
          </div>

          {/* Urgent Alerts Section (if any due soon or overdue) */}
          {(overdue > 0 || dueSoon > 0) && (
            <div className="p-4 rounded-xl bg-gold/15 dark:bg-forest-800 border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold text-forest">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest dark:text-cream">
                    Attention Needed:{' '}
                    {overdue > 0 && `${overdue} item${overdue === 1 ? '' : 's'} overdue`}{' '}
                    {overdue > 0 && dueSoon > 0 && 'and '}{' '}
                    {dueSoon > 0 && `${dueSoon} item${dueSoon === 1 ? '' : 's'} due soon`}
                  </h4>
                  <p className="text-xs text-forest/70 dark:text-cream/70">
                    Send quick reminders or verify if these items have been returned.
                  </p>
                </div>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate(ROUTES.DUE_SOON_OVERDUE)}
                className="font-bold text-xs"
              >
                Review Items
              </Button>
            </div>
          )}

          {/* Active Lendings Table Section */}
          <Card>
            <CardHeader
              title="Active Lendings"
              subtitle={`Showing ${activeLendings.length} currently borrowed items`}
              action={
                <Link to={ROUTES.LENDING}>
                  <Button variant="ghost" size="sm">
                    View History &rarr;
                  </Button>
                </Link>
              }
            />
            <CardContent className="p-0">
              {activeLendings.length === 0 ? (
                <EmptyState
                  title="No items currently lent"
                  description="All inventory items are currently in your possession and available."
                  actionText="Lend an Item"
                  onAction={() => setIsLendOpen(true)}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Borrower</th>
                        <th className="py-3 px-4">Expected Return</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                      {activeLendings.map((record) => {
                        const item = itemsMap.get(record.itemId);
                        const borrower = borrowersMap.get(record.borrowerId);
                        const statusConfig = getLendingStatusConfig(record.status);

                        return (
                          <tr
                            key={record.id}
                            className="hover:bg-cream-50/80 dark:hover:bg-forest-700/30 transition-colors"
                          >
                            {/* Item Name */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-forest dark:text-cream">
                                {item?.name || 'Unknown Item'}
                              </div>
                              <div className="text-xs text-forest/60 dark:text-cream/60">
                                {item?.category || 'Item'}
                                {item?.identifier ? ` • ${item.identifier}` : ''}
                              </div>
                            </td>

                            {/* Borrower */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-forest dark:text-cream">
                                {borrower?.name || 'Unknown Borrower'}
                              </div>
                              <div className="text-xs text-forest/60 dark:text-cream/60">
                                {borrower?.phone || borrower?.email || '—'}
                              </div>
                            </td>

                            {/* Expected Return Date */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-medium text-forest dark:text-cream">
                                {formatDate(record.expectedReturnDate)}
                              </div>
                              <div className="text-xs text-forest/60 dark:text-cream/60">
                                {formatRelativeTime(record.expectedReturnDate)}
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                                {statusConfig.label}
                              </span>
                            </td>

                            {/* Compact Icon-First Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                {/* Reminder generator shortcut */}
                                <Tooltip content="Generate Reminder Message">
                                  <button
                                    onClick={() => setReminderRecord(record)}
                                    aria-label="Generate reminder"
                                    className="p-1.5 rounded-lg text-moss dark:text-gold hover:bg-moss/10 dark:hover:bg-forest-700 transition-colors cursor-pointer"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                </Tooltip>

                                {/* 1-click Return Action */}
                                <Tooltip content="Mark as Returned">
                                  <button
                                    onClick={() => setRecordToReturn(record)}
                                    aria-label="Mark item returned"
                                    className="p-1.5 rounded-lg text-forest dark:text-cream hover:bg-moss/10 dark:hover:bg-forest-700 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                              </div>
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
        </>
      )}

      {/* Modals */}
      <ItemFormModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />

      <BorrowerFormModal
        isOpen={isAddBorrowerOpen}
        onClose={() => setIsAddBorrowerOpen(false)}
      />

      <LendItemModal
        isOpen={isLendOpen}
        onClose={() => setIsLendOpen(false)}
      />

      {/* Return Item Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(recordToReturn)}
        onClose={() => setRecordToReturn(null)}
        onConfirm={handleConfirmReturn}
        title="Return Item"
        message={`Confirm that "${itemsMap.get(recordToReturn?.itemId || '')?.name || 'this item'}" has been safely returned?`}
        confirmText="Confirm Return"
        cancelText="Cancel"
        isLoading={returnMutation.isPending}
      />

      {/* Reminder Message Generator Modal */}
      {reminderRecord && (
        <ReminderGeneratorModal
          isOpen={Boolean(reminderRecord)}
          onClose={() => setReminderRecord(null)}
          record={reminderRecord}
          item={itemsMap.get(reminderRecord.itemId)}
          borrower={borrowersMap.get(reminderRecord.borrowerId)}
        />
      )}
    </div>
  );
};
