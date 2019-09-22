import React from "react"
import Table from './Helpers/Table'

const Product = () => {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Produto' },
        { name: 'price', title: 'Preço' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const editingExtensions = [
        { columnName: 'id', editingEnabled: false },
    ]

    return (
        <Table columns={columns} model={'products'} editingExtensions={editingExtensions} />
    )
}

export default Product