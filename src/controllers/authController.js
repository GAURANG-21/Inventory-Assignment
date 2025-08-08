import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import {
  generateAccessToken,
  generateRefrehToken,
} from "../utils/generateTokens.js";

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
      maxAge: 60 * 60 * 1000,
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
