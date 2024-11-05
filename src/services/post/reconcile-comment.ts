import logger from '@/utils/logger'
import { PostService, ReconcileCommentMessage } from './types'
import { Post } from '@/models/post'

type ServiceType = PostService['reconcileComment']
export const reconcileCommenService: ServiceType = async (message: ReconcileCommentMessage): ReturnType<ServiceType> => {
  try {
    let aggregate = {}
    if (message.operation === 'add') {
      aggregate = {
        $push: { comments: message.commentId },
        $inc: { commentCounts: 1 }
      }
    }

    if (message.operation === 'remove') {
      aggregate = {
        $pull: { comments: message.commentId },
        $inc: { commentCounts: -1 }
      }
    }

    await Post.findOneAndUpdate({ _id: message.postId }, aggregate)

    logger.info('Succesfully reconciled')
  } catch (error) {
    logger.error('Failed to reconcile Post: ', error)
  }
}

export default reconcileCommenService
