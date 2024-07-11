const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/users.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

let port = 8080;

app.get("/user", (req, res) => {
  res.render("index.ejs");
});

app.get("/user/registration", (req, res) => {
  res.render("registration.ejs");
});

app.post("/user/registration", async (req, res) => {
  let { user, email, password } = req.body;
  let userDetail = new User({
    user: user,
    email: email,
    password: password,
  });
  let detail = await User.findOne({ email: email });
  if (detail) {
    res.send("Dublicate Entry!");
  } else {
    userDetail
      .save()
      .then((rest) => {
        res.redirect("/user");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
});

app.get("/user/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/user/login", async (req, res) => {
  let { user, password } = req.body;
  let detail = await User.findOne({ password: password, user: user });
  if (detail) {
    res.render("userpage.ejs", { user });
  } else {
    res.send("wrong detail entered!");
  }
});

app.get("/user/forgotpassword", (req, res) => {
  res.render("forgot.ejs");
});

app.patch("/user/forgot", async (req, res) => {
  let { email, newpassword } = req.body;
  let detail = await User.findOneAndUpdate(
    { email: email },
    { password: newpassword },
    { runValidators: true },
    { new: true }
  );
  if (detail) {
    res.redirect("/user");
  } else {
    res.send("Wrong email Entered!");
  }
});

main()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/twitter");
}

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
