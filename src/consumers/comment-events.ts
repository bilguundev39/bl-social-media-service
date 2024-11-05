import { kafka } from '@/config/kafka-config'
import { eventHandler } from '@/handlers/event-handler'

export const startCommentEventConsumer = async (): Promise<void> => {
  const consumer = kafka.consumer({ groupId: 'comment-event-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'comment-events' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value !== null) {
        const data = JSON.parse(message.value?.toString())
        console.log('message from comment event topic ------->')
        await eventHandler(data)
      }
    }
  })
}
