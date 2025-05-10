import express from "express";
import User from "../model/user";

const userRouter = express.Router();

//get all users
userRouter.get("/", async (req: express.Request, res: express.Response):Promise<void> => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by Email
userRouter.get('/:email', async (req, res): Promise<void> => {
    try {
        const user = await User.findOne({email: req.params.email}).select('-password');

        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//login
userRouter.post("/login", async (req: express.Request, res: express.Response):Promise<void> => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const sendingUser = {
            email: user.email,
            name: user.name
        }

        if (user.password == req.body.password) {
            res.status(200).json({sendingUser})
        }else{
            res.status(401).json({error: 'Invalid Password'})
        }

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//register new user
userRouter.post("/register", async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        const existingUser = await User.findOne({email: req.body.email});

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const user = new User(req.body);

        let savedUser = await user.save();
        res.send(savedUser);

    }catch (error){
        console.log(error);
    }
});

//update user
userRouter.put("/:id", async (req, res):Promise<void> => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,  req.body, {new: true});

        if (!updateUser) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        res.status(204).json();

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//delete user
userRouter.delete("/:email", async (req: express.Request, res: express.Response):Promise<void> => {
    try {
        const user = await User.findOneAndDelete({email: req.params.email});

        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        res.status(204).json();

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default userRouter;