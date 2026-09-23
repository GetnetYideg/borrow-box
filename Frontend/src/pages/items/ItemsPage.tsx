import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import { useItems, useDeleteItem } from '../../hooks/useItems';
import { CATEGORIES, type Category } from '../../constants/categories';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip } from '../../components/ui/Tooltip';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ItemFormModal } from './ItemFormModal';
import { LendItemModal } from '../lending/LendItemModal';
import { getItemStatusConfig } from '../../utils/statusBadge';
import { getCategoryLabel } from '../../utils/categoryLabel';
import type { Item } from '../../types/item.types';

export const ItemsPage: React.FC = () => {
  const { data: items = [], isLoading } = useItems();
  const deleteMutation = useDeleteItem();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [itemToLend, setItemToLend] = useState<Item | null>(null);

  // Client-side filtering & search
  const filteredItems = useMemo(() => {
    return items.filter((item: Item) => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query) ?? false;
        const matchId = item.identifier?.toLowerCase().includes(query) ?? false;
        if (!matchName && !matchDesc && !matchId) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedStatus, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const categoryFilterOptions = [
    { value: 'ALL', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: getCategoryLabel(cat) })),
  ];

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'AVAILABLE', label: 'Available Only' },
    { value: 'UNAVAILABLE', label: 'Lent Out (Unavailable)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-moss/10 dark:border-forest-700">
        <div>
          <h1 className="text-2xl font-black text-forest dark:text-cream tracking-tight">
            Items Inventory
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 dark:text-cream/70">
            Manage your catalog of items available for borrowing.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-semibold"
        >
          Add Item
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="py-2"
            />
          </div>

          <div className="flex gap-2 sm:w-auto">
            <Select
              options={categoryFilterOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 text-xs"
            />

            <Select
              options={statusFilterOptions}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Items List */}
      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={searchQuery || selectedCategory !== 'ALL' ? 'No items match your filter' : 'No items added yet'}
          description={
            searchQuery || selectedCategory !== 'ALL'
              ? 'Try adjusting your search terms or clearing category filters.'
              : 'Start by adding your first item to the lending inventory.'
          }
          actionText={searchQuery || selectedCategory !== 'ALL' ? 'Clear Filters' : 'Add Item'}
          onAction={() => {
            if (searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
            } else {
              setIsCreateOpen(true);
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
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Tag / Identifier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss/10 dark:divide-forest-700/50">
                  {filteredItems.map((item: Item) => {
                    const statusConfig = getItemStatusConfig(item.status);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-cream-50/80 dark:hover:bg-forest-700/30 transition-colors"
                      >
                        {/* Name & Desc */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/items/${item.id}`}
                            className="font-bold text-forest dark:text-cream hover:text-moss dark:hover:text-gold"
                          >
                            {item.name}
                          </Link>
                          {item.description && (
                            <p className="text-xs text-forest/60 dark:text-cream/60 truncate max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-forest/80 dark:text-cream/80 bg-moss/10 px-2 py-0.5 rounded-md">
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>

                        {/* Identifier */}
                        <td className="py-3 px-4 font-mono text-xs text-forest/70 dark:text-cream/70 whitespace-nowrap">
                          {item.identifier || '—'}
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

                        {/* Icon-First Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick Lend (only if available) */}
                            {item.status === 'AVAILABLE' && (
                              <Tooltip content="Lend this Item">
                                <button
                                  onClick={() => setItemToLend(item)}
                                  aria-label="Lend item"
                                  className="p-1.5 rounded-lg text-forest dark:text-gold hover:bg-gold/20 transition-colors cursor-pointer"
                                >
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            )}

                            {/* View details */}
                            <Tooltip content="View Details">
                              <Link
                                to={`/items/${item.id}`}
                                aria-label="View item details"
                                className="p-1.5 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 dark:hover:bg-forest-700 hover:text-forest dark:hover:text-cream transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Tooltip>

                            {/* Edit */}
                            <Tooltip content="Edit Item">
                              <button
                                onClick={() => setItemToEdit(item)}
                                aria-label="Edit item"
                                className="p-1.5 rounded-lg text-forest/70 dark:text-cream/70 hover:bg-moss/10 dark:hover:bg-forest-700 hover:text-forest dark:hover:text-cream transition-colors cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip content="Delete Item">
                              <button
                                onClick={() => setItemToDelete(item)}
                                aria-label="Delete item"
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
      <ItemFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {itemToEdit && (
        <ItemFormModal
          isOpen={Boolean(itemToEdit)}
          onClose={() => setItemToEdit(null)}
          itemToEdit={itemToEdit}
        />
      )}

      {itemToLend && (
        <LendItemModal
          isOpen={Boolean(itemToLend)}
          onClose={() => setItemToLend(null)}
          preSelectedItemId={itemToLend.id}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
