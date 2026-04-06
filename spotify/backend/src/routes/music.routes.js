const express = require('express');
const multer = require('multer');
const musicController = require('../controller/music.controller');
const { requireAuth, requireArtist } = require('../middlewares/auth.middleware');


const upload = multer({
  storage:multer.memoryStorage()
});


const router = express.Router();

router.post('/upload', requireAuth, requireArtist, upload.single('music'), musicController.createMusic);

router.post('/album', requireAuth, requireArtist, musicController.createAlbum);

router.get('/', requireAuth, musicController.getAllMusics);
router.get('/albums', requireAuth, musicController.getAllAlbums);

router.get("/albums/:albumId", requireAuth, musicController.getAlbum);

module.exports = router;
