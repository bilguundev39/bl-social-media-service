import mongoose from 'mongoose'
import { startImageEventConsumer } from './consumers/image-events'
import { startCommentEventConsumer } from './consumers/comment-events'
import { startPostEventConsumer } from './consumers/post-events'
import kafka from './producer/producer'

export default async function startService (): Promise<void> {
  if (process.env.MONGO_URL === null || process.env.MONGO_URL === undefined) {
    throw new Error('mongo url must be configured env var')
  }

  // init kafka
  await kafka.init()

  // starting event consumers
  await startImageEventConsumer()
  await startCommentEventConsumer()
  await startPostEventConsumer()

  await mongoose.connect(process.env.MONGO_URL)
}
