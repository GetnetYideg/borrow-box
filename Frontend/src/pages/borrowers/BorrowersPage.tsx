import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  Phone,
  Mail,
  Eye,
  Trash2,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import { useBorrowers, useDeleteBorrower } from '../../hooks/useBorrowers';
import { useLendingHistory } from '../../hooks/useLending';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { BorrowerFormModal } from './BorrowerFormModal';
import { LendItemModal } from '../lending/LendItemModal';
import type { Borrower } from '../../types/borrower.types';

export const BorrowersPage: React.FC = () => {
  const { data: borrowers = [], isLoading } = useBorrowers();
  const { data: history = [] } = useLendingHistory();
  const deleteMutation = useDeleteBorrower();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [borrowerToDelete, setBorrowerToDelete] = useState<Borrower | null>(null);
  const [borrowerToLend, setBorrowerToLend] = useState<Borrower | null>(null);

  // Calculate active loans per borrower
  const activeLoansCountMap = useMemo(() => {
    const map = new Map<string, number>();
    history
      .filter((r) => r.status !== 'RETURNED')
      .forEach((r) => {
        map.set(r.borrowerId, (map.get(r.borrowerId) || 0) + 1);
      });
    return map;
  }, [history]);

  // Client-side text search
  const filteredBorrowers = useMemo(() => {
    if (!searchQuery.trim()) return borrowers;
    const query = searchQuery.toLowerCase();
    return borrowers.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.phone?.toLowerCase().includes(query) ||
        b.email?.toLowerCase().includes(query) ||
        b.notes?.toLowerCase().includes(query)
    );
  }, [borrowers, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!borrowerToDelete) return;
    try {
      await deleteMutation.mutateAsync(borrowerToDelete.id);
      setBorrowerToDelete(null);
    } catch (err) {
      console.error('Failed to delete borrower:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div>
          <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
            Borrowers Directory
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 dark:text-cream/70">
            Contacts authorized to borrow items with validated phone numbers or Gmail.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-semibold"
        >
          Add Borrower
        </Button>
      </div>

      {/* Search Input */}
      <Card className="p-3">
        <Input
          placeholder="Search borrowers by name, phone, or Gmail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="py-2"
        />
      </Card>

      {/* Borrowers Table */}
      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : filteredBorrowers.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No borrowers match your search' : 'No borrowers yet'}
          description={
            searchQuery
              ? 'Try checking the name or phone number.'
              : 'Add your friends, teammates, or colleagues so you can lend items to them.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Add Borrower'}
          onAction={() => {
            if (searchQuery) setSearchQuery('');
            else setIsAddOpen(true);
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 dark:bg-forest-900/40 text-[11px] font-bold uppercase tracking-wider text-forest/70 dark:text-cream/70 border-b border-moss/10 dark:border-forest-700">
                  <tr>
                    <th className="py-3 px-4">Borrower Name</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4">Active Loans</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {filteredBorrowers.map((borrower) => {
                    const activeLoans = activeLoansCountMap.get(borrower.id) || 0;
                    return (
                      <tr
                        key={borrower.id}
                        className="hover:bg-cream-50/80 dark:hover:bg-forest-700/30 transition-colors"
                      >
                        {/* Name */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/borrowers/${borrower.id}`}
                            className="font-bold text-forest dark:text-cream hover:text-moss dark:hover:text-gold"
                          >
                            {borrower.name}
                          </Link>
                        </td>

                        {/* Contacts */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 text-xs">
                            {borrower.phone && (
                              <span className="flex items-center gap-1.5 text-forest/80 dark:text-cream/80">
                                <Phone className="w-3 h-3 text-moss" />
                                {borrower.phone}
                              </span>
                            )}
                            {borrower.email && (
                              <span className="flex items-center gap-1.5 text-forest/80 dark:text-cream/80">
                                <Mail className="w-3 h-3 text-moss" />
                                {borrower.email}
                              </span>
                            )}
                            {!borrower.phone && !borrower.email && (
                              <span className="text-forest/40 dark:text-cream/40">No contact info</span>
                            )}
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="py-3 px-4 text-xs text-forest/70 dark:text-cream/70 max-w-xs truncate">
                          {borrower.notes || '—'}
                        </td>

                        {/* Active Loans */}
                        <td className="py-3 px-4">
                          {activeLoans > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/20 text-gold-600 dark:text-gold border border-gold/30">
                              <Package className="w-3 h-3" />
                              {activeLoans} active loan{activeLoans === 1 ? '' : 's'}
                            </span>
                          ) : (
                            <span className="text-xs text-forest/50 dark:text-cream/50">
                              0 items
                            </span>
                          )}
                        </td>

                        {/* Icon-First Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Lend to this borrower */}
                            <Tooltip content="Lend an item to this borrower">
                              <button
                                onClick={() => setBorrowerToLend(borrower)}
                                aria-label="Lend to borrower"
                                className="p-1.5 rounded-lg text-forest dark:text-gold hover:bg-gold/20 transition-colors cursor-pointer"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
                            </Tooltip>

                            {/* View details */}
                            <Tooltip content="View Borrower Details">
                              <Link
                                to={`/borrowers/${borrower.id}`}
                                aria-label="View details"
                                className="p-1.5 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 dark:hover:bg-forest-700 hover:text-forest dark:hover:text-cream transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Tooltip>

                            {/* Delete borrower */}
                            <Tooltip content="Delete Borrower">
                              <button
                                onClick={() => setBorrowerToDelete(borrower)}
                                aria-label="Delete borrower"
                                className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <BorrowerFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      {borrowerToLend && (
        <LendItemModal
          isOpen={Boolean(borrowerToLend)}
          onClose={() => setBorrowerToLend(null)}
          preSelectedBorrowerId={borrowerToLend.id}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(borrowerToDelete)}
        onClose={() => setBorrowerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Borrower"
        message={`Are you sure you want to delete ${borrowerToDelete?.name}? Existing past lending history will remain.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
