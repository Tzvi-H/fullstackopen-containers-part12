const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis/index");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* GET todo with matching params id listing. */
router.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.send(todo);
});

/* PUT todo with matching params id listing. */
router.put("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.text = req.body.text;
  todo.done = req.body.done !== undefined ? req.body.done : todo.done;
  await todo.save();
  res.send(todo);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
  let count = await getAsync("added_todos");
  count = Number(count) || 0;
  await setAsync("added_todos", count + 1);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  res.sendStatus(405); // Implement this
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
