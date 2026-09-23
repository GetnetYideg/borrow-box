import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  MessageSquare,
  RotateCcw,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  useLendingHistory,
  useReturnItem,
  useTrackDueDate,
} from '../../hooks/useLending';
import { useItems } from '../../hooks/useItems';
import { useBorrowers } from '../../hooks/useBorrowers';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { getLendingStatusConfig } from '../../utils/statusBadge';
import type { LendingRecord } from '../../types/lending.types';
import type { Item } from '../../types/item.types';

export const DueSoonOverduePage: React.FC = () => {
  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  const { data: borrowers = [], isLoading: isLoadingBorrowers } = useBorrowers();

  const returnMutation = useReturnItem();
  const trackMutation = useTrackDueDate();

  const [activeTab, setActiveTab] = useState<'overdue' | 'duesoon' | 'all'>('all');
  const [recordToReturn, setRecordToReturn] = useState<LendingRecord | null>(null);
  const [reminderRecord, setReminderRecord] = useState<LendingRecord | null>(null);

  const itemsMap = new Map<string, Item>(items.map((i: Item) => [i.id, i]));
  const borrowersMap = new Map(borrowers.map((b) => [b.id, b]));

  const overdueList = history.filter((r) => r.status === 'OVERDUE');
  const dueSoonList = history.filter((r) => r.status === 'DUESOON');

  const displayedList =
    activeTab === 'overdue'
      ? overdueList
      : activeTab === 'duesoon'
      ? dueSoonList
      : [...overdueList, ...dueSoonList];

  const handleReturnConfirm = async () => {
    if (!recordToReturn) return;
    try {
      await returnMutation.mutateAsync(recordToReturn.id);
      setRecordToReturn(null);
    } catch (err) {
      console.error('Failed to return item:', err);
    }
  };

  const isLoading = isLoadingHistory || isLoadingItems || isLoadingBorrowers;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div>
          <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
            Due Soon & Overdue Tracker
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 dark:text-cream/70">
            Urgent items requiring prompt return or reminder messages.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex p-1 rounded-xl bg-cream-100 dark:bg-forest-800 border border-moss/15 dark:border-forest-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-forest dark:bg-moss text-cream shadow-xs'
                : 'text-forest/70 dark:text-cream/70 hover:text-forest dark:hover:text-cream'
            }`}
          >
            All Urgent ({overdueList.length + dueSoonList.length})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'overdue'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 dark:text-red-400 hover:text-red-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({overdueList.length})
          </button>
          <button
            onClick={() => setActiveTab('duesoon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'duesoon'
                ? 'bg-gold text-forest shadow-xs font-bold'
                : 'text-gold-600 dark:text-gold hover:text-gold-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Due Soon ({dueSoonList.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : displayedList.length === 0 ? (
        <EmptyState
          title="All clear! No urgent items"
          description="None of your lent items are currently due soon or overdue. Great job managing your inventory!"
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Borrower & Contact</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Follow-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {displayedList.map((record) => {
                    const item = itemsMap.get(record.itemId);
                    const borrower = borrowersMap.get(record.borrowerId);
                    const statusConfig = getLendingStatusConfig(record.status);

                    return (
                      <tr
                        key={record.id}
                        className={`transition-colors ${
                          record.status === 'OVERDUE'
                            ? 'bg-red-500/5 hover:bg-red-500/10'
                            : 'hover:bg-cream-50/80 dark:hover:bg-forest-700/30'
                        }`}
                      >
                        {/* Item */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/lending/${record.id}`}
                            className="font-bold text-forest dark:text-cream hover:text-moss dark:hover:text-gold"
                          >
                            {item?.name || 'Unknown Item'}
                          </Link>
                          <div className="text-xs text-forest/60 dark:text-cream/60">
                            {item?.category} {item?.identifier ? `• ${item.identifier}` : ''}
                          </div>
                        </td>

                        {/* Borrower */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-forest dark:text-cream">
                            {borrower?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-forest/60 dark:text-cream/60">
                            {borrower?.phone || borrower?.email || 'No contact'}
                          </div>
                        </td>

                        {/* Due date */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-forest dark:text-cream">
                            {formatDate(record.expectedReturnDate)}
                          </div>
                          <div className="text-xs font-medium text-forest/70 dark:text-cream/70">
                            {formatRelativeTime(record.expectedReturnDate)}
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reminder Generator */}
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => setReminderRecord(record)}
                              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                              className="font-bold text-xs py-1"
                            >
                              Reminder
                            </Button>

                            {/* Return */}
                            <Tooltip content="Mark as Returned">
                              <button
                                onClick={() => setRecordToReturn(record)}
                                aria-label="Mark returned"
                                className="p-1.5 rounded-lg text-forest dark:text-cream hover:bg-moss/10 cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </Tooltip>

                            {/* View detail */}
                            <Tooltip content="View Details">
                              <Link
                                to={`/lending/${record.id}`}
                                aria-label="View details"
                                className="p-1.5 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Return confirmation dialog */}
      <ConfirmDialog
        isOpen={Boolean(recordToReturn)}
        onClose={() => setRecordToReturn(null)}
        onConfirm={handleReturnConfirm}
        title="Confirm Return"
        message={`Mark item as returned by ${borrowersMap.get(recordToReturn?.borrowerId || '')?.name || 'borrower'}?`}
        confirmText="Confirm Return"
        cancelText="Cancel"
        isLoading={returnMutation.isPending}
      />

      {/* Reminder Generator Modal */}
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
