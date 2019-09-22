import React from "react"
import Table from './Helpers/Table'

const Section = () => {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Seção' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const editingExtensions = [
        { columnName: 'id', editingEnabled: false },
    ]

    return <Table columns={columns} model={'sections'} editingExtensions={editingExtensions} />
}

export default Section