export interface Product {
    id: number
    name: string
    price: number
    active: boolean
    description?: string
    mark?: string
    um?: string
    section?: string
    mark_id?: number
    section_id?: number
    um_id?: number
    estoque?: number
}

const data: Array<Product> = [
    {
        id: 1,
        name: 'Refrigerante Coca-Cola 2L',
        description: null,
        section: 'Bebidas',
        mark: 'Coca-Cola',
        price: 6.50,
        um: 'UN',
        active: true
    },{
        id: 2,
        name: 'Refrigerante Antártica 2L',
        description: null,
        section: 'Bebidas',
        mark: 'Coca-Cola',
        price: 6.00,
        um: 'UN',
        active: true
    },{
        id: 3,
        name: 'Coxão Mole',
        description: null,
        section: 'Carnes e frios',
        price: 18.00,
        um: 'Kg',
        active: true
    },{
        id: 4,
        name: 'Paletão',
        description: null,
        section: 'Carnes e frios',
        price: 16.00,
        um: 'Kg',
        active: true
    },{
        id: 5,
        name: 'Arroz Tio Urbano 5Kg',
        description: null,
        section: 'Grãos',
        mark: 'Tio Urbano',
        price: 11.00,
        um: 'UN',
        active: true
    },{
        id: 6,
        name: 'Feijão Agulinha 2Kg',
        description: null,
        section: 'Grãos',
        mark: 'Agulinha',
        price: 6.00,
        um: 'UN',
        active: true
    },{
        id: 7,
        name: 'Tomate',
        description: null,
        section: 'Hortifruti',
        price: 4.60,
        um: 'Kg',
        active: true
    },{
        id: 8,
        name: 'Laranja',
        description: null,
        section: 'Hortifruti',
        price: 3.20,
        um: 'Kg',
        active: true
    },{
        id: 9,
        name: 'Melancia',
        description: null,
        section: 'Hortifruti',
        price: 2.10,
        um: 'Kg',
        active: true
    },{
        id: 10,
        name: 'Sabonete Rexona 100g',
        description: null,
        section: 'Higiene',
        mark: 'Rexona',
        price: 0.90,
        um: 'g',
        active: true
    },{
        id: 11,
        name: 'Creme Dental Colgate 180g',
        description: null,
        section: 'Higiene',
        mark: 'Colgate',
        price: 2.10,
        um: 'g',
        active: true
    },{
        id: 12,
        name: 'Creme Dental Sorriso 180g',
        description: null,
        section: 'Higiene',
        mark: 'Sorriso',
        price: 2.10,
        um: 'g',
        active: true
    },{
        id: 13,
        name: 'Detergente Ypê 200g',
        description: null,
        section: 'Limpeza',
        mark: 'Ypê',
        price: 2.90,
        um: 'g',
        active: true
    },{
        id: 14,
        name: 'Sabão em pó Omo 500g',
        description: null,
        section: 'Limpeza',
        mark: 'Omo',
        price: 8.10,
        um: 'g',
        active: true
    },
]

export default data