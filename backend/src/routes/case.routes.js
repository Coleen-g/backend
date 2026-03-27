const express    = require('express');
const router     = express.Router();
const caseController = require('../controllers/case.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { uploadCase } = require('../config/cloudinary');

// ── Staff/Admin routes
router.get('/',           protect, caseController.getAllCases);
router.get('/stats',      protect, caseController.getCaseStats);
router.get('/trend',      protect, caseController.getCaseTrend);

// ── Mobile route — must come BEFORE /:id
router.get('/my',         protect, caseController.getMyCases);

// ── CRUD with optional file upload
// ✅ Wrapped multer in error handler to catch silent crashes
router.post('/', protect, (req, res, next) => {
  uploadCase.single('document')(req, res, (err) => {
    if (err) {
      console.error('=== Multer/Cloudinary Upload Error ===');
      console.error('Error:', err);
      console.error('Message:', err.message);
      return res.status(500).json({ message: 'File upload error: ' + err.message });
    }
    console.log('=== Upload middleware passed ===');
    console.log('File:', req.file);
    console.log('Body keys:', Object.keys(req.body));
    next();
  });
}, caseController.createCase);

router.get('/:id',        protect, caseController.getCaseById);
router.put('/:id',        protect, uploadCase.single('document'), caseController.updateCase);
router.delete('/:id',     protect, caseController.deleteCase);

module.exports = router;