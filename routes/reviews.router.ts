const express = require("express")
const router = express.Router()
const reviewsCtrl = require("../controller/reviews.ctrl")

router.get("/", reviewsCtrl.getReview)

router.get("/:id", reviewsCtrl.getReviewById)

router.post("/", reviewsCtrl.addReview)

router.put("/:id", reviewsCtrl.updateReview)

router.delete("/:id", reviewsCtrl.deleteReview)

module.exports = router