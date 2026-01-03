export interface ImageRequest {
  prompt: string
  /**
   * The selected art style. Even if the prompt compiler uses this
   * internally, we still accept it as part of the request to satisfy
   * validation and allow the API to assemble a final prompt. If the client
   * wants no style influence they should send an empty string.
   */
  style: string
  /**
   * How strongly the style should influence the final image. This should
   * range from 0–100 inclusive. Higher numbers mean a stronger emphasis on
   * the art style when compiling the prompt.
   */
  strength: number
}

export interface ImageResponse {
  imageUrl: string
}
