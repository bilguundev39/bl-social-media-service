
export interface PostMessage {
  caption: string
  body: string
  creator: string
}

export interface ReconcileCommentMessage {
  postId: string
  commentId: string
  operation: 'add' | 'remove'
}

export interface PostService {
  create: (postMessage: PostMessage) => Promise<void>
  reconcileComment: (message: ReconcileCommentMessage) => Promise<void>
}
