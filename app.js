const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require('mongoose');
// let items = [];
// let workItems = [];
// let items = ["Reading","Sleeping", "Coding"]; 

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name : "Welcome to our todolist"
});
const item2 = new Item({
  name : "Hit the button + to add a new item"
});
const item3 = new Item({
  name : "Check the box to delete items"
});

const defaultItems = [item1, item2, item3];
// Item.insertMany(defaultItems, (err) => {

//   if (err) throw err;
//   else {console.log("Successfully save default items to DB")};
// });



app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) =>{
    if (foundItems.length===0) {
      Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { ListTitle: "Today", newListItems: foundItems});
    }
  })
});
app.post("/", (req, res) => {
  itemName = req.body.newItem;
  const item = new Item({
    name : itemName
  });
  item.save();
  res.redirect("/");
  // if (req.body.list === "Work List") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete", (req,res) =>{
  const deleteItems = req.body.checkbox; //checkedItemId
  Item.findByIdAndDelete(deleteItems, (err) =>{
    if (err) throw err;
  });
  res.redirect("/");
})

app.get("/:topic", (req, res) => {
  const topicList = req.params.topic;
  res.render("list", { ListTitle: topicList, newListItems: workItems });
});
app.get('/about', (req,res) =>{
  // res.sendFile(__dirname+"/views/about.ejs")
  res.render("about");
})
app.listen(3000, () => console.log("Server is listening to the port 3000"));
