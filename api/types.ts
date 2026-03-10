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

export interface Item {
    id: number;
    category_id: number;
    location_id: number;
    name: string;
    description: string | null;
    image: string | null;
    registration_date: string;
}

export type ItemMutation = Omit<Item, 'id' | 'registration_date'>;