'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BaseModal } from './BaseModal';
import FormInput from '../FormInput';
import Button from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToastFromError } from '@/lib/toastHelpers';

const editProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

interface Project {
  id: string;
  title: string;
  description: string | null;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  project: Project | null;
}

export function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
  });

  // Reset form with project data when modal opens
  useEffect(() => {
    if (isOpen && project) {
      reset({
        title: project.title,
        description: project.description || '',
      });
    }
  }, [isOpen, project, reset]);

  const onSubmit = async (data: EditProjectFormData) => {
    if (!project) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update project');
      }

      showSuccessToast('Project updated successfully!');
      onClose();
      onSuccess?.();
    } catch (error) {
      showErrorToastFromError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Project"
      description="Update your project details"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Project Title"
          id="title"
          type="text"
          placeholder="Enter project title"
          error={errors.title?.message}
          disabled={isSubmitting}
          {...register('title')}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
            {...register('description')}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Updating...
              </>
            ) : (
              'Update Project'
            )}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
