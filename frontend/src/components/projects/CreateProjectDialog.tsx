import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectForm } from './ProjectForm';
import { projectService } from '@/services/projectService';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { createProjectSchema } from '@/lib/schemas';

const formSchema = createProjectSchema.extend({
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
});

export function CreateProjectDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await projectService.createProject(data);
      onSuccess();
      setOpen(false);
      alert('Project created successfully!');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <ProjectForm onSubmit={onSubmit} isLoading={isLoading} submitLabel="Create Project" />
      </DialogContent>
    </Dialog>
  );
}
