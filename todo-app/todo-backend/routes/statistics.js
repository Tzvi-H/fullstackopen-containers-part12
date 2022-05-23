const express = require("express");
const router = express.Router();
const { getAsync } = require("../redis/index");

/* GET statistics. */
router.get("/", async (_, res) => {
  let count = await getAsync("added_todos");
  count = Number(count) || 0;
  res.json({
    added_todos: count,
  });
});

module.exports = router;
