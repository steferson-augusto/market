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

import api from '../../../services/api'
import useDebounce from '../../../services/hooks/useDebounce'
import { SET_MARK } from '../../../store/actionTypes'
import { 
    pagingPanelMessages,
    ActiveTypeProvider,
    Command, EditCell,
    NumberEditor,
    pageSizes,
    TableFilterRowMessages,
    numberFilterOperations,
} from './TableConfigs'

const TableComponent = props => {
    const { columns, model, editingExtensions } = props
    const dispatch = useDispatch()
    const { data, total, editingRowIds, addedRows, rowChanges, filters, hiddenColumnNames, ...params } = useSelector(state => state[model])
    const [loading, setLoading] = useState(true)

    const types = {
        'marks': SET_MARK
    }
    const typeAction = types[model]

    const debouncedSearchTerm = useDebounce(filters, 500)

    const getData = async () => {
        setLoading(true)
        try {
            const { data: { data: result, total } } = await api.post(`/admin/${model}/filter`, {...params, filters})
            dispatch({ type: typeAction, payload: { data: result, total } })
        } catch ({ response: { data: error } }) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        // Make sure we have a value (user has entered something in input)
        if (debouncedSearchTerm) {
            getData()
        }
        /* eslint-disable */
    }, [debouncedSearchTerm])

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [params.perPage, params.page, params.sorting])

    const changeAddedRows = value => {
        const addedRows = value.map(row => (Object.keys(row).length ? row : { active: 1 }))
        dispatch({ type: typeAction, payload: { addedRows } })
    }

    const commitChanges = async ({ added, changed }) => {
        if (added) {
            setLoading(true)
            try {
                const { data: { data: result } } = await api.post(`/admin/${model}`, added[0])
                dispatch({ type: typeAction, payload: { data: [result, ...data] } })
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
                    await api.put(`/admin/${model}/${id}`, changed[index])
                    const rows = [...data]
                    rows[index] = { ...rows[index], ...changed[index] }
                    dispatch({ type: typeAction, payload: { data: rows } })
                } catch ({ response: { data: error } }) {
                    console.log('ERRO: ', error)
                }
                setLoading(false)
            }
        }
    }

    const changeState = field => value => dispatch({ type: typeAction, payload: { [field]: value } })

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
                    columnExtensions={editingExtensions}
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

                {1 == 2 && <TableFilterRow showFilterSelector messages={TableFilterRowMessages} />}
                

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

export default TableComponent