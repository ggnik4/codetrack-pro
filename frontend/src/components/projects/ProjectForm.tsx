import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProjectSchema } from '@/lib/schemas';

const formSchema = createProjectSchema.extend({
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
});

interface ProjectFormProps {
  initialData?: {
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'PUBLIC';
  };
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export function ProjectForm({ initialData, onSubmit, isLoading, submitLabel }: ProjectFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      visibility: 'PRIVATE',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Project Name</label>
        <Input placeholder="Enter project name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter project description" {...register('description')} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Visibility</label>
        <select {...register('visibility')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="PRIVATE">Private</option>
          <option value="PUBLIC">Public</option>
        </select>
        {errors.visibility && <p className="text-sm text-destructive">{errors.visibility.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
