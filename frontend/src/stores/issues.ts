import { create } from 'zustand'
import { Issue } from '@/lib/schemas'

interface IssuesState {
  issues: Issue[]
  selectedIssue: Issue | null
  isLoading: boolean
  filters: {
    status?: string
    priority?: string
    assignee?: string
    search?: string
  }

  setIssues: (issues: Issue[]) => void
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, issue: Partial<Issue>) => void
  deleteIssue: (id: string) => void
  setSelectedIssue: (issue: Issue | null) => void
  setLoading: (loading: boolean) => void
  setFilters: (filters: Partial<IssuesState['filters']>) => void
  clearFilters: () => void
}

export const useIssuesStore = create<IssuesState>((set) => ({
  issues: [],
  selectedIssue: null,
  isLoading: false,
  filters: {},

  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (id, updatedData) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, ...updatedData } : i)),
      selectedIssue:
        state.selectedIssue?.id === id
          ? { ...state.selectedIssue, ...updatedData }
          : state.selectedIssue,
    })),
  deleteIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id),
      selectedIssue: state.selectedIssue?.id === id ? null : state.selectedIssue,
    })),
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
}))
