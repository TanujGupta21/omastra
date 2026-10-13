/**
 * Multer + Cloudinary upload middleware.
 *
 * Usage in routes:
 *   router.post('/products', upload.array('images', 5), ...)
 *   router.put('/products/:id', upload.single('image'), ...)
 *
 * Files are streamed directly to Cloudinary — nothing touches the local disk.
 */
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine folder by route context
    let folder = 'omastra/misc';
    if (req.baseUrl.includes('products')) folder = 'omastra/products';
    if (req.baseUrl.includes('categories')) folder = 'omastra/categories';
    if (req.baseUrl.includes('users')) folder = 'omastra/avatars';

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
});

module.exports = upload;
