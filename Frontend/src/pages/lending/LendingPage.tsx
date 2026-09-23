import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Search,
  Filter,
  Repeat,
  RotateCcw,
  MessageSquare,
  Eye,
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
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LendItemModal } from './LendItemModal';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { getLendingStatusConfig } from '../../utils/statusBadge';
import { LENDING_STATUSES, type LendingStatus } from '../../constants/lendingStatus';
import type { LendingRecord } from '../../types/lending.types';
import type { Item } from '../../types/item.types';

export const LendingPage: React.FC = () => {
  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  const { data: borrowers = [], isLoading: isLoadingBorrowers } = useBorrowers();

  const returnMutation = useReturnItem();
  const trackMutation = useTrackDueDate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [isLendOpen, setIsLendOpen] = useState(false);
  const [recordToReturn, setRecordToReturn] = useState<LendingRecord | null>(null);
  const [reminderRecord, setReminderRecord] = useState<LendingRecord | null>(null);

  const isLoading = isLoadingHistory || isLoadingItems || isLoadingBorrowers;

  const itemsMap = useMemo(() => new Map<string, Item>(items.map((i: Item) => [i.id, i])), [items]);
  const borrowersMap = useMemo(() => new Map(borrowers.map((b) => [b.id, b])), [borrowers]);

  // Client-side filtering & search
  const filteredHistory = useMemo(() => {
    return history.filter((record) => {
      if (selectedStatus !== 'ALL' && record.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const itemName = itemsMap.get(record.itemId)?.name.toLowerCase() || '';
        const borrowerName = borrowersMap.get(record.borrowerId)?.name.toLowerCase() || '';
        const notes = record.notes?.toLowerCase() || '';
        if (!itemName.includes(query) && !borrowerName.includes(query) && !notes.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [history, selectedStatus, searchQuery, itemsMap, borrowersMap]);

  const handleReturnConfirm = async () => {
    if (!recordToReturn) return;
    try {
      await returnMutation.mutateAsync(recordToReturn.id);
      setRecordToReturn(null);
    } catch (err) {
      console.error('Failed to return item:', err);
    }
  };

  const handleTrackStatus = async (id: string) => {
    try {
      await trackMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to update due date status:', err);
    }
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    ...LENDING_STATUSES.map((status) => ({
      value: status,
      label: getLendingStatusConfig(status).label,
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div>
          <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
            Lending History & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 dark:text-cream/70">
            Audit log of all past and active item loans with return confirmations.
          </p>
        </div>

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

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by item name, borrower, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="py-2"
            />
          </div>

          <div className="sm:w-60">
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* History Table */}
      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          title={searchQuery || selectedStatus !== 'ALL' ? 'No records match filter' : 'No lending history yet'}
          description={
            searchQuery || selectedStatus !== 'ALL'
              ? 'Try changing the status filter or clearing your search term.'
              : 'Begin by lending an available item to a borrower.'
          }
          actionText={searchQuery || selectedStatus !== 'ALL' ? 'Clear Filters' : 'Lend an Item'}
          onAction={() => {
            if (searchQuery || selectedStatus !== 'ALL') {
              setSearchQuery('');
              setSelectedStatus('ALL');
            } else {
              setIsLendOpen(true);
            }
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Borrower</th>
                    <th className="py-3 px-4">Lent Date</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {filteredHistory.map((record) => {
                    const item = itemsMap.get(record.itemId);
                    const borrower = borrowersMap.get(record.borrowerId);
                    const statusConfig = getLendingStatusConfig(record.status);
                    const isActive = record.status !== 'RETURNED';

                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-cream-50/80 dark:hover:bg-forest-700/30 transition-colors"
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
                            {item?.category || 'Item'}
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

                        {/* Lent Date */}
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-forest/80 dark:text-cream/80">
                          {formatDate(record.lentAt)}
                        </td>

                        {/* Expected Return */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-forest dark:text-cream">
                            {formatDate(record.expectedReturnDate)}
                          </div>
                          <div className="text-xs text-forest/60 dark:text-cream/60">
                            {isActive ? formatRelativeTime(record.expectedReturnDate) : `Returned ${formatDate(record.returnedAt)}`}
                          </div>
                        </td>

                        {/* Status */}
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
                          <div className="flex items-center justify-end gap-1">
                            {isActive && (
                              <>
                                {/* Recalculate status via trackDueDate */}
                                <Tooltip content="Check / Refresh Due Status">
                                  <button
                                    onClick={() => handleTrackStatus(record.id)}
                                    aria-label="Refresh status"
                                    className="p-1.5 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                </Tooltip>

                                {/* Reminder Generator */}
                                <Tooltip content="Generate Reminder Message">
                                  <button
                                    onClick={() => setReminderRecord(record)}
                                    aria-label="Generate reminder"
                                    className="p-1.5 rounded-lg text-moss dark:text-gold hover:bg-moss/10 cursor-pointer"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                </Tooltip>

                                {/* Return Action */}
                                <Tooltip content="Mark as Returned">
                                  <button
                                    onClick={() => setRecordToReturn(record)}
                                    aria-label="Mark returned"
                                    className="p-1.5 rounded-lg text-forest dark:text-cream hover:bg-moss/10 cursor-pointer"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                              </>
                            )}

                            {/* View detail page */}
                            <Tooltip content="View Details">
                              <Link
                                to={`/lending/${record.id}`}
                                aria-label="View record details"
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

      {/* Modals */}
      <LendItemModal
        isOpen={isLendOpen}
        onClose={() => setIsLendOpen(false)}
      />

      <ConfirmDialog
        isOpen={Boolean(recordToReturn)}
        onClose={() => setRecordToReturn(null)}
        onConfirm={handleReturnConfirm}
        title="Confirm Return"
        message={`Mark "${itemsMap.get(recordToReturn?.itemId || '')?.name || 'this item'}" as returned by ${borrowersMap.get(recordToReturn?.borrowerId || '')?.name || 'borrower'}?`}
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
          borrower={borrowersMap.get(reminderRecord.borrowerId)}
        />
      )}
    </div>
  );
};
