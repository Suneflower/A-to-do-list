const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
});
const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to our todolist",
});
const item2 = new Item({
  name: "Hit the button + to add a new item",
});
const item3 = new Item({
  name: "Check the box to delete items",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect(`/${customListName}`);
      } else {
        // const displayItems =foundList.items
        res.render("list", {
          ListTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { ListTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", (req, res) => {
  itemName = req.body.newItem;
  itemList = req.body.list;
  const item = new Item({
    name: itemName,
  });
  List.findOne({ name: itemList }, (err, foundList) => {
    if (itemList === "Today") {
      item.save();
      res.redirect("/");
    } else {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${itemList}`);
    }
  });
});

app.post("/delete", (req, res) => {
  const deleteItems = req.body.checkbox; //checkedItemId
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndDelete(deleteItems, (err) => {
      if (err) throw err;
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(   
      { name: listName },
      { $pull: { items: { _id: deleteItems } } },
      (err) => {
        if (err) throw err;
      }
    );
    // List.findOneAndDelete({name:listName},{ items: { _id: deleteItems } }, (err) =>{
    //   if (err) throw err ;
    // });
    res.redirect(`/${listName}`);
  }
});

app.get("/about", (req, res) => {
  // res.sendFile(__dirname+"/views/about.ejs")
  res.render("about");
});
app.listen(3000, () => console.log("Server is listening to the port 3000"));
