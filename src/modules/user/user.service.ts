import { prisma } from "../../lib/prisma";

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
    const result = await prisma.user.update({
      where: { id: userId },
      data: payload
    })

    return result
};

const deleteUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error("User not found")
    }
    return await prisma.user.delete({ where: { id: userId } })
};

export const userService = {
    getAllUsers,
    getCurrentUser,
    updateUser,
    deleteUser
};