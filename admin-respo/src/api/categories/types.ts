export type Category = {
    id?: string | undefined
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
    id?: string | undefined
    name: string;
}

export type categoryInput = {
    id?: string | undefined ;
    name: string;
    image: string;
}