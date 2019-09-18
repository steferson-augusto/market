import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    PagingState,
    EditingState,
    SortingState,
    CustomPaging,
    FilteringState,
    IntegratedFiltering,
} from '@devexpress/dx-react-grid'
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    TableEditRow,
    TableEditColumn,
    TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import api from '../../services/api'
import useDebounce from '../../services/hooks/useDebounce'
import { SET_MARK } from '../../store/actionTypes'
import { pagingPanelMessages, ActiveTypeProvider, Command, EditCell } from './Helpers/TableMessages'

const Mark = () => {
    const dispatch = useDispatch()
    const { data, total, page, perPage, sorting, editingRowIds, addedRows, rowChanges } = useSelector(state => state.marks)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState([])
    const pageSizes = [1, 5, 10, 15, 20]
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]

    const debouncedSearchTerm = useDebounce(filters, 500)

    useEffect(
        () => {
          // Make sure we have a value (user has entered something in input)
          if (debouncedSearchTerm) {
            console.log('searching')
            console.log(filters)
            console.log('end searching')
          } else {
            console.log('results []')
          }
        },
        
        [debouncedSearchTerm]
      )

    useEffect(() => {
        const getData = async () => {
            console.log('get data')
            setLoading(true)
            try {
                const { columnName, direction } = sorting[0]
                const query = `page=${page + 1}&perPage=${perPage}&sorting=${columnName}&direction=${direction}`
                const { data: { data: result, total } } = await api.get(`/admin/marks?${query}`)
                dispatch({ type: SET_MARK, payload: { data: result, total } })
            } catch ({ response: { data: error } }) {
                console.log(error)
            }
            setLoading(false)
        }
        getData()
    }, [sorting, page, perPage])

    const changeAddedRows = value => {
        const addedRows = value.map(row => (Object.keys(row).length ? row : { active: 1 }))
        dispatch({ type: SET_MARK, payload: { addedRows } })
    }

    const commitChanges = async ({ added, changed }) => {
        if (added) {
            setLoading(true)
            try {
                const { data: { data: result } } = await api.post(`/admin/marks`, added[0])
                dispatch({ type: SET_MARK, payload: { data: [result, ...data] } })
            } catch ({ response: { data: error } }) {
                console.log('ERRO: ', error)
            }
            setLoading(false)
        }
        if (changed) {
            const [index] = Object.keys(changed)
            if (changed[index]) {
                setLoading(true)
                const { id } = data[index]
                try {
                    await api.put(`/admin/marks/${id}`, changed[index])
                    const rows = [...data]
                    rows[index] = { ...rows[index], ...changed[index] }
                    dispatch({ type: SET_MARK, payload: { data: rows } })
                } catch ({ response: { data: error } }) {
                    console.log('ERRO: ', error)
                }
                setLoading(false)
            }
        }
    }

    const changeState = field => value => dispatch({ type: SET_MARK, payload: { [field]: value } })

    return (
        <Paper style={{ position: 'relative' }}>
            {loading && <LinearProgress />}
            <Grid
                rows={data}
                columns={columns}
            >
                <PagingState
                    currentPage={page}
                    onCurrentPageChange={changeState('page')}
                    pageSize={perPage}
                    onPageSizeChange={changeState('perPage')}
                />
                <ActiveTypeProvider for={["active"]} />

                <EditingState
                    editingRowIds={editingRowIds}
                    onEditingRowIdsChange={changeState('editingRowIds')}
                    rowChanges={rowChanges}
                    onRowChangesChange={changeState('rowChanges')}
                    addedRows={addedRows}
                    onAddedRowsChange={changeAddedRows}
                    onCommitChanges={commitChanges}
                    columnExtensions={[{ columnName: 'id', editingEnabled: false }]}
                />
                <SortingState
                    sorting={sorting}
                    onSortingChange={changeState('sorting')}
                />
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
                <FilteringState
                    filters={filters}
                    onFiltersChange={f => setFilters(f)}
                />
                <CustomPaging totalCount={total} />
                <IntegratedFiltering />
                <TableFilterRow />
            </Grid>
        </Paper>
    )
}

export default Mark