import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Collaborator {
  id: string
  name: string
  handle: string
  avatar: string
  color: string
  bio: string
}

export interface StoryVersion {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  label: string
}

export interface StoryComment {
  id: string
  storyId: string
  authorId: string
  text: string
  createdAt: string
  reactions: Record<string, string[]>
}

export interface Story {
  id: string
  title: string
  content: string
  authorId: string
  collaboratorIds: string[]
  commentsEnabled: boolean
  updatedAt: string
  versions: StoryVersion[]
  genre?: string
  cover?: string
}

export interface WorkspaceState {
  users: Collaborator[]
  stories: Story[]
  comments: StoryComment[]
  activeUserId: string
  selectedStoryId: string
}

const now = new Date().toISOString()

const collaborators: Collaborator[] = [
  { id: 'maya', name: 'Maya Chen', handle: 'mayawrites', avatar: 'MC', color: '#bd8066', bio: 'Collector of small moments and big ideas.' },
  { id: 'leo', name: 'Leo Martinez', handle: 'leomakes', avatar: 'LM', color: '#738b70', bio: 'Writing my way through the in-between.' },
  { id: 'amara', name: 'Amara Okafor', handle: 'amarao', avatar: 'AO', color: '#a78c56', bio: 'Stories rooted in place, memory, and magic.' },
  { id: 'jules', name: 'Jules Park', handle: 'julespark', avatar: 'JP', color: '#8877a0', bio: 'Daydreamer, night editor, always revising.' },
]

