'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'

const issues = [
  {
    id: '1',
    title: 'Fix authentication bug',
    status: 'in_progress',
    priority: 'high',
    project: 'CodeTrack Pro',
    assignee: 'You',
  },
  {
    id: '2',
    title: 'Improve dashboard performance',
    status: 'in_review',
    priority: 'medium',
    project: 'CodeTrack Pro',
    assignee: 'Sarah Chen',
  },
  {
    id: '3',
    title: 'Add dark mode support',
    status: 'todo',
    priority: 'low',
    project: 'Mobile App',
    assignee: 'John Doe',
  },
]

const statusConfig = {
  backlog: { label: 'Backlog', color: '#6B7280', icon: AlertCircle },
  todo: { label: 'To Do', color: '#3B82F6', icon: CheckSquare },
  in_progress: { label: 'In Progress', color: '#F59E0B', icon: Clock },
  in_review: { label: 'In Review', color: '#8B5CF6', icon: CheckSquare },
  done: { label: 'Done', color: '#10B981', icon: CheckCircle },
}

export default function IssuesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(issue.status)
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  return (
    <LayoutShell>
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Issues</h1>
              <p className="mt-1 text-muted-foreground">Track and manage all your issues</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Issue
            </Button>
          </div>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 flex-wrap"
        >
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {Object.entries(statusConfig).map(([key, config]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={statusFilter.includes(key)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter([...statusFilter, key])
                    } else {
                      setStatusFilter(statusFilter.filter((s) => s !== key))
                    }
                  }}
                >
                  {config.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Issues list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue, idx) => {
              const statusInfo = statusConfig[issue.status as keyof typeof statusConfig]
              const StatusIcon = statusInfo.icon

              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  <Card className="border-border/50 hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{issue.title}</h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{issue.project}</span>
                            <span>•</span>
                            <span>{issue.assignee}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <StatusIcon className="h-4 w-4" style={{ color: statusInfo.color }} />
                            <span className="text-xs">{statusInfo.label}</span>
                          </div>

                          <Badge
                            variant={
                              issue.priority === 'high' || issue.priority === 'urgent'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {issue.priority}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Assign to me</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold">No issues found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ? 'Try adjusting your search' : 'Create your first issue to get started'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </LayoutShell>
  )
}
