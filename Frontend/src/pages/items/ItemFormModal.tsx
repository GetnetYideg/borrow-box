import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CATEGORIES } from '../../constants/categories';
import { ITEM_STATUSES } from '../../constants/itemStatus';
import {
  createItemSchema,
  type CreateItemFormValues,
} from '../../schemas/item.schema';
import { useCreateItem, useUpdateItem } from '../../hooks/useItems';
import type { Item } from '../../types/item.types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { getCategoryLabel } from '../../utils/categoryLabel';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: Item | null;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
}) => {
  const isEditing = Boolean(itemToEdit);
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'OTHER',
      imageUrl: '',
      identifier: '',
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    if (itemToEdit) {
      reset({
        name: itemToEdit.name,
        description: itemToEdit.description || '',
        category: itemToEdit.category,
        imageUrl: itemToEdit.imageUrl || '',
        identifier: itemToEdit.identifier || '',
        status: itemToEdit.status,
      });
    } else {
      reset({
        name: '',
        description: '',
        category: 'OTHER',
        imageUrl: '',
        identifier: '',
        status: 'AVAILABLE',
      });
    }
  }, [itemToEdit, reset, isOpen]);

  const onSubmit = async (values: CreateItemFormValues) => {
    try {
      if (isEditing && itemToEdit) {
        await updateItemMutation.mutateAsync({
          id: itemToEdit.id,
          data: {
            ...values,
            description: values.description || undefined,
            imageUrl: values.imageUrl || undefined,
            identifier: values.identifier || undefined,
          },
        });
      } else {
        await createItemMutation.mutateAsync({
          ...values,
          description: values.description || undefined,
          imageUrl: values.imageUrl || undefined,
          identifier: values.identifier || undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const isSaving =
    createItemMutation.isPending || updateItemMutation.isPending;

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: getCategoryLabel(cat),
  }));

  const statusOptions = ITEM_STATUSES.map((status) => ({
    value: status,
    label: status === 'AVAILABLE' ? 'Available' : 'Lent Out (Unavailable)',
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Item' : 'Add New Item'}
      description={
        isEditing
          ? 'Update the details for this inventory item'
          : 'Add a new piece of gear, tool, or book to your lending pool'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Item Name *"
          placeholder="e.g. Sony Wireless Headphones"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />

          <Select
            label="Initial Status *"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Identifier / Asset Tag"
            placeholder="e.g. SN-98231 or TAG-04"
            error={errors.identifier?.message}
            helperText="Optional serial or tag"
            {...register('identifier')}
          />

          <Input
            label="Image URL"
            type="url"
            placeholder="https://images.unsplash.com/..."
            error={errors.imageUrl?.message}
            helperText="Optional link to item photo"
            {...register('imageUrl')}
          />
        </div>

        <Textarea
          label="Description / Condition Notes"
          placeholder="Note accessories, condition, serial info, or storage location..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-moss/10 dark:border-forest-700">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            className="font-semibold"
          >
            {isEditing ? 'Save Changes' : 'Create Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
