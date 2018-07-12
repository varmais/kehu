const express = require("express");
const router = express.Router();
const TagService = require("../../services/TagService");

router.get("/tags", async (req, res) => {
  const tags = await TagService.getTags();
  res.json(tags.map(t => t.text));
});

module.exports = router;