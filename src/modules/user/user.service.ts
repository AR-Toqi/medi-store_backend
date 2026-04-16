import { prisma } from "../../lib/prisma";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary";

const getAllUsers = async()=> {
        const users = await prisma.user.findMany();
        return users;
};

const getCurrentUser = async(userid: string)=> {
        const user = await prisma.user.findUnique({
            where: {
                id: userid
            }
        });
        if (!user) {
      throw new Error("User not found")
        }

        return user;
};
const updateUser = async (userId: string, payload: any) => {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) throw new Error("User not found");

    const result = await prisma.user.update({
      where: { id: userId },
      data: payload
    })

    // Delete old image if a new one is successfully uploaded
    if (payload.image && existingUser.image) {
      const publicId = extractPublicId(existingUser.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    return result
};
const deleteUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error("User not found")
    }

    // Delete profile photo from Cloudinary
    if (user.image) {
      const publicId = extractPublicId(user.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    return await prisma.user.delete({ where: { id: userId } })
};

export const userService = {
    getAllUsers,
    getCurrentUser,
    updateUser,
    deleteUser
};