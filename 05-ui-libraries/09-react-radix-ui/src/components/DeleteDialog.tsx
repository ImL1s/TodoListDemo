import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../styles/App.module.css';

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  todoText: string;
}

/**
 * DeleteDialog component using Radix UI Dialog primitive
 *
 * Demonstrates:
 * - Radix Dialog primitive for accessible modal dialogs
 * - Portal rendering (dialog overlays the entire page)
 * - Focus management (traps focus within dialog)
 * - ESC key to close
 * - Click outside to close
 * - ARIA attributes for accessibility
 */
export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  todoText,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>
            Delete Todo
          </Dialog.Title>
          <Dialog.Description className={styles.dialogDescription}>
            Are you sure you want to delete this todo?
          </Dialog.Description>

          <div className={styles.dialogTodoPreview}>
            "{todoText}"
          </div>

          <p className={styles.dialogWarning}>
            This action cannot be undone.
          </p>

          <div className={styles.dialogActions}>
            <Dialog.Close asChild>
              <button className={styles.buttonSecondary} type="button">
                Cancel
              </button>
            </Dialog.Close>
            <button
              className={styles.buttonDanger}
              onClick={handleConfirm}
              type="button"
            >
              Delete
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className={styles.dialogCloseButton}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
