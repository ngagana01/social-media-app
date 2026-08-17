import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12)
    });
    res.status(201).json({ token: tokenFor(user._id), user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture } });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password || "", user.password))) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     res.json({ token: tokenFor(user._id), user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture } });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// }
export async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = tokenFor(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
}

export async function me(req, res) { res.json(req.user); }
export async function logout(req, res) { res.json({ message: "Logged out successfully" }); }
