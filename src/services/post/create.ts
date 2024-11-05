import { Post } from '@/models/post'
import { PostMessage, PostService } from './types'
import logger from '@/utils/logger'
import { MessagePayload } from '@/producer/types'
import kafka from '@/producer/producer';

type ServiceType = PostService['create']
export const createService: ServiceType = async (message: PostMessage): ReturnType<ServiceType> => {
  try {
    if (process.env.IMAGE_EVENT_TOPIC === null || process.env.IMAGE_EVENT_TOPIC === undefined) {
      throw new Error('IMAGE_EVENT_TOPIC must configured')
    }

    const post = new Post({
      caption: message.caption,
      body: message.body,
      creator: message.creator,
      createdAt: new Date(),
      comments: [],
      commentCounts: 0
    })

    const savedPost = await post.save()
    const topic = process.env.IMAGE_EVENT_TOPIC

    logger.info(`Post saved succesfully: postId: ${savedPost._id.toString()}`)

    const payload: MessagePayload = {
      event: 'EVENT_RESIZE_IMAGE',
      data: {
        postId: savedPost._id.toString(),
        url: message.body
      }
    }

    await kafka.produceMessage(payload, topic)
    console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(payload)}`)
  } catch (error) {
    logger.error('Failed to create Post: ', error)
  }
}

export default createService
