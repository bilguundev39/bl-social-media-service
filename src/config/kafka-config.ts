import { Kafka } from 'kafkajs'

interface IKafkaConfig {
  brokers: string[]
  clientId: string
}

const kafkaConfig = (): IKafkaConfig => {
  const brokers = (process.env.KAFKA_BROKERS !== null && process.env.KAFKA_BROKERS !== undefined) ? process.env.KAFKA_BROKERS.split(',') : []
  const clientId = process.env.KAFKA_CLIENT_ID ?? 'API_SERVER'

  return {
    brokers,
    clientId
  }
}

export const kafka = new Kafka(kafkaConfig())
