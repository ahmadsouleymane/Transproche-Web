import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const createStorage = (folder: string) => {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, `../../uploads/${folder}`));
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
};

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'));
  }
};

export const uploadLogo = multer({
  storage: createStorage('logos'),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadAd = multer({
  storage: createStorage('ads'),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
