import logger from '@/utils/logger'
import { ImageMessage, ImageService } from './types'
import axios from 'axios'
import sharp from 'sharp'

type ServiceType = ImageService['resize']
export const resizeService: ServiceType = async (message: ImageMessage): ReturnType<ServiceType> => {
  try {
    const height = process.env.IMAGE_RESIZE_HEIGHT ?? 600
    const width = process.env.IMAGE_RESIZE_WIDTH ?? 600

    // download image from file server
    const response = await axios.get(message.url, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(response.data)

    const resized = await sharp(imageBuffer)
    .rotate()
    .resize(Number(width), Number(height), {
        fit: 'inside', 
        withoutEnlargement: true, 
    })
    .toFormat('jpg')
    .toBuffer();


    const filename = message.url.substring(message.url.lastIndexOf('/') + 1)
    const dotIndex = filename.lastIndexOf('.')
    const fileId = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename
    const uploadUrl = (process.env.UPLOAD_URL ?? 'http://localhost:3000/api/upload/').concat(fileId)

    await axios.post(uploadUrl, resized, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': resized.length,
        referer: 'social-media-service'
      }
    })

    // update post information body field with resized image url
    
    logger.info(`Image succesfully resized url: ${message.url}`)
  } catch (error) {
    logger.error('Failed to resize image: ', error)
  }
}

export default resizeService
