export default function ImageLoader({ src, width, quality }) {
  return `http://localhost:3000/${src}?w=${width}`;
}
