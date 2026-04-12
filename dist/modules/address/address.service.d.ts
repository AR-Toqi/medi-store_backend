import type { CreateAddressInput, UpdateAddressInput } from "../../types/address.d";
/**
 * Create a new address for a user. If `isDefault` is true, unset other defaults.
 */
export declare const createAddress: (payload: CreateAddressInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    state: string;
    fullName: string;
    phone: string;
    country: string | null;
    city: string;
    area: string | null;
    postalCode: string;
    addressLine: string;
    label: string | null;
    isDefault: boolean;
}>;
/**
 * Get all addresses for a user
 */
export declare const getAddressesByUser: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    state: string;
    fullName: string;
    phone: string;
    country: string | null;
    city: string;
    area: string | null;
    postalCode: string;
    addressLine: string;
    label: string | null;
    isDefault: boolean;
}[]>;
/**
 * Get single address by id, optionally ensure ownership
 */
export declare const getAddressById: (id: string, userId?: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    state: string;
    fullName: string;
    phone: string;
    country: string | null;
    city: string;
    area: string | null;
    postalCode: string;
    addressLine: string;
    label: string | null;
    isDefault: boolean;
}>;
/**
 * Update address (ownership enforced by userId)
 */
export declare const updateAddress: (payload: UpdateAddressInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    state: string;
    fullName: string;
    phone: string;
    country: string | null;
    city: string;
    area: string | null;
    postalCode: string;
    addressLine: string;
    label: string | null;
    isDefault: boolean;
}>;
/**
 * Delete address (only owner)
 */
export declare const deleteAddress: (id: string, userId: string) => Promise<{
    message: string;
}>;
/**
 * Set an address as default for a user
 */
export declare const setDefaultAddress: (id: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    state: string;
    fullName: string;
    phone: string;
    country: string | null;
    city: string;
    area: string | null;
    postalCode: string;
    addressLine: string;
    label: string | null;
    isDefault: boolean;
}>;
export declare const addressService: {
    createAddress: (payload: CreateAddressInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string;
        fullName: string;
        phone: string;
        country: string | null;
        city: string;
        area: string | null;
        postalCode: string;
        addressLine: string;
        label: string | null;
        isDefault: boolean;
    }>;
    getAddressesByUser: (userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string;
        fullName: string;
        phone: string;
        country: string | null;
        city: string;
        area: string | null;
        postalCode: string;
        addressLine: string;
        label: string | null;
        isDefault: boolean;
    }[]>;
    getAddressById: (id: string, userId?: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string;
        fullName: string;
        phone: string;
        country: string | null;
        city: string;
        area: string | null;
        postalCode: string;
        addressLine: string;
        label: string | null;
        isDefault: boolean;
    }>;
    updateAddress: (payload: UpdateAddressInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string;
        fullName: string;
        phone: string;
        country: string | null;
        city: string;
        area: string | null;
        postalCode: string;
        addressLine: string;
        label: string | null;
        isDefault: boolean;
    }>;
    deleteAddress: (id: string, userId: string) => Promise<{
        message: string;
    }>;
    setDefaultAddress: (id: string, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string;
        fullName: string;
        phone: string;
        country: string | null;
        city: string;
        area: string | null;
        postalCode: string;
        addressLine: string;
        label: string | null;
        isDefault: boolean;
    }>;
};
//# sourceMappingURL=address.service.d.ts.map