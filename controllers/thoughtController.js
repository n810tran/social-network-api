const { Thought } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const allThoughts = await Thought.find({}).populate('reactions');
            res.json(allThoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getThoughtById(req, res) {
        try {
            const thoughtById = await Thought.findOne({ _id: req.params.thoughtId }).populate('Reactions');
            if (!thoughtById) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thoughtById);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            const updateUserNewThought = await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: {thoughts: newThought._id} },
                { new: true}
            )
            .populate('thoughts')
            .populate('friends')
            res.status(201).json(updateUserNewThought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            )
                .populate('reactions');
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const deleteThought = await Thought.findOneAndRemove({ _id: req.params.id });
            const deleteThoughtFromUser = await User.findOneAndUpdate(
                { thoughts : req.body.thoughtId},
                {$pull: {thoughts: req.params.thoughtId}},
                { new :true }
            )
            .populate('thoughts');

            if (!deleteThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json({ message: 'Thought deleted successfully' });
            res.json(deleteThoughtFromUser);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const newReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { new: true }
            );
            if (!newReaction) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(newReaction);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const deleteReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );
            if (!deleteReaction) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(deleteReaction);
        } catch (err) {
            res.status(400).json(err);
        }
    },
};
