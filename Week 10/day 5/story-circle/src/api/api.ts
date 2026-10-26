import type { Story, StoryDetails, User } from '../types/types'

interface ApiError {
  error?: string
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return undefined as T
  const payload = await response.json() as T & ApiError
  if (!response.ok) throw new Error(payload.error || 'Something went wrong. Please try again.')
  return payload
}

export const api = {
  me: async () => (await request<{ user: User }>('/api/auth/me')).user,
  signIn: (values: { email: string; password: string; displayName?: string }, register: boolean) =>
    request<{ user: User }>(`/api/auth/${register ? 'register' : 'login'}`, {
      method: 'POST',
      body: JSON.stringify(values),
    }),
  requestPasswordReset: (email: string) =>
    request<{ message: string; resetUrl?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  signOut: () => request<void>('/api/auth/logout', { method: 'POST' }),
  updateProfile: (values: Pick<User, 'displayName' | 'bio' | 'avatarUrl'>) =>
    request<{ user: User }>('/api/auth/me', { method: 'PATCH', body: JSON.stringify(values) }),
  stories: async () => (await request<{ stories: Story[] }>('/api/stories')).stories,
  story: (id: number) => request<StoryDetails>(`/api/stories/${id}`),
  createStory: (title: string) =>
    request<{ story: Story }>('/api/stories', {
      method: 'POST',
      body: JSON.stringify({ title, content: '', visibility: 'private' }),
    }),
  updateStory: (story: Story, changes: Pick<Story, 'title' | 'content' | 'visibility' | 'commentsEnabled'>) =>
    request<{ story: Story }>(`/api/stories/${story.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...changes, version: story.version }),
    }),
  deleteStory: (id: number) => request<void>(`/api/stories/${id}`, { method: 'DELETE' }),
  addCollaborator: (id: number, email: string) =>
    request<{ collaborator: { id: number; display_name: string; email: string } }>(
      `/api/stories/${id}/collaborators`,
      { method: 'POST', body: JSON.stringify({ email }) },
    ),
  removeCollaborator: (storyId: number, userId: number) =>
    request<void>(`/api/stories/${storyId}/collaborators/${userId}`, { method: 'DELETE' }),
  addComment: (storyId: number, body: string) =>
    request<void>(`/api/stories/${storyId}/comments`, { method: 'POST', body: JSON.stringify({ body }) }),
  updateComment: (storyId: number, commentId: number, body: string) =>
    request<void>(`/api/stories/${storyId}/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    }),
  deleteComment: (storyId: number, commentId: number) =>
    request<void>(`/api/stories/${storyId}/comments/${commentId}`, { method: 'DELETE' }),
  restoreVersion: (storyId: number, version: number) =>
    request<{ story: Story }>(`/api/stories/${storyId}/versions/${version}/restore`, { method: 'POST' }),
}
