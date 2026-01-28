import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { userService } from "./user.service"



const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers()

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    })
  }
}

/**
 * USER → Get current logged-in user
 */
const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.id

    const user = await userService.getCurrentUser(id as string)

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    })
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "User not found",
    })
  }
}

/**
 * USER → Update own profile
 */
const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const payload = req.body

    const updatedUser = await userService.updateUser(userId, payload)

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    })
  }
}

/**
 * ADMIN → Delete user
 */
const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id
    console.log(userId)

    await userService.deleteUser(userId as string)

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Failed to delete user",
    })
  }
}

export const userController = {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
}