import prisma from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const cleanUsername = username.trim();

    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALTS)
    );

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Admin create user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editUserByAdmin = async (req, res) => {
  try {
    let { id } = req.params;
    const { username, password, role } = req.body;
    id = Number(id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};

    if (username) {
      const cleanUsername = username.trim();
      const existingUser = await prisma.user.findUnique({
        where: { username: cleanUsername },
      });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
      updateData.username = cleanUsername;
    }

    if (password) {
      updateData.password = await bcrypt.hash(
        password,
        Number(process.env.SALTS)
      );
    }

    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Admin edit user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let { id } = req.params;
    id = Number(id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};
