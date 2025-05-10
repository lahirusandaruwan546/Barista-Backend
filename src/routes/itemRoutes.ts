import express from "express";
import Item from "../model/item";

const itemRouter = express.Router();

//get all items
itemRouter.get("/", async (req, res):Promise<void> => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving items", error });
    }
});

//get item by ID
itemRouter.get("/:id", async (req, res):Promise<void> => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            res.status(404).json({message: 'Item not found'});
            return
        }

        res.json(item);

    } catch (error) {
        res.status(500).json({ message: "Error retrieving item" });
    }
})

//add new item
itemRouter.post("/",  (req, res) => {
    try{
        const item = new Item(req.body);
        item.save()
            .then(r => res.send(r))
            .catch(e => res.send(e));
        console.log(item);
    }catch (error){
        console.log(error);
    }
});

//update item
itemRouter.put("/:id", async (req, res):Promise<void> => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!item) {
            res.status(404).json({message: 'Item not found'});
            return
        }

        res.status(204).json();

    } catch (error) {
        res.status(400).json({ message: "Item Update error" });
    }
});

//delete items
itemRouter.delete("/:id", async (req, res):Promise<void> => {
    try {
        const id  = req.params.id;

        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return
        }

        res.status(204).json();

    } catch (error) {
        res.status(500).json({ message: "Item delete error" });
    }
});

export default itemRouter;