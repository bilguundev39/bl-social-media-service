import logger from '@/utils/logger'
import { CommentService, DeleteCommentMessage } from './types'
import { Comment } from '@/models/comment'
import { MessagePayload } from '@/producer/types'
import kafka from '@/producer/producer'
import mongoose from 'mongoose';

type ServiceType = CommentService['delete']
export const deleteService: ServiceType = async (message: DeleteCommentMessage): ReturnType<ServiceType> => {
  try {
    if (process.env.POST_EVENT_TOPIC === null || process.env.POST_EVENT_TOPIC === undefined) {
      throw new Error('POST_EVENT_TOPIC must set in env')
    }

    const topic = process.env.POST_EVENT_TOPIC
    const result = await Comment.deleteOne({ _id: new mongoose.Types.ObjectId(message.commentId) })
    if (result.deletedCount === 0) {
      throw new Error('delete operation failed')
    }

    const payload: MessagePayload = {
      event: 'EVENT_RECONCILE_POST_COMMENT',
      data: {
        postId: message.postId,
        commentId: message.commentId.toString(),
        operation: 'remove'
      }
    }

    logger.info(`Comment deleted succesfully, creator: ${message.creator}, postId: ${message.postId}`)
    await kafka.produceMessage(payload, topic)
    console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(payload)}`)
  } catch (error) {
    logger.error('Failed to delete Comment: ', error)
  }
}

export default deleteService
