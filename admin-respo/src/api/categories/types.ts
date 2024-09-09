export interface Category {
    id?: string;
    name: string;
    image: string;
    slug: string;
    image_url: string;
    deleted_at: null,
    created_at: string,
    updated_at: string,
}

// export interface CategoriesResponse {
//     data: Category[];
// }
export type categories = {
    id?: string;
    name: string;
}

export type categoryInput = {
    id?: string ;
    name: string;
    slug: string;
    image: string;
}