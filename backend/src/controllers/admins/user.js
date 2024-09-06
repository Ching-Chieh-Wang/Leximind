const userModel= require('../../models/user'); // Adjust path as needed

const getAll = async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getAll,
};
