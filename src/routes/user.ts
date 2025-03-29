import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // check all the required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Please input all the required fields'
            });
        }

        // get connection
        const connection = getConnection();
        const userRepository = connection.getRepository(User);

        // check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // create a new user
        const user = new User();
        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;

        // hash password
        await user.hashPassword();

        // save user
        const savedUser = await userRepository.save(user);

        // remove password from response
        const { password: _, ...userWithoutPassword } = savedUser;

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'User registration failed.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Login a user
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // get connection
        const connection = getConnection();
        const userRepository = connection.getRepository(User);

        // find user by email
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// get users
router.get('/', async (req: Request, res: Response) => {
    try {
        // GET CONNECTION FROM ormconfig.json
        const connection = getConnection();
        const userRepository = connection.getRepository(User);
        
        // GET ALL USERS
        const users = await userRepository.find();
        
        return res.status(200).json({ 
            success: true,
            message: 'Users retrieved successfully',
            users: users
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve users',
            error: error.message 
        });
    }
}
);  

// get user by id
router.get('/:id', async (req: Request, res: Response) => { 
    try {
        // GET CONNECTION FROM ormconfig.json
        const connection = getConnection();
        const userRepository = connection.getRepository(User);
        
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // CHECK IF USER EXIST
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ 
            success: true,
            message: 'User retrieved successfully',
            user: user
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve user',
            error: error.message 
        });
    }
}
);

// DELETE FUNCTIONALITY
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        // GET CONNECTION FROM ormconfig.json
        const connection = getConnection();
        const userRepository = connection.getRepository(User);
        
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // CHECK IF USER EXIST
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // PERFORM DELETIOn
        await userRepository.delete(userId);
        
        return res.status(200).json({ 
            success: true,
            message: 'User deleted successfully',
            deletedUserId: userId
        });
    } catch (error) {
        console.error('Deletion error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to delete user',
            error: error.message 
        });
    }
});

export default router;