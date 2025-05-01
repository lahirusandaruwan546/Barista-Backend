import express from "express";
import Customer from "../model/customer";

const customerRouter = express.Router();

//get all customers
customerRouter.get("/", async (req , res ):Promise<void> => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers' });
    }
});

//get customer by ID
customerRouter.get("/:id", async (req , res ):Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            res.status(400).json({ message: 'Customer not found' });
            return;
        }

        res.json(customer);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving customer' });
    }
})

//create a new customer
customerRouter.post("/register",  (req, res) => {
    try{
        const customer = new Customer(req.body);
        customer.save()
            .then(r => res.send(r))
            .catch(e =>res.send(e));
        console.log(customer);
    }catch (error){
        console.log(error);
    }
});

//update a customer
customerRouter.put("/:id", async (req, res):Promise<void> => {
    try {
        const id = req.params.id;
        const updateBody = req.body;

        const updatedCustomer =
            await Customer.findByIdAndUpdate(id, updateBody, { new: true });

        if (!updatedCustomer) {
            res.status(400).json({ message: 'Customer not found' });
            return;
        }

        res.status(204).json();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating customer' });
    }
});

//delete a customer
customerRouter.delete("/:id", async (req, res):Promise<void> => {
    try {
        const id = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(id)

        console.log("delete customer - ", deletedCustomer);

        if (!deletedCustomer) {
            res.status(400).json({ message: 'Customer not found' });
            return;
        }

        res.status(204).json();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting customer' });
    }
});

export default customerRouter;