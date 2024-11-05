import createCommentService from 'services/comment/create'
import deleteCommentService from 'services/comment/delete'
import createPostService from 'services/post/create'
import reconcilePostComment from 'services/post/reconcile-comment'
import resizeImageService from 'services/image/resize'

interface EventMessage {
  event: string
  data: any
}

const registeredHandlers: Record<string, (data: any) => Promise<void>> = {
  EVENT_ADD_COMMENT: createCommentService,
  EVENT_DELETE_COMMENT: deleteCommentService,
  EVENT_ADD_POST: createPostService,
  EVENT_RECONCILE_POST_COMMENT: reconcilePostComment,
  EVENT_RESIZE_IMAGE: resizeImageService
}

export const eventHandler = async (message: EventMessage): Promise<void> => {
  const { event, data } = message

  const handler = registeredHandlers[event]
  if (handler !== undefined) {
    await handler(data)
  } else {
    console.warn(`No handler for event type: ${event}`)
  }
}
