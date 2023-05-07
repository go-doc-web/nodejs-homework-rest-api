const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const { cntrWrapper } = require("../utils");
const { HttpError, sendEmail } = require("../helpers");

const { User } = require("../models/user");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
    verificationToken,
  });
  const verify = {
    to: email,
    subject: "Confirm email",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Press to confirm email</a>`,
  };

  await sendEmail(verify);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to confirm the email</a>`,
  };

  await sendEmail(mail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!user.verify) {
    return res.status(401).json({ message: "Email not verified" });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
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
    return HttpError(401, "Not authorized");
  }
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).json("logout succsess");
};

const getCurrent = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
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

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  register: cntrWrapper(register),
  login: cntrWrapper(login),
  getCurrent: cntrWrapper(getCurrent),
  logout: cntrWrapper(logout),
  updateAvatar: cntrWrapper(updateAvatar),
  verifyEmail: cntrWrapper(verifyEmail),
  resendVerifyEmail: cntrWrapper(resendVerifyEmail),
};
