import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';  

const router = Router();

// CREATE NEW USER
router.post('/', async (req: Request, res: Response) => {
    try {
        console.log('POST /users route hit');
        const connection = getConnection();
        const userRepository = connection.getRepository(User);
      
        const newUser = userRepository.create(req.body);
        
        // SAVE TO DB
        const savedUser = await userRepository.save(newUser);
        
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: savedUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
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


// LOGIN USER
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const connection = getConnection();
        const userRepository = connection.getRepository(User);
        
        // FIND USER BY EMAIL
        const user = await userRepository.findOneBy({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // IMPLEMENTATION OF BCRYPT FOR PASSWORD HASHING
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name 
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// NAG ADD KOG UPDATE FOR HASH PASSWORD
router.post('/', async (req: Request, res: Response) => {
    try {
        const connection = getConnection();
        const userRepository = connection.getRepository(User);
        
        // HERE
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword
        };
        
        const newUser = userRepository.create(userData);
        const savedUser = await userRepository.save(newUser);
        
        const { password, ...userWithoutPassword } = savedUser;
        
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});