import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    PagingState,
    EditingState,
    SortingState,
    CustomPaging,
    FilteringState,
    DataTypeProvider,
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
import { pagingPanelMessages, ActiveTypeProvider, Command, EditCell, NumberEditor } from './Helpers/TableMessages'

const Mark = () => {
    const dispatch = useDispatch()
    const { data, total, editingRowIds, addedRows, rowChanges, filters, ...params } = useSelector(state => state.marks)
    const [loading, setLoading] = useState(true)
    // const [filters, setFilters] = useState([])
    const pageSizes = [1, 5, 10, 15, 20]
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const numberFilterOperations = [
        'equal',
        'notEqual',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
    ]

    const debouncedSearchTerm = useDebounce(filters, 500)

    const getData = async () => {
        console.log(filters)
        setLoading(true)
        try {
            // const { columnName, direction } = sorting[0]
            // const query = `page=${page + 1}&perPage=${perPage}&sorting=${columnName}&direction=${direction}`
            console.log(filters)
            const { data: { data: result, total } } = await api.post(`/admin/marks/filter`, {...params, filters})
            dispatch({ type: SET_MARK, payload: { data: result, total } })
        } catch ({ response: { data: error } }) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(
        () => {
            // Make sure we have a value (user has entered something in input)
            if (debouncedSearchTerm) {
                console.log('searching')
                // dispatch({ type: SET_MARK, payload: { filters } })
                getData()
                console.log('end searching')
            } else {
                console.log('results []')
            }
        },

        [debouncedSearchTerm]
    )

    useEffect(() => {
        
        getData()
    }, [params.perPage, params.page, params.sorting])

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
                    currentPage={params.page}
                    onCurrentPageChange={changeState('page')}
                    pageSize={params.perPage}
                    onPageSizeChange={changeState('perPage')}
                />
                <ActiveTypeProvider for={["active"]} />
                <DataTypeProvider
                    for={['id']}
                    availableFilterOperations={numberFilterOperations}
                    editorComponent={NumberEditor}
                />

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
                    sorting={params.sorting}
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
                    onFiltersChange={changeState('filters')}
                />
                <CustomPaging totalCount={total} />

                <TableFilterRow showFilterSelector />
            </Grid>
        </Paper>
    )
}

export default Mark