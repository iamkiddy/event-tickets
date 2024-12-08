/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.builder.io',
      'upload.wikimedia.org',
      'storage.googleapis.com',
      'player.vimeo.com',
      'vod-progressive.akamaized.net',
      'res.cloudinary.com'
    ],
  },
}

module.exports = nextConfig
