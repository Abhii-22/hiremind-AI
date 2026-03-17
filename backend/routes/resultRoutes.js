const express = require('express');
const resultController = require('../controllers/resultController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Result management
router.get('/', resultController.getUserResults);
router.get('/:id', resultController.getResultById);
router.post('/:id/share', resultController.shareResult);
router.delete('/:id', resultController.deleteResult);

// Result analytics
router.get('/analytics/overview', resultController.getResultAnalytics);
router.get('/analytics/progress', resultController.getProgressChart);
router.get('/analytics/comparison', resultController.getComparisonData);

// Export and sharing
router.get('/:id/export/pdf', resultController.exportToPDF);
router.get('/:id/export/json', resultController.exportToJSON);

module.exports = router;
