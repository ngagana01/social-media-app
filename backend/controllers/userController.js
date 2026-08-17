import User from "../models/User.js";

export async function getProfile(req, res) {
  res.json(req.user);
}

export async function updateProfile(req, res) {
  const { name, bio, profilePicture } = req.body;
  const user = await User.findById(req.user._id);
  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture });
}
