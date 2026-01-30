import { prisma } from "../../lib/prisma";
import type { CreateAddressInput, UpdateAddressInput } from "../../types/address.d";

/**
 * Create a new address for a user. If `isDefault` is true, unset other defaults.
 */
export const createAddress = async (payload: CreateAddressInput) => {
  const { userId, isDefault } = payload;

  // Validate user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({ data: payload });
  return address;
};

/**
 * Get all addresses for a user
 */
export const getAddressesByUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return addresses;
};

/**
 * Get single address by id, optionally ensure ownership
 */
export const getAddressById = async (id: string, userId?: string) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new Error("Address not found");
  if (userId && address.userId !== userId) throw new Error("Access denied");
  return address;
};

/**
 * Update address (ownership enforced by userId)
 */
export const updateAddress = async (payload: UpdateAddressInput) => {
  const { id, userId, isDefault } = payload;

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing) throw new Error("Address not found");
  if (existing.userId !== userId) throw new Error("Access denied");

  return await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    // Build update data explicitly to avoid accidentally allowing userId/id changes
    const { id: _omit, userId: _uid, ...rest } = payload as any;
    const data: any = { ...rest };
    delete data.id;
    delete data.userId;

    const updated = await tx.address.update({ where: { id }, data });
    return updated;
  });
};

/**
 * Delete address (only owner)
 */
export const deleteAddress = async (id: string, userId: string) => {
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing) throw new Error("Address not found");
  if (existing.userId !== userId) throw new Error("Access denied");

  await prisma.address.delete({ where: { id } });
  return { message: "Address deleted successfully" };
};

/**
 * Set an address as default for a user
 */
export const setDefaultAddress = async (id: string, userId: string) => {
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing) throw new Error("Address not found");
  if (existing.userId !== userId) throw new Error("Access denied");

  return await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    const updated = await tx.address.update({ where: { id }, data: { isDefault: true } });
    return updated;
  });
};

export const addressService = {
  createAddress,
  getAddressesByUser,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
