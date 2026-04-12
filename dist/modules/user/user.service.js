"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllUsers = async () => {
    const users = await prisma_1.prisma.user.findMany();
    return users;
};
const getCurrentUser = async (userid) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userid
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
const updateUser = async (userId, payload) => {
    const result = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: payload
    });
    return result;
};
const deleteUser = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma_1.prisma.user.delete({ where: { id: userId } });
};
exports.userService = {
    getAllUsers,
    getCurrentUser,
    updateUser,
    deleteUser
};
//# sourceMappingURL=user.service.js.map