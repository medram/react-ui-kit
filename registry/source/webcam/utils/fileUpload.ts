export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",")
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], filename, { type: mime })
}

/** Center-crops any dataURL to an exact square JPEG and returns a new dataURL. */
export function cropToSquareDataUrl(
  dataUrl: string,
  width = 626,
  height = 626,
  quality = 0.95,
): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>()
  const img = new Image()
  img.onload = () => {
    try {
      const srcSize = Math.min(img.width, img.height)
      const sx = Math.max(0, (img.width - srcSize) / 2)
      const sy = Math.max(0, (img.height - srcSize) / 2)
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas not supported"))
        return
      }
      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", quality))
    } catch (e) {
      reject(e)
    }
  }
  img.onerror = () => reject(new Error("Failed to load image for cropping"))
  img.src = dataUrl
  return promise
}

async function resizeAndCropFileToSquare(file: File, size = 626): Promise<File> {
  const { promise, resolve, reject } = Promise.withResolvers<string>()
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = () => reject(new Error("Failed to read file"))
  reader.readAsDataURL(file)

  const dataUrl = await promise
  const cropped = await cropToSquareDataUrl(dataUrl, size, size, 0.95)
  const base = file.name.replace(/\.[^/.]+$/, "") || "upload"
  return dataURLtoFile(cropped, `${base}-cropped.jpeg`)
}
