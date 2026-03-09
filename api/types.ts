export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export type CategoryMutation = Omit<Category, 'id'>;

export interface Location {
    id: number;
    name: string;
    description: string | null;
}

export type LocationMutation = Omit<Location, 'id'>;