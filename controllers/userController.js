const { User } = require('../models');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find({})
            .populate('thoughts');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts')
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const newUser = await User.create(
                {
                    username: req.body.username,
                    email:req.body.email
                }
            );
            res.status(201).json(newUser);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const updateUser = await User.findOneAndUpdate(
                { _id: req.params.userId }, 
                { $set: req.body}, 
                { new: true });
            if (!updateUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updateUser);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const findDeleteUser = await User.findById(req.params.userId)
            const deleteThoughts = await Thought.deleteMany(findDeleteUser.username)
            const deleteUser = await User.deleteOne({_id: req.params.userId})
            if (!deleteUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const addFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );
            if (!addFriend) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(addFriend);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteFriend(req, res) {
        try {
            const deleteFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )
            .populate('thoughts')
            .populate('friends');
            if (!deleteFriend) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(deleteFriend);
        } catch (err) {
            res.status(400).json(err);
        }
    },
}