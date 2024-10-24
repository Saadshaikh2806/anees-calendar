import Image from 'next/image';

export default function YourImageComponent() {
  return (
    <Image
      src="/1.webp"
      alt="Description of the image"
      width={500}
      height={300}
      style={{ width: '100%', height: 'auto' }} // This maintains the aspect ratio
    />
  );
}
