const express = require("express");
const app = express();
const ejs = require("ejs");
const data = require('./date');
let items = [];
let workItems = [];
// let items = ["Reading","Sleeping", "Coding"];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  const day = data.getDate();
  res.render("list", { ListTitle: day, newListItems: items });
});
app.post("/", (req, res) => {
  item = req.body.newItem;
  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { ListTitle: "Work List", newListItems: workItems });
});
app.get('/about', (req,res) =>{
  // res.sendFile(__dirname+"/views/about.ejs")
  res.render("about");
})
app.listen(3000, () => console.log("Server is listening to the port 3000"));
