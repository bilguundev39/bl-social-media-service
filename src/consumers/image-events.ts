import { kafka } from '@/config/kafka-config'
import { eventHandler } from '@/handlers/event-handler'

export const startImageEventConsumer = async (): Promise<void> => {
  const consumer = kafka.consumer({ groupId: 'image-event-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'image-events' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value !== null) {
        const data = JSON.parse(message.value?.toString())
        console.log('message from image processor consumer ------->')
        console.log(data)
        await eventHandler(data)
      }
    }
  })
}
