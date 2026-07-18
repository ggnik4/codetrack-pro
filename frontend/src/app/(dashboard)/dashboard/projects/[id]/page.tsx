'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FolderOpen, Users, Calendar, Loader2, ArrowLeft } from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { projectService, Project } from '@/services/projectService'
import Link from 'next/link'

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        const data = await projectService.getProject(id)
        setProject(data)
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </LayoutShell>
    )
  }

  if (!project) {
    return (
      <LayoutShell>
        <div className="py-6 text-center">Project not found</div>
      </LayoutShell>
    )
  }

  return (
    <LayoutShell>
      <div className="space-y-6 p-6">
        <Link href="/dashboard/projects">
            <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
            </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
                <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: project.color + '20' }}
                >
                    <FolderOpen
                        className="h-8 w-8"
                        style={{ color: project.color }}
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <div className="flex gap-2 mt-2">
                        <Badge variant={project.visibility === 'PUBLIC' ? 'outline' : 'secondary'}>
                            {project.visibility.toLowerCase()}
                        </Badge>
                        <Badge variant="outline">
                            {project.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                    </div>
                </div>
            </div>
            <p className="text-muted-foreground mt-4">{project.description}</p>
            <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Owner: {project.owner_username}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  )
}
