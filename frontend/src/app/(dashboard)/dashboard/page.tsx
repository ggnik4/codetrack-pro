'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Mon', issues: 12, completed: 8 },
  { name: 'Tue', issues: 19, completed: 12 },
  { name: 'Wed', issues: 15, completed: 10 },
  { name: 'Thu', issues: 22, completed: 18 },
  { name: 'Fri', issues: 28, completed: 24 },
  { name: 'Sat', issues: 18, completed: 15 },
  { name: 'Sun', issues: 14, completed: 12 },
]

const stats = [
  {
    title: 'Total Issues',
    value: '124',
    change: '+12%',
    icon: AlertCircle,
    color: '#60A5FA',
  },
  {
    title: 'Completed',
    value: '89',
    change: '+8%',
    icon: CheckCircle,
    color: '#10B981',
  },
  {
    title: 'In Progress',
    value: '24',
    change: '+4%',
    icon: TrendingUp,
    color: '#F59E0B',
  },
  {
    title: 'Team Members',
    value: '12',
    change: '+2',
    icon: Users,
    color: '#8B5CF6',
  },
]

export default function DashboardPage() {
  return (
    <LayoutShell>
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here's your project overview.</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        <p className="text-xs text-success mt-1">{stat.change} from last week</p>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ backgroundColor: stat.color + '20' }}
                      >
                        <Icon className="h-6 w-6" style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Issues chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Issues Trend</CardTitle>
              <CardDescription>Weekly issue activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Issues completed vs created</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="completed" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="issues" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Created issue', target: 'Fix authentication bug', time: '2 hours ago' },
                  { action: 'Completed issue', target: 'Add dark mode support', time: '4 hours ago' },
                  { action: 'Assigned to', target: 'API rate limiting', time: '1 day ago' },
                  { action: 'Updated project', target: 'CodeTrack Pro', time: '2 days ago' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.target}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </LayoutShell>
  )
}
