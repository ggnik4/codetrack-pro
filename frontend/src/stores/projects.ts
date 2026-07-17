import { create } from 'zustand'
import { Project } from '@/lib/schemas'

interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean

  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  setSelectedProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updatedData) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
      selectedProject:
        state.selectedProject?.id === id
          ? { ...state.selectedProject, ...updatedData }
          : state.selectedProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
    })),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setLoading: (isLoading) => set({ isLoading }),
}))
