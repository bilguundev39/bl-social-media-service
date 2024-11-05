import envFile from './src/config/load-env'
import startService from '@/start-service'

console.log(`Environment variables loaded from ${envFile}`)

startService().then(() => {
  console.log('Social media service has started...')
}).catch((error) => {
  console.error('Cannot start social media service', error)
})
