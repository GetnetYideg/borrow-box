import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  MessageSquare,
  BellRing,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import {
  generateReminderMessage,
  type ReminderTone,
} from '../../utils/reminderTemplates';
import { useBorrowerMessage, useLenderReminder } from '../../hooks/useReminders';
import type { LendingRecord } from '../../types/lending.types';
import type { Item } from '../../types/item.types';
import type { Borrower } from '../../types/borrower.types';

interface ReminderGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LendingRecord | null;
  item?: Item | null;
  borrower?: Borrower | null;
}

export const ReminderGeneratorModal: React.FC<ReminderGeneratorModalProps> = ({
  isOpen,
  onClose,
  record,
  item,
  borrower,
}) => {
  const [tone, setTone] = useState<ReminderTone>('friendly');
  const [activeTab, setActiveTab] = useState<'borrower' | 'lender'>('borrower');
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);

  // Queries to backend
  const { data: borrowerApiMsg, refetch: refetchBorrower } = useBorrowerMessage(
    record?.id,
    isOpen && activeTab === 'borrower'
  );
  const { data: lenderApiMsg, refetch: refetchLender } = useLenderReminder(
    record?.id,
    isOpen && activeTab === 'lender'
  );

  const isOverdue = record?.status === 'OVERDUE';

  // Generate template message
  const generateText = (selectedTone: ReminderTone) => {
    return generateReminderMessage(selectedTone, {
      borrowerName: borrower?.name || 'Friend',
      itemName: item?.name || 'the item',
      dueDate: record?.expectedReturnDate,
      isOverdue,
    });
  };

  useEffect(() => {
    if (isOpen && record) {
      setCustomText(generateText(tone));
      setCopied(false);
    }
  }, [isOpen, record, tone, borrower?.name, item?.name]);

  const handleToneChange = (newTone: ReminderTone) => {
    setTone(newTone);
    setCustomText(generateText(newTone));
  };

  const handleRegenerate = () => {
    if (activeTab === 'borrower') {
      refetchBorrower();
    } else {
      refetchLender();
    }
    setCustomText(generateText(tone));
  };

  const handleUseServerText = () => {
    if (activeTab === 'borrower' && borrowerApiMsg?.message) {
      setCustomText(borrowerApiMsg.message);
    } else if (activeTab === 'lender' && lenderApiMsg?.message) {
      setCustomText(lenderApiMsg.message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const tones: Array<{ id: ReminderTone; label: string; icon: string }> = [
    { id: 'friendly', label: 'Friendly', icon: '😊' },
    { id: 'casual', label: 'Casual', icon: '👋' },
    { id: 'formal', label: 'Formal', icon: '👔' },
    { id: 'funny', label: 'Funny', icon: '😄' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reminder Message Generator"
      description={`Generate a personalized reminder message for ${borrower?.name || 'borrower'} regarding ${item?.name || 'item'}.`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Tab toggle: Borrower message vs Lender alert */}
        <div className="flex p-1 rounded-xl bg-cream-100 dark:bg-forest-900 border border-moss/10 dark:border-forest-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('borrower');
              setCustomText(generateText(tone));
            }}
            className={`
              flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer
              ${
                activeTab === 'borrower'
                  ? 'bg-moss text-cream shadow-xs'
                  : 'text-forest/70 dark:text-cream/70 hover:text-forest dark:hover:text-cream'
              }
            `}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Borrower Message
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('lender');
              if (lenderApiMsg?.message) setCustomText(lenderApiMsg.message);
            }}
            className={`
              flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer
              ${
                activeTab === 'lender'
                  ? 'bg-moss text-cream shadow-xs'
                  : 'text-forest/70 dark:text-cream/70 hover:text-forest dark:hover:text-cream'
              }
            `}
          >
            <BellRing className="w-3.5 h-3.5" />
            Lender Note
          </button>
        </div>

        {/* Tone Selector Pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-forest dark:text-cream/90 mb-2">
            Select Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleToneChange(t.id)}
                className={`
                  flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer
                  ${
                    tone === t.id
                      ? 'bg-gold/20 text-forest dark:text-cream border-gold-400 font-bold shadow-xs'
                      : 'bg-white dark:bg-forest-800 text-forest/70 dark:text-cream/70 border-moss/15 dark:border-forest-700 hover:border-moss/40'
                  }
                `}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Server message quick-insert if available */}
        {(borrowerApiMsg?.message || lenderApiMsg?.message) && (
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-moss/10 dark:bg-forest-700 border border-moss/20">
            <span className="text-forest/80 dark:text-cream/80">
              Backend server template available
            </span>
            <button
              type="button"
              onClick={handleUseServerText}
              className="text-moss dark:text-gold font-bold hover:underline cursor-pointer"
            >
              Load Server Version
            </button>
          </div>
        )}

        {/* Editable Message Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-forest dark:text-cream/90">
              Message Content (Editable)
            </label>
            <span className="text-[11px] text-forest/50 dark:text-cream/50">
              {customText.length} characters
            </span>
          </div>
          <Textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="font-sans text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-moss/10 dark:border-forest-700">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto"
          >
            Regenerate
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleCopy}
              leftIcon={
                copied ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Copy className="w-4 h-4" />
                )
              }
              className="flex-1 sm:flex-initial font-bold"
            >
              {copied ? 'Copied!' : 'Copy Message'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
