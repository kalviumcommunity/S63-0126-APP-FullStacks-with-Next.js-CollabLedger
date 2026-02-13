import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

interface UseConfirmReturn {
  isOpen: boolean;
  confirm: (_confirmOptions: ConfirmOptions) => Promise<boolean>;
  confirmProps: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: 'danger' | 'info';
  };
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'info',
  });
  const [resolver, setResolver] = useState<{
    resolve: (_confirmed: boolean) => void;
  } | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions({
      ...opts,
      confirmText: opts.confirmText || 'Confirm',
      cancelText: opts.cancelText || 'Cancel',
      variant: opts.variant || 'info',
    });
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolver?.resolve(true);
    setIsOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    resolver?.resolve(false);
    setIsOpen(false);
  }, [resolver]);

  return {
    isOpen,
    confirm,
    confirmProps: {
      isOpen,
      onClose: handleCancel,
      onConfirm: handleConfirm,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant || 'info',
    },
  };
}
