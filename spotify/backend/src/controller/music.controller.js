const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const mongoose = require("mongoose");
const { uploadFile } = require("../services/storage.service");


async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }
  if (!file || !file.buffer) {
    return res.status(400).json({ message: "music file is required" });
  }

  try {
    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user._id,
    });
    return res.status(201).json({
      message: "music created succesfully ",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.error("createMusic error:", err.message);
    return res.status(500).json({ message: "failed to upload music" });
  }
}

async function createAlbum(req,res){
  const { title } = req.body;
  let { musics } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (typeof musics === "undefined" || musics === null || musics === "") {
    musics = [];
  } else if (typeof musics === "string") {
    try {
      const parsed = JSON.parse(musics);
      musics = Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      musics = [musics];
    }
  }

  if (!Array.isArray(musics)) {
    return res.status(400).json({ message: "musics must be an array (or JSON array string) of music ids" });
  }

  const invalidIds = musics.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    return res.status(400).json({ message: "one or more music ids are invalid" });
  }

  try {
    const album = await albumModel.create({
      title,
      musics,
      artist: req.user._id,
    });

    return res.status(201).json({
      message: "album created successfully",
      album: {
        id: album._id,
        title: album.title,
        musics: album.musics,
        artist: album.artist,
      },
    });
  } catch (err) {
    console.error("createAlbum error:", err.message);
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "failed to create album", error: err.message });
  }
}

async function getAllMusics(req,res){
  const musics =  await musicModel.find() 
  .limit(10)
  .populate("artist", "username email");

  res.status(200).json({
    message : "music fetched successfully",
    musics : musics
  })
}

async function getAllAlbums(req,res){
  const albums =  await albumModel.find().select("title artist").populate("artist", "username email");

  res.status(200).json({
    message : "album fetched successfully",
    albums : albums
  })
}

async function getAlbum(req, res) {
  const { albumId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    return res.status(400).json({ message: "invalid album id" });
  }

  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics", "title uri artist");

  if (!album) {
    return res.status(404).json({ message: "album not found" });
  }

  return res.status(200).json({
    message: "album fetched successfully",
    album,
  });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;
  const album = await albumModel.findById(albumId).populate("artist", "username email");

  return res.status(200).json({
    message: "album fetched successfully",
    album,
  });
  }

module.exports = { createMusic ,createAlbum ,getAllMusics,getAllAlbums, getAlbum};
