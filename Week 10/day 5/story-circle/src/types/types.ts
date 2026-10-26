export interface User {
  id: number
  email: string
  displayName: string
  bio: string
  avatarUrl: string
}

export interface Story {
  id: number
  title: string
  content: string
  category: string
  visibility: 'private' | 'public'
  version: number
  commentsEnabled: boolean
  createdAt: string
  updatedAt: string
  ownerId: number
  ownerName: string
}

export interface Comment {
  id: number
  body: string
  created_at: string
  updated_at: string
  user_id: number
  display_name?: string
  avatar_url?: string
}

export interface StoryVersion {
  id: number
  version: number
  title: string
  content: string
  created_at: string
  editor_name: string
}

export interface Collaborator {
  id: number
  email: string
  display_name: string
  avatar_url: string
}

export interface StoryDetails {
  story: Story
  comments: Comment[]
  versions: StoryVersion[]
  collaborators: Collaborator[]
  canEdit: boolean
}
