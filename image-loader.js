export default function imageLoader({ src }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${src}`;
}
