import { kafka } from '@/config/kafka-config'
import { eventHandler } from '@/handlers/event-handler'

export const startPostEventConsumer = async (): Promise<void> => {
  const consumer = kafka.consumer({ groupId: 'post-event-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'post-events' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value !== null) {
        const data = JSON.parse(message.value?.toString())
        console.log('message from post event topic ------->')
        console.log(data)
        await eventHandler(data)
      }
    }
  })
}
