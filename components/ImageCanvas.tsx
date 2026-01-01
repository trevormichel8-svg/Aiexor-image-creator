import { memo } from "react"

function ImageCanvas({ src }: { src: string }) {
  return <img src={src} alt="Generated" />
}

export default memo(ImageCanvas)
