import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer, { replaceWorkspace, starterStories, type WorkspaceState } from '../features/workspaceSlice'

const STORAGE_KEY = 'storytelling-workspace-v1'
const STORY_SEED_MIGRATION_KEY = 'storytelling-starter-stories-v2'

function loadWorkspace(): WorkspaceState | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return undefined
    const value: unknown = JSON.parse(saved)
    if (
      typeof value === 'object' &&
      value !== null &&
      'users' in value &&
      Array.isArray(value.users) &&
      'stories' in value &&
      Array.isArray(value.stories) &&
      'comments' in value &&
      Array.isArray(value.comments) &&
      'activeUserId' in value &&
      typeof value.activeUserId === 'string' &&
      'selectedStoryId' in value &&
      typeof value.selectedStoryId === 'string'
    ) {
      return value as WorkspaceState
    }
    console.error('Saved story workspace data is in an unsupported format.')
  } catch (error) {
    console.error('Unable to read saved story workspace.', error)
  }
  return undefined
}

function migrateWorkspace(): WorkspaceState | undefined {
  const workspace = loadWorkspace()
  if (localStorage.getItem(STORY_SEED_MIGRATION_KEY) === 'done') return workspace

  if (workspace) {
    const existingById = new Map(workspace.stories.map((story) => [story.id, story]))
    for (const starterStory of starterStories) {
      const existingStory = existingById.get(starterStory.id)
      if (!existingStory) {
        workspace.stories.push(starterStory)
      } else {
        existingStory.genre ??= starterStory.genre
        existingStory.cover ??= starterStory.cover
      }
    }
  }

  localStorage.setItem(STORY_SEED_MIGRATION_KEY, 'done')
  return workspace
}

const persistedWorkspace = migrateWorkspace()

export const store = configureStore({
  reducer: { workspace: workspaceReducer },
  ...(persistedWorkspace ? { preloadedState: { workspace: persistedWorkspace } } : {}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const channel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('storytelling-workspace')

let applyingRemoteUpdate = false

channel?.addEventListener('message', (event: MessageEvent<WorkspaceState>) => {
  const value = event.data
  if (
    !value ||
    !Array.isArray(value.users) ||
    !Array.isArray(value.stories) ||
    !Array.isArray(value.comments)
  ) {
    return
  }

  applyingRemoteUpdate = true
  store.dispatch(replaceWorkspace(value))
  applyingRemoteUpdate = false
})

store.subscribe(() => {
  if (applyingRemoteUpdate) return

  try {
    const workspace = store.getState().workspace
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
    channel?.postMessage(workspace)
  } catch (error) {
    console.error('Unable to save or share workspace changes.', error)
  }
})

window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return
  try {
    const value: unknown = JSON.parse(event.newValue)
    if (
      typeof value === 'object' &&
      value !== null &&
      'users' in value &&
      Array.isArray(value.users) &&
      'stories' in value &&
      Array.isArray(value.stories) &&
      'comments' in value &&
      Array.isArray(value.comments)
    ) {
      applyingRemoteUpdate = true
      store.dispatch(replaceWorkspace(value as WorkspaceState))
      applyingRemoteUpdate = false
    }
  } catch (error) {
    console.error('Unable to sync story workspace across tabs.', error)
  }
})
