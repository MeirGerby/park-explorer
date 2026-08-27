type ParkImage = {
  id: string
  url: string
  caption?: string | null
}

type ParkImageGalleryProps = {
  images: ParkImage[]
  parkName: string
}

export function ParkImageGallery({
  images,
  parkName,
}: ParkImageGalleryProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={image.caption ?? parkName}
          className="aspect-video w-full rounded-md object-cover"
        />
      ))}
    </div>
  )
}