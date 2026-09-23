import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Mail, User, StickyNote } from 'lucide-react';
import {
  createBorrowerSchema,
  type CreateBorrowerFormValues,
} from '../../schemas/borrower.schema';
import { useCreateBorrower } from '../../hooks/useBorrowers';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

interface BorrowerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BorrowerFormModal: React.FC<BorrowerFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createBorrowerMutation = useCreateBorrower();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBorrowerFormValues>({
    resolver: zodResolver(createBorrowerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      notes: '',
    },
  });

  const onSubmit = async (values: CreateBorrowerFormValues) => {
    try {
      await createBorrowerMutation.mutateAsync({
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        notes: values.notes || undefined,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create borrower:', error);
    }
  };

  const isSaving = createBorrowerMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Borrower"
      description="Add a contact who can borrow items from your pool. At least one contact method (phone or Gmail) is required."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Borrower Name *"
          placeholder="e.g. Dawit Kebede"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Ethiopian Phone Number"
          placeholder="0911223344 or +251911223344"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          helperText="Format: +251 9XXXXXXXX or 09XXXXXXXX"
          {...register('phone')}
        />

        <Input
          label="Gmail Address"
          type="email"
          placeholder="dawit@gmail.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          helperText="Only @gmail.com addresses are supported by backend"
          {...register('email')}
        />

        <Textarea
          label="Notes / Department / Relationship"
          placeholder="e.g. Design team desk 4B, returned laptop last semester..."
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
            Create Borrower
          </Button>
        </div>
      </form>
    </Modal>
  );
};
