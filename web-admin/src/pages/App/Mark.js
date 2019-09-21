import React from "react"
import Table from './Helpers/Table'

const Mark = () => {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const editingExtensions = [
        { columnName: 'id', editingEnabled: false },
    ]

    return (
        <Table columns={columns} model={'marks'} editingExtensions={editingExtensions} />
    )
}

export default Mark