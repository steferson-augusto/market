import React, { useState, useEffect } from "react"
import { PagingState, IntegratedPaging, EditingState } from '@devexpress/dx-react-grid'
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
            const queryParams = `page=${query.page}&perPage=${query.perPage}`
            const { data: { data, ...rest } } = await api.get(`/admin/marks?${queryParams}`)
            setRows(data)
            setQuery(rest)
            setLoading(false)
            console.log(rows)
            console.log(rest)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const pageSizes = [5, 10, 15, 20]
    // const sorting = ['id', 'name', 'active']
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

    const changeAddedRows = (value) => {
        const initialized = value.map(row => (Object.keys(row).length ? row : { active: 1 }))
        setAddedRows(initialized)
    }

    const commitChanges = async ({ added, changed }) => {
        console.log(added)
        console.log(changed)
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
            console.log('changed')
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
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
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