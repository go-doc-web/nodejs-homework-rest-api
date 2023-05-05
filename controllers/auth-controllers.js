const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');

const { cntrWrapper } = require('../utils');
const { HttpError } = require('../helpers');

const { User } = require('../models/user');

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
  });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  user.token = token;
  await user.save();

  const userToSend = {
    email: user.email,
    subscription: user.subscription,
  };
  res.status(200).json({
    token,
    user: userToSend,
  });
};

const logout = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    //   Знаю что синтаксис httpError не правильній!
    return HttpError(401, 'Not authorized');
  }
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).json('logout succsess');
};

const getCurrent = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401, 'Not authorized');
  }
  const showedUserData = { email: user.email, subscription: user.subscription };
  res.status(200).json(showedUserData);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const image = await jimp.read(tempUpload);
  await image.cover(250, 250).write(resultUpload);

  await fs.unlink(tempUpload);

  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  register: cntrWrapper(register),
  login: cntrWrapper(login),
  getCurrent: cntrWrapper(getCurrent),
  logout: cntrWrapper(logout),
  updateAvatar: cntrWrapper(updateAvatar),
};
