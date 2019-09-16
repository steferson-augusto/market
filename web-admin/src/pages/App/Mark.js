import React, { useState, useEffect } from "react"
import { PagingState, IntegratedPaging, EditingState, SortingState } from '@devexpress/dx-react-grid'
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import api from '../../services/api'
import { pagingPanelMessages, ActiveTypeProvider, Command, EditCell } from './Helpers/TableMessages'

const Mark = () => {
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [addedRows, setAddedRows] = useState([])
    const [rowChanges, setRowChanges] = useState({})
    const [editingRowIds, getEditingRowIds] = useState([])
    const [sorting, setSorting] = useState([{ columnName: 'name', direction: 'asc' }])
    const [query, setQuery] = React.useState({
        total: 0,
        page: 1,
        perPage: 10,
        sorting: 'name',
        lastPage: null
    })

    const getData = async () => {
        setLoading(true)
        try {
            const { columnName, direction } = sorting[0]
            const queryParams = `page=${query.page}&perPage=${query.perPage}&sorting=${columnName}&direction=${direction}`
            const { data: { data, ...rest } } = await api.get(`/admin/marks?${queryParams}`)
            setRows(data)
            setQuery(rest)
        } catch ({ response: { data: error } }) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    const pageSizes = [5, 10, 15, 20]
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]

    const onPageSizeChange = size => {
        setQuery({ ...query, perPage: size })
        getData()
    }

    const changeAddedRows = value => {
        const initialized = value.map(row => (Object.keys(row).length ? row : { active: 1 }))
        setAddedRows(initialized)
    }

    const commitChanges = async ({ added, changed }) => {
        if (added) {
            setLoading(true)
            try {
                const { data: { data } } = await api.post(`/admin/marks`, added[0])
                setRows([data, ...rows])
            } catch ({ response: { data: error } }) {
                console.log('ERRO: ', error)
            }
            setLoading(false)
        }
        if (changed) {
            const [index] = Object.keys(changed)
            if (changed[index]) {
                setLoading(true)
                const { id } = rows[index]
                try {
                    await api.put(`/admin/marks/${id}`, changed[index])
                    const data = [...rows]
                    data[index] = { ...data[index], ...changed[index] }
                    setRows(data)
                } catch ({ response: { data: error } }) {
                    console.log('ERRO: ', error)
                }
                setLoading(false)
            }
        }
    }

    return (
        <Paper style={{ position: 'relative' }}>
            {loading && <LinearProgress />}
            <Grid
                rows={rows}
                columns={columns}
            >
                <PagingState
                    currentPage={query.page}
                    onCurrentPageChange={() => console.log('onCurrentPageChange')}
                    pageSize={query.perPage}
                    onPageSizeChange={size => onPageSizeChange(size)}
                />
                <ActiveTypeProvider for={["active"]} />

                <EditingState
                    editingRowIds={editingRowIds}
                    onEditingRowIdsChange={getEditingRowIds}
                    rowChanges={rowChanges}
                    onRowChangesChange={setRowChanges}
                    addedRows={addedRows}
                    onAddedRowsChange={changeAddedRows}
                    onCommitChanges={commitChanges}
                    columnExtensions={[{ columnName: 'id', editingEnabled: false }]}
                />
                <SortingState
                    sorting={sorting}
                    onSortingChange={setSorting}
                />
                <IntegratedPaging />
                <Table />
                <TableHeaderRow showSortingControls />
                <TableEditRow cellComponent={EditCell} />
                <TableEditColumn
                    width={170}
                    showAddCommand={!addedRows.length}
                    showEditCommand
                    commandComponent={Command}
                />
                <PagingPanel
                    pageSizes={pageSizes}
                    messages={pagingPanelMessages}
                />
            </Grid>
        </Paper>
    )
}

export default Mark