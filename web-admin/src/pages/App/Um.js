import React from "react"
import Table from './Helpers/Table'

const Um = () => {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Unidade' },
        { name: 'abbreviation', title: 'Abreviação' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const editingExtensions = [
        { columnName: 'id', editingEnabled: false },
    ]

    return <Table columns={columns} model={'ums'} editingExtensions={editingExtensions} />
}

export default Um