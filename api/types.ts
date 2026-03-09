export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export type CategoryMutation = Omit<Category, 'id'>;