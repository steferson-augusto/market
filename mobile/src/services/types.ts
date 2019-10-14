export interface Product {
    id: number
    name: string
    price: number
    description?: string
    mark?: string
    mark_id?: number
    section?: string
    section_id?: number
    um?: string
    um_id?: number
}

export interface Section {
    id: number
    name: string
}