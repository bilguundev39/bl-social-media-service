export interface ImageMessage {
  url: string
  postId: string
}

export interface ImageService {
  resize: (image: ImageMessage) => Promise<void>
}