const initialState: WorkspaceState = {
  users: collaborators,
  activeUserId: 'maya',
  selectedStoryId: 'story-1',
  stories: [
    {
      id: 'story-1',
      title: 'The little shop at the end of the rain',
      content: `The rain always stopped one street before the sea.\n\nNora had noticed this on her first morning in Bellweather, when the clouds rolled back like a curtain and left the harbor shining under a sudden blue sky. On the corner of Gull Street, a narrow green door stood open. Above it, a hand-painted sign swung in the breeze: THE WEATHER SHOP.\n\nInside, jars lined every wall. Each held a different kind of day: a soft April drizzle, the last gold light of October, a thunderstorm that smelled like warm pavement. Behind the counter, an old woman looked up from her knitting.\n\n“You’re right on time,” she said.\n\nNora glanced at the clock. It had no hands. “For what?”\n\nThe woman smiled and placed a small glass jar between them. Inside it, the rain was falling upward.\n\n“For the day you came back.”`,
      authorId: 'maya',
      collaboratorIds: ['leo', 'amara'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Magical realism',
      cover: 'cover--rain',
      versions: [
        { id: 'v-1', title: 'The little shop at the end of the rain', content: `The rain always stopped one street before the sea.\n\nNora had noticed this on her first morning in Bellweather. On the corner of Gull Street, a narrow green door stood open. Above it, a hand-painted sign swung in the breeze: THE WEATHER SHOP.\n\nInside, jars lined every wall. Each held a different kind of day.\n\n“You’re right on time,” the old woman said.\n\nNora glanced at the clock. It had no hands. “For what?”`, authorId: 'maya', createdAt: now, label: 'First draft' },
      ],
    },
    {
      id: 'story-2',
      title: 'A map of the things we left behind',
      content: `When the old train station was finally demolished, they found a map tucked beneath the platform clock.\n\nIt was drawn in blue pencil, on the back of a summer timetable. There were no roads, no rivers, no towns. Instead, each mark named a thing someone had left behind: a red mitten, a promise, the sound of a brother laughing from the next room.\n\nAt the very bottom, in handwriting she knew, was her own name.`,
      authorId: 'leo',
      collaboratorIds: ['maya'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Literary fiction',
      cover: 'cover--map',
      versions: [],
    },
    {
      id: 'story-3',
      title: 'The moon keeps a garden',
      content: `Every night, while the city slept, the moon watered her garden with silver light.\n\nShe grew small, bright things there: wishes people had almost made, songs that got stuck in the throat, and all the brave words saved for another day.\n\nOne evening, a little paper boat drifted up through the clouds. Inside was a note: I think I'm ready now.`,
      authorId: 'amara',
      collaboratorIds: ['jules'],
      commentsEnabled: false,
      updatedAt: now,
      genre: 'Quiet fantasy',
      cover: 'cover--moon',
      versions: [],
    },
    {
      id: 'story-4',
      title: 'Postcards from the last lighthouse',
      content: `Every Thursday, Inez found a postcard wedged beneath the lighthouse door.\n\nNo stamp. No address. Only a few lines in blue ink, always describing a place she had never been: a café where the spoons hummed, a hill that remembered every footstep, a city where nobody was ever late.\n\nOn the seventh postcard, the handwriting changed.\n\nIt said, I am on my way home.\n\nInez read it twice, then looked out toward the fog. A small light answered from the far side of the water.`,
      authorId: 'jules',
      collaboratorIds: ['maya', 'leo'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Coastal mystery',
      cover: 'cover--lighthouse',
      versions: [],
    },
    {
      id: 'story-5',
      title: 'How to fold a thunderstorm',
      content: `Grandmother kept weather in the linen cupboard.\n\nNot the ordinary kind. Her storms came folded into neat blue squares, stacked between the winter sheets. When the garden needed water, she would unfold a drizzle. When the tomatoes sulked, she set a thunderhead loose above the greenhouse.\n\n“Every feeling is weather,” she told me, smoothing a crease from the sky. “And every kind of weather passes through.”\n\nI was twelve the first time she let me choose one.`,
      authorId: 'amara',
      collaboratorIds: ['maya'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Fable',
      cover: 'cover--storm',
      versions: [],
    },
    {
      id: 'story-6',
      title: 'The library of unfinished letters',
      content: `The library had no books, only letters people had written and never sent.\n\nThey were sorted by the thing left unsaid: apologies, invitations, small brave truths. At the back of the room, behind a curtain of dust, I found a drawer with my name on it.\n\nThere was one envelope inside. The paper was soft from being opened and closed a hundred times.\n\nI knew the handwriting before I knew the words.`,
      authorId: 'leo',
      collaboratorIds: ['amara', 'jules'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Tender fiction',
      cover: 'cover--letters',
      versions: [],
    },
    {
      id: 'story-7',
      title: 'Small astronomy for lost people',
      content: `On the roof of the apartment block, Mr. Sato taught the neighborhood children how to find their way by stars.\n\nHe never used the names from the atlas. He called one constellation The Way Back, another The Friend Who Waits, and the brightest one The Thing You Almost Gave Up On.\n\nWhen I asked how he knew so many, he handed me the telescope.\n\n“Everyone gets a sky,” he said. “You only need someone to point.”`,
      authorId: 'maya',
      collaboratorIds: ['jules'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Slice of life',
      cover: 'cover--stars',
      versions: [],
    },
    {
      id: 'story-8',
      title: 'The train that arrived on Tuesday',
      content: `At platform nine, the timetable listed a train that came only once a year.\n\nIt arrived on a Tuesday in late spring, carrying people who had missed one important moment and wanted to see what grew in its place. They stepped down with the same coats they had worn years ago, but with softer eyes.\n\nThe conductor asked me where I was going.\n\n“Forward,” I said.\n\nHe smiled. “That one makes a few stops.”`,
      authorId: 'jules',
      collaboratorIds: ['amara'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Magical realism',
      cover: 'cover--train',
      versions: [],
    },
    {
      id: 'story-9',
      title: 'A field guide to imaginary birds',
      content: `The hushwing appears just before a difficult conversation. It is small, ash-colored, and impossible to photograph.\n\nThe blue-hour lark nests in the gap between what you meant to say and what you said instead.\n\nAnd if you hear the bright, impossible trill of the homebird, stop walking. Somewhere, someone has kept a place for you.\n\nI have been collecting these sightings for years. The field guide is nearly full.`,
      authorId: 'amara',
      collaboratorIds: ['leo'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Speculative',
      cover: 'cover--birds',
      versions: [],
    },
    {
      id: 'story-10',
      title: 'Before the city wakes',
      content: `At 4:17 every morning, the baker and the bus driver met at the corner.\n\nNeither knew the other's name. They traded small things: a warm roll for a paper cup of tea, a nod for a story about the night shift. In the blue hour, the city belonged to them and the sparrows.\n\nOne morning, the corner was empty.\n\nOn the bakery step sat a paper bag, still warm, with a note tucked under the string: Your turn to rest. I've got the early route.`,
      authorId: 'leo',
      collaboratorIds: ['maya', 'jules'],
      commentsEnabled: true,
      updatedAt: now,
      genre: 'Everyday magic',
      cover: 'cover--morning',
      versions: [],
    },
  ],
  comments: [
    { id: 'comment-1', storyId: 'story-1', authorId: 'leo', text: '“The rain was falling upward” is such a lovely image. What if Nora recognizes the jar?', createdAt: now, reactions: { '✨': ['maya', 'amara'], '💛': ['maya'] } },
    { id: 'comment-2', storyId: 'story-1', authorId: 'amara', text: 'I can see this as the opening of a whole collection.', createdAt: now, reactions: { '✨': ['leo'] } },
  ],
}

export const starterStories = initialState.stories

function userFor(state: WorkspaceState, id: string) {
  return state.users.find((user) => user.id === id)
}

function stamp(): string {
  return new Date().toISOString()
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    replaceWorkspace(_state, action: PayloadAction<WorkspaceState>) {
      return action.payload
    },
    setActiveUser(state, action: PayloadAction<string>) {
      if (userFor(state, action.payload)) state.activeUserId = action.payload
    },
    setSelectedStory(state, action: PayloadAction<string>) {
      if (state.stories.some((story) => story.id === action.payload)) state.selectedStoryId = action.payload
    },
    createStory(state) {
      const user = userFor(state, state.activeUserId)
      if (!user) return
      const id = `story-${crypto.randomUUID()}`
      state.stories.unshift({
        id,
        title: 'Untitled story',
        content: '',
        authorId: user.id,
        collaboratorIds: [],
        commentsEnabled: true,
        updatedAt: stamp(),
        versions: [],
      })
      state.selectedStoryId = id
    },
    updateStory(state, action: PayloadAction<{ id: string; title?: string; content?: string }>) {
      const story = state.stories.find((item) => item.id === action.payload.id)
      if (!story) return
      if (action.payload.title !== undefined) story.title = action.payload.title
      if (action.payload.content !== undefined) story.content = action.payload.content
      story.updatedAt = stamp()
    },
    deleteStory(state, action: PayloadAction<string>) {
      state.stories = state.stories.filter((story) => story.id !== action.payload)
      state.comments = state.comments.filter((comment) => comment.storyId !== action.payload)
      if (state.selectedStoryId === action.payload) {
        state.selectedStoryId = state.stories[0]?.id ?? ''
      }
    },
    addCollaborator(state, action: PayloadAction<string>) {
      const story = state.stories.find((item) => item.id === state.selectedStoryId)
      if (!story || story.authorId === action.payload || story.collaboratorIds.includes(action.payload)) return
      if (userFor(state, action.payload)) story.collaboratorIds.push(action.payload)
      story.updatedAt = stamp()
    },
    toggleComments(state, action: PayloadAction<string>) {
      const story = state.stories.find((item) => item.id === action.payload)
      if (story) story.commentsEnabled = !story.commentsEnabled
    },
    saveVersion(state, action: PayloadAction<{ storyId: string; label: string }>) {
      const story = state.stories.find((item) => item.id === action.payload.storyId)
      if (!story) return
      story.versions.unshift({
        id: `version-${crypto.randomUUID()}`,
        title: story.title,
        content: story.content,
        authorId: state.activeUserId,
        createdAt: stamp(),
        label: action.payload.label.trim() || `Revision ${story.versions.length + 1}`,
      })
      story.updatedAt = stamp()
    },
    restoreVersion(state, action: PayloadAction<{ storyId: string; versionId: string }>) {
      const story = state.stories.find((item) => item.id === action.payload.storyId)
      const version = story?.versions.find((item) => item.id === action.payload.versionId)
      if (!story || !version) return
      story.versions.unshift({
        id: `version-${crypto.randomUUID()}`,
        title: story.title,
        content: story.content,
        authorId: state.activeUserId,
        createdAt: stamp(),
        label: 'Before restore',
      })
      story.title = version.title
      story.content = version.content
      story.updatedAt = stamp()
    },
    addComment(state, action: PayloadAction<{ storyId: string; text: string }>) {
      const story = state.stories.find((item) => item.id === action.payload.storyId)
      const text = action.payload.text.trim()
      if (!story?.commentsEnabled || !text) return
      state.comments.push({
        id: `comment-${crypto.randomUUID()}`,
        storyId: story.id,
        authorId: state.activeUserId,
        text,
        createdAt: stamp(),
        reactions: {},
      })
    },
    editComment(state, action: PayloadAction<{ commentId: string; text: string }>) {
      const comment = state.comments.find((item) => item.id === action.payload.commentId)
      if (comment?.authorId === state.activeUserId && action.payload.text.trim()) {
        comment.text = action.payload.text.trim()
      }
    },
    deleteComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload || comment.authorId !== state.activeUserId,
      )
    },
    toggleReaction(state, action: PayloadAction<{ commentId: string; emoji: string }>) {
      const comment = state.comments.find((item) => item.id === action.payload.commentId)
      if (!comment) return
      const users = comment.reactions[action.payload.emoji] ?? []
      comment.reactions[action.payload.emoji] = users.includes(state.activeUserId)
        ? users.filter((id) => id !== state.activeUserId)
        : [...users, state.activeUserId]
    },
    updateProfile(state, action: PayloadAction<{ name: string; bio: string }>) {
      const user = userFor(state, state.activeUserId)
      if (!user) return
      const name = action.payload.name.trim()
      if (name) {
        user.name = name.slice(0, 40)
        user.avatar = user.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join('')
      }
      user.bio = action.payload.bio.trim().slice(0, 120)
    },
  },
})

export const {
  replaceWorkspace,
  setActiveUser,
  setSelectedStory,
  createStory,
  updateStory,
  deleteStory,
  addCollaborator,
  toggleComments,
  saveVersion,
  restoreVersion,
  addComment,
  editComment,
  deleteComment,
  toggleReaction,
  updateProfile,
} = workspaceSlice.actions

export default workspaceSlice.reducer
