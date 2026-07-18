import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ProjectForm } from './ProjectForm';
import { projectService, Project } from '@/services/projectService';
import { z } from 'zod';
import { createProjectSchema } from '@/lib/schemas';

const formSchema = createProjectSchema.extend({
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
});

interface EditProjectDialogProps {
  project: Project;
  onSuccess: () => void;
}

export function EditProjectDialog({ project, onSuccess }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await projectService.updateProject(project.id, data);
      onSuccess();
      setOpen(false);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit project</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project: {project.name}</DialogTitle>
        </DialogHeader>
        <ProjectForm
          initialData={{
            name: project.name,
            description: project.description || '',
            visibility: (project.visibility.toUpperCase() as 'PRIVATE' | 'PUBLIC'),
          }}
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
