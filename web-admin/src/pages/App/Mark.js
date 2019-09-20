import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    PagingState,
    EditingState,
    SortingState,
    CustomPaging,
    FilteringState,
    DataTypeProvider,
} from '@devexpress/dx-react-grid'
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    TableEditRow,
    TableEditColumn,
    TableFilterRow,
    ColumnChooser,
    TableColumnVisibility,
    Toolbar,
} from '@devexpress/dx-react-grid-material-ui'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import api from '../../services/api'
import useDebounce from '../../services/hooks/useDebounce'
import { SET_MARK } from '../../store/actionTypes'
import { 
    pagingPanelMessages,
    ActiveTypeProvider,
    Command, EditCell,
    NumberEditor,
    pageSizes,
    TableFilterRowMessages,
    numberFilterOperations,
} from './Helpers/TableMessages'

const Mark = () => {
    const dispatch = useDispatch()
    const { data, total, editingRowIds, addedRows, rowChanges, filters, hiddenColumnNames, ...params } = useSelector(state => state.marks)
    const [loading, setLoading] = useState(true)

    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]

    const debouncedSearchTerm = useDebounce(filters, 500)

    const getData = async () => {
        setLoading(true)
        try {
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
                getData()
            }
            /* eslint-disable */
        },

        [debouncedSearchTerm]
    )

    useEffect(() => {
        getData()
        // eslint-disable-next-line
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

                <TableFilterRow showFilterSelector messages={TableFilterRowMessages} />

                <TableColumnVisibility
                    hiddenColumnNames={hiddenColumnNames}
                    onHiddenColumnNamesChange={changeState('hiddenColumnNames')}
                />
                <Toolbar />
                <ColumnChooser />
            </Grid>
        </Paper>
    )
}

export default Mark