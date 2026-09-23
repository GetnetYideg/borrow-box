import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  MessageSquare,
  Package,
  User,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  useLendingHistory,
  useReturnItem,
  useTrackDueDate,
} from '../../hooks/useLending';
import { useItems } from '../../hooks/useItems';
import { useBorrowers } from '../../hooks/useBorrowers';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ReminderGeneratorModal } from '../../components/lending/ReminderGeneratorModal';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { getLendingStatusConfig } from '../../utils/statusBadge';
import { ROUTES } from '../../constants/routes';
import type { Item } from '../../types/item.types';

export const LendingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: history = [], isLoading: isLoadingHistory } = useLendingHistory();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  const { data: borrowers = [], isLoading: isLoadingBorrowers } = useBorrowers();

  const returnMutation = useReturnItem();
  const trackMutation = useTrackDueDate();

  const [isReturnConfirmOpen, setIsReturnConfirmOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  // Find record from history
  const record = history.find((r) => r.id === id);
  const item = items.find((i: Item) => i.id === record?.itemId);
  const borrower = borrowers.find((b) => b.id === record?.borrowerId);

  // On mount, trigger status check to ensure backend is updated
  useEffect(() => {
    if (id && record && record.status !== 'RETURNED') {
      trackMutation.mutate(id);
    }
  }, [id, record?.status]);

  const handleReturn = async () => {
    if (!id) return;
    try {
      await returnMutation.mutateAsync(id);
      setIsReturnConfirmOpen(false);
    } catch (err) {
      console.error('Failed to return item:', err);
    }
  };

  const handleTrack = async () => {
    if (!id) return;
    try {
      await trackMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to refresh status:', err);
    }
  };

  const isLoading = isLoadingHistory || isLoadingItems || isLoadingBorrowers;

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (!record) {
    return (
      <EmptyState
        title="Lending record not found"
        description="The lending record could not be found or may have been deleted."
        actionText="Back to Lending"
        onAction={() => navigate(ROUTES.LENDING)}
      />
    );
  }

  const statusConfig = getLendingStatusConfig(record.status);
  const isActive = record.status !== 'RETURNED';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.LENDING}
            className="p-2 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 hover:text-forest dark:hover:text-cream transition-colors"
            aria-label="Back to lending history"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-moss dark:text-gold uppercase tracking-wider">
                Lending Record
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
              {item?.name || 'Item'} &rarr; {borrower?.name || 'Borrower'}
            </h1>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {isActive && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrack}
                isLoading={trackMutation.isPending}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh Status
              </Button>

              <Button
                variant="gold"
                size="sm"
                onClick={() => setIsReminderOpen(true)}
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                className="font-bold"
              >
                Reminder Generator
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsReturnConfirmOpen(true)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Mark Returned
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Card */}
        <Card>
          <CardHeader
            title="Item Details"
            action={
              item && (
                <Link to={`/items/${item.id}`}>
                  <Button variant="ghost" size="sm">
                    View &rarr;
                  </Button>
                </Link>
              )
            }
          />
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center text-moss">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-forest dark:text-cream">
                  {item?.name || 'Unknown Item'}
                </h4>
                <p className="text-xs text-forest/60 dark:text-cream/60">
                  {item?.category} {item?.identifier ? `• Tag: ${item.identifier}` : ''}
                </p>
              </div>
            </div>
            {item?.description && (
              <p className="text-xs text-forest/70 dark:text-cream/70 bg-cream-50 dark:bg-forest-900 p-3 rounded-lg border border-moss/10">
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Borrower Card */}
        <Card>
          <CardHeader
            title="Borrower Details"
            action={
              borrower && (
                <Link to={`/borrowers/${borrower.id}`}>
                  <Button variant="ghost" size="sm">
                    View &rarr;
                  </Button>
                </Link>
              )
            }
          />
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-600 dark:text-gold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-forest dark:text-cream">
                  {borrower?.name || 'Unknown Borrower'}
                </h4>
                <p className="text-xs text-forest/60 dark:text-cream/60">
                  {borrower?.phone || borrower?.email || 'No contact provided'}
                </p>
              </div>
            </div>
            {borrower?.notes && (
              <p className="text-xs text-forest/70 dark:text-cream/70 bg-cream-50 dark:bg-forest-900 p-3 rounded-lg border border-moss/10">
                {borrower.notes}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Lending Dates */}
      <Card>
        <CardHeader title="Loan Timeline & Terms" />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-cream-50 dark:bg-forest-900 border border-moss/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-moss" /> Lent On
              </span>
              <p className="text-sm font-bold text-forest dark:text-cream">
                {formatDate(record.lentAt)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 dark:bg-forest-900 border border-moss/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-moss" /> Expected Return
              </span>
              <p className="text-sm font-bold text-forest dark:text-cream">
                {formatDate(record.expectedReturnDate)}
              </p>
              <span className="text-xs text-forest/60 dark:text-cream/60">
                {isActive ? formatRelativeTime(record.expectedReturnDate) : 'Completed'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 dark:bg-forest-900 border border-moss/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60 flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-moss" /> Actual Return
              </span>
              <p className="text-sm font-bold text-forest dark:text-cream">
                {record.returnedAt ? formatDate(record.returnedAt) : 'Pending Return'}
              </p>
            </div>
          </div>

          {record.notes && (
            <div className="mt-4 pt-4 border-t border-moss/10 dark:border-forest-700">
              <label className="text-xs font-semibold uppercase tracking-wider text-forest/60 dark:text-cream/60">
                Lending Notes / Terms
              </label>
              <p className="mt-1 text-sm text-forest dark:text-cream">
                {record.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog for return */}
      <ConfirmDialog
        isOpen={isReturnConfirmOpen}
        onClose={() => setIsReturnConfirmOpen(false)}
        onConfirm={handleReturn}
        title="Confirm Item Return"
        message={`Confirm that "${item?.name}" has been received back from ${borrower?.name}?`}
        confirmText="Confirm Return"
        cancelText="Cancel"
        isLoading={returnMutation.isPending}
      />

      {/* Reminder generator modal */}
      <ReminderGeneratorModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        record={record}
        item={item}
        borrower={borrower}
      />
    </div>
  );
};
