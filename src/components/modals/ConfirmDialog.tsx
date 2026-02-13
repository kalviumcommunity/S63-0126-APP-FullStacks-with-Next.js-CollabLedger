import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, Info } from 'lucide-react';
import Button from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const Icon = variant === 'danger' ? AlertTriangle : Info;
  const iconColorClass = variant === 'danger' ? 'text-red-600' : 'text-blue-600';
  const iconBgClass = variant === 'danger' ? 'bg-red-100' : 'bg-blue-100';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Icon */}
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBgClass} mb-4`}>
                  <Icon className={`h-6 w-6 ${iconColorClass}`} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-500 mb-6">
                    {message}
                  </Dialog.Description>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label={cancelText}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    aria-label={confirmText}
                    className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
                  >
                    {isLoading ? 'Processing...' : confirmText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
