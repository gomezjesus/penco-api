const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());
const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
];
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("Course not found");

  res.json(course);
  //api/courses/:id?sortBy=name
  //res.send(req.query.sortBy);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.json(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});
const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () =>
  console.log(`Listening on port ${port}...`)
);

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}
