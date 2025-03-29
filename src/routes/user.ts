import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';

const router = Router();


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