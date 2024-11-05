
export interface CommentMessage {
  postId: string
  content: string
  creator: string
}

export interface DeleteCommentMessage {
    postId: string
    commentId: string,
    creator: string
}

export interface CommentService {
  create: (message: CommentMessage) => Promise<void>
  delete: (message: DeleteCommentMessage) => Promise<void>
}
