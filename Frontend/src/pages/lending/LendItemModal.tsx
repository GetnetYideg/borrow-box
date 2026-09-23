import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Repeat, User, Package } from 'lucide-react';
import { lendItemSchema, type LendItemFormValues } from '../../schemas/lending.schema';
import { useLendItem } from '../../hooks/useLending';
import { useItems } from '../../hooks/useItems';
import { useBorrowers } from '../../hooks/useBorrowers';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import type { Item } from '../../types/item.types';

interface LendItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedItemId?: string;
  preSelectedBorrowerId?: string;
}

export const LendItemModal: React.FC<LendItemModalProps> = ({
  isOpen,
  onClose,
  preSelectedItemId,
  preSelectedBorrowerId,
}) => {
  const { data: items = [] } = useItems();
  const { data: borrowers = [] } = useBorrowers();
  const lendItemMutation = useLendItem();

  // Filter available items, but include the pre-selected item if it was passed
  const availableItems = items.filter(
    (item: Item) => item.status === 'AVAILABLE' || item.id === preSelectedItemId
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LendItemFormValues>({
    resolver: zodResolver(lendItemSchema),
    defaultValues: {
      itemId: preSelectedItemId || '',
      borrowerId: preSelectedBorrowerId || '',
      expectedReturnDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Default return date to 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const isoDate = defaultDate.toISOString().split('T')[0];

      reset({
        itemId: preSelectedItemId || (availableItems[0]?.id ?? ''),
        borrowerId: preSelectedBorrowerId || (borrowers[0]?.id ?? ''),
        expectedReturnDate: isoDate,
        notes: '',
      });
    }
  }, [isOpen, preSelectedItemId, preSelectedBorrowerId, reset, availableItems.length, borrowers.length]);

  const onSubmit = async (values: LendItemFormValues) => {
    try {
      await lendItemMutation.mutateAsync({
        itemId: values.itemId,
        borrowerId: values.borrowerId,
        expectedReturnDate: new Date(values.expectedReturnDate).toISOString(),
        notes: values.notes || undefined,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to lend item:', error);
    }
  };

  const itemOptions = availableItems.map((item: Item) => ({
    value: item.id,
    label: `${item.name} (${item.category})${item.identifier ? ` [${item.identifier}]` : ''}`,
  }));

  const borrowerOptions = borrowers.map((b) => ({
    value: b.id,
    label: `${b.name} ${b.phone ? `(${b.phone})` : b.email ? `(${b.email})` : ''}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lend an Item"
      description="Assign an available item to a borrower and schedule the expected return date."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Item to Lend *"
          options={itemOptions}
          placeholder={availableItems.length === 0 ? 'No items available' : 'Choose an item'}
          error={errors.itemId?.message}
          disabled={availableItems.length === 0}
          {...register('itemId')}
        />

        <Select
          label="Borrower *"
          options={borrowerOptions}
          placeholder={borrowers.length === 0 ? 'No borrowers available' : 'Choose a borrower'}
          error={errors.borrowerId?.message}
          disabled={borrowers.length === 0}
          {...register('borrowerId')}
        />

        <Input
          label="Expected Return Date *"
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.expectedReturnDate?.message}
          {...register('expectedReturnDate')}
        />

        <Textarea
          label="Lending Notes / Terms"
          placeholder="e.g. Include charging adapter, return before team demo..."
          rows={3}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-moss/10 dark:border-forest-700">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={lendItemMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={lendItemMutation.isPending}
            disabled={availableItems.length === 0 || borrowers.length === 0}
            leftIcon={<Repeat className="w-4 h-4" />}
            className="font-semibold"
          >
            Confirm Lending
          </Button>
        </div>
      </form>
    </Modal>
  );
};
