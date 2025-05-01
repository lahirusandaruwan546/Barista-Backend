import express from "express";
import Order from "../model/order";

const orderRouter = express.Router();

//get all orders
orderRouter.get("/", async (req, res):Promise<void> => {
    try {
        const orders = await Order.find()
            .populate("customerId")
            .populate('orderItems.itemId');
        res.json(orders);
    }catch (error) {
        res.status(500).json({ message: 'Error getting order details' });
    }
});

//get order by ID
orderRouter.get("/:id", async (req, res):Promise<void> => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customerId")
            .populate("orderItems.itemId");

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.json(order);

    }catch (error) {
        res.status(500).json({ message: 'Error getting order details' });
    }
});

//Create new order
orderRouter.post("/", async (req, res):Promise<void> => {
    try {
        const {customerId, total, orderItems} = req.body;

        if (!customerId || !total || !orderItems || orderItems.length === 0) {
            res.status(400).json({ message: 'Invalid order data' });
            return;
        }

        const newOrder = new Order({
            customerId,
            total,
            orderItems
        });

        const saveOrder = await newOrder.save();
        res.status(201).json(saveOrder);

    }catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
});

export default orderRouter;