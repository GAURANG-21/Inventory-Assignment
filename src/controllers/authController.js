import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUsername = username.trim();

    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUser)
      return res.status(400).json({
        message: "Username already exists",
      });

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALTS)
    );

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        password: hashedPassword,
      },
    });

    const accessToken = await generateAccessToken({ id: newUser.id });
    const refreshToken = await generateRefreshToken({ id: newUser.id });

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      Number(process.env.SALTS)
    );
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUsername = username.trim();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const accessToken = await generateAccessToken({ id: user.id });
    const refreshToken = await generateRefreshToken({ id: user.id });

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      Number(process.env.SALTS)
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token not found, please login again." });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token." });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.refreshToken) {
      return res
        .status(403)
        .json({ message: "User not found or no refresh token stored." });
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid)
      return res.status(403).json({ message: "Refresh token does not match." });

    const newAccessToken = await generateAccessToken({ id: user.id });
    const newRefreshToken = await generateRefreshToken({ id: user.id });

    const hashedRefreshToken = await bcrypt.hash(
      newRefreshToken,
      Number(process.env.SALTS)
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
