const multer = require('multer');
const path = require('path');

// Storage config for uploads/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || 
      file.mimetype === 'application/pdf' || 
      file.mimetype.includes('document')) {
    cb(null, true);
  } else {
    cb(new Error('Not an accepted file type'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const singleDoc = upload.single('document'); // For lab results, patient docs

module.exports = { singleDoc };

