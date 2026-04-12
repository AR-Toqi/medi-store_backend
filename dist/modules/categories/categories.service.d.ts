interface CreateCategoryPayload {
    name: string;
}
interface UpdateCategoryPayload {
    name?: string;
    isActive?: boolean;
}
export declare const categoryService: {
    createCategory: (payload: CreateCategoryPayload) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    }>;
    getAllCategories: (isAdmin?: boolean) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    }[]>;
    getSingleCategory: (id: string) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    }>;
    updateCategory: (id: string, payload: UpdateCategoryPayload) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    }>;
    deleteCategory: (id: string) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    }>;
};
export {};
//# sourceMappingURL=categories.service.d.ts.map