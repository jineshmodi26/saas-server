const express = require("express")
const router = express.Router()
const moviesCtrl = require("../controller/movies.ctrl")

router.get("/", moviesCtrl.getMovie)

router.get("/:id", moviesCtrl.getMovieById)

router.post("/", moviesCtrl.addMovie)

router.put("/:id", moviesCtrl.updateMovie)

router.delete("/:id", moviesCtrl.deleteMovie)

module.exports = router