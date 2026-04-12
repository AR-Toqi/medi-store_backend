"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressService = exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getAddressesByUser = exports.createAddress = void 0;
const prisma_1 = require("../../lib/prisma");
/**
 * Create a new address for a user. If `isDefault` is true, unset other defaults.
 */
const createAddress = async (payload) => {
    const { userId, isDefault } = payload;
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("User not found");
    if (isDefault) {
        await prisma_1.prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }
    const address = await prisma_1.prisma.address.create({ data: payload });
    return address;
};
exports.createAddress = createAddress;
/**
 * Get all addresses for a user
 */
const getAddressesByUser = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("User not found");
    const addresses = await prisma_1.prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
    return addresses;
};
exports.getAddressesByUser = getAddressesByUser;
/**
 * Get single address by id, optionally ensure ownership
 */
const getAddressById = async (id, userId) => {
    const address = await prisma_1.prisma.address.findUnique({ where: { id } });
    if (!address)
        throw new Error("Address not found");
    if (userId && address.userId !== userId)
        throw new Error("Access denied");
    return address;
};
exports.getAddressById = getAddressById;
/**
 * Update address (ownership enforced by userId)
 */
const updateAddress = async (payload) => {
    const { id, userId, isDefault } = payload;
    const existing = await prisma_1.prisma.address.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Address not found");
    if (existing.userId !== userId)
        throw new Error("Access denied");
    return await prisma_1.prisma.$transaction(async (tx) => {
        if (isDefault) {
            await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
        }
        // Build update data explicitly to avoid accidentally allowing userId/id changes
        const { id: _omit, userId: _uid, ...rest } = payload;
        const data = { ...rest };
        delete data.id;
        delete data.userId;
        const updated = await tx.address.update({ where: { id }, data });
        return updated;
    });
};
exports.updateAddress = updateAddress;
/**
 * Delete address (only owner)
 */
const deleteAddress = async (id, userId) => {
    const existing = await prisma_1.prisma.address.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Address not found");
    if (existing.userId !== userId)
        throw new Error("Access denied");
    await prisma_1.prisma.address.delete({ where: { id } });
    return { message: "Address deleted successfully" };
};
exports.deleteAddress = deleteAddress;
/**
 * Set an address as default for a user
 */
const setDefaultAddress = async (id, userId) => {
    const existing = await prisma_1.prisma.address.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Address not found");
    if (existing.userId !== userId)
        throw new Error("Access denied");
    return await prisma_1.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
        const updated = await tx.address.update({ where: { id }, data: { isDefault: true } });
        return updated;
    });
};
exports.setDefaultAddress = setDefaultAddress;
exports.addressService = {
    createAddress: exports.createAddress,
    getAddressesByUser: exports.getAddressesByUser,
    getAddressById: exports.getAddressById,
    updateAddress: exports.updateAddress,
    deleteAddress: exports.deleteAddress,
    setDefaultAddress: exports.setDefaultAddress,
};
//# sourceMappingURL=address.service.js.map