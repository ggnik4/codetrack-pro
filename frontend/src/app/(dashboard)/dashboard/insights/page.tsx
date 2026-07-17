'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, AlertCircle, Lightbulb, Brain, RefreshCw, ArrowRight } from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const insights = [
  {
    id: '1',
    type: 'warning',
    title: 'High Priority Issues Accumulating',
    description: 'You have 8 high-priority issues that have been in progress for more than 5 days.',
    icon: AlertCircle,
    color: '#EF4444',
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Optimize Team Workflow',
    description: 'Implementing automated testing could reduce bug-related issues by 40%.',
    icon: Lightbulb,
    color: '#F59E0B',
  },
  {
    id: '3',
    type: 'positive',
    title: 'Team Productivity Improved',
    description: 'Your team completed 35% more issues this week compared to last week.',
    icon: TrendingUp,
    color: '#10B981',
  },
]

export default function InsightsPage() {
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
              <h1 className="text-3xl font-bold">AI Insights</h1>
              <p className="mt-1 text-muted-foreground">
                AI-powered analysis and recommendations
              </p>
            </div>
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-info/20 bg-info/5 p-4"
        >
          <div className="flex gap-3">
            <Brain className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-info">AI-Powered Analysis</p>
              <p className="text-sm text-info/80 mt-1">
                Our AI analyzes your project data to identify patterns and opportunities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Insights grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {insights.map((insight, idx) => {
            const Icon = insight.icon

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Card className="border-border/50 overflow-hidden">
                  <div
                    className="h-1 w-full"
                    style={{ backgroundColor: insight.color }}
                  />
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="rounded-lg p-3 flex-shrink-0"
                        style={{ backgroundColor: insight.color + '20' }}
                      >
                        <Icon className="h-6 w-6" style={{ color: insight.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>

                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {[
            { label: 'Average Resolution Time', value: '3.2 days', change: '↓ 15%' },
            { label: 'Team Velocity', value: '28 issues/week', change: '↑ 12%' },
            { label: 'Quality Score', value: '8.7/10', change: '↑ 5%' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <p className="text-xs text-success">{metric.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </LayoutShell>
  )
}
