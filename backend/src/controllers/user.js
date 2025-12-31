const userService = require('../services/userService');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const { status, data, error } = await userService.register({ username, email, password });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { status, data, error } = await userService.login({ email, password });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

const googleLoginOrRegister = async (req, res) => {
  const { token_id } = req.body;
  const { status, data, error } = await userService.googleLoginOrRegister({ token_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


const getProfile = async (req, res) => {
  const user_id = req.user_id;
  const { status, data, error } = await userService.getProfile({ user_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

const update = async (req, res) => {
  const { username, email, image, isNewImage } = req.body;
  const user_id = req.user_id;
  const { status, data, error } = await userService.update({
    user_id,
    username,
    email,
    image,
    isNewImage,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

const remove = async (req, res) => {
  const user_id = req.user_id;
  const { status, data, error } = await userService.remove({ user_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


module.exports = {
  register,
  login,
  googleLoginOrRegister,
  getProfile,
  update,
  remove,
};
