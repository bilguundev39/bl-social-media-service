import logger from '@/utils/logger'
import { CommentMessage, CommentService } from './types'
import { Comment } from '@/models/comment'
import kafka from '@/producer/producer'
import { MessagePayload } from '@/producer/types'

type ServiceType = CommentService['create']
export const createService: ServiceType = async (message: CommentMessage): ReturnType<ServiceType> => {
  try {
    if (process.env.POST_EVENT_TOPIC === null || process.env.POST_EVENT_TOPIC === undefined) {
      throw new Error('POST_EVENT_TOPIC must be set in .env')
    }

    const topic = process.env.POST_EVENT_TOPIC
    const comment = new Comment({
      postId: message.postId,
      content: message.content,
      creator: message.creator,
      createdAt: new Date()
    })

    const savedComment = await comment.save()
    logger.info(`Comment saved succesfully: commentId: ${savedComment._id.toString()}`)

    const payload: MessagePayload = {
      event: 'EVENT_RECONCILE_POST_COMMENT',
      data: {
        postId: comment.postId,
        commentId: savedComment._id.toString(),
        operation: 'add'
      }
    }

    await kafka.produceMessage(payload, topic)
    console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(payload)}`)
  } catch (error) {
    logger.error('Failed to create Comment: ', error)
  }
}

export default createService
