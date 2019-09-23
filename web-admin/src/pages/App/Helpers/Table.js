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
import Snackbar from '@material-ui/core/Snackbar'

import api from '../../../services/api'
import useDebounce from '../../../services/hooks/useDebounce'
import { SET_MARK, SET_SECTION, SET_UM, SET_PRODUCTS } from '../../../store/actionTypes'
import CustomSnackbar, { convertError } from '../Helpers/Snackbar'
import {
    pagingPanelMessages,
    ActiveTypeProvider,
    Command, EditCell,
    NumberEditor,
    pageSizes,
    TableFilterRowMessages,
    numberFilterOperations,
    ToolbarFilter,
    CurrencyTypeProvider,
    SelectTypeProvider,
} from './TableConfigs'

const TableComponent = props => {
    const { columns, model, editingExtensions } = props
    const dispatch = useDispatch()
    const { data, total, editingRowIds, addedRows, rowChanges, filters, hiddenColumnNames, ...params } = useSelector(state => state[model])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState(false)
    const [snack, setSnack] = useState({
        open: false,
        variant: 'success',
        message: 'Carregado com sucesso'
    })
    const columnChooser = { showColumnChooser: 'Exibir/ocultar colunas' }
    const sortingHint = { sortingHint: 'Ordenar' }
    const noData = { noData: 'Sem registros' }
    const types = {
        'marks': SET_MARK,
        'sections': SET_SECTION,
        'ums': SET_UM,
        'products': SET_PRODUCTS,
    }
    const typeAction = types[model]

    const debouncedSearchTerm = useDebounce(filters, 500)

    const getData = async () => {
        setLoading(true)
        try {
            const { data: { data: result, total } } = await api.post(`/admin/${model}/filter`, { ...params, filters })
            dispatch({ type: typeAction, payload: { data: result, total } })
        } catch ({ response: { status, data: { error } } }) {
            setSnack(convertError(status, error))
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
                console.log(added[0])
                dispatch({ type: typeAction, payload: { data: [result, ...data] } })
                setSnack({ open: true, variant: 'success', message: 'Adicionado com sucesso' })
            } catch ({ response: { status, data: { error } } }) {
                setSnack(convertError(status, error))
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
                    setSnack({ open: true, variant: 'success', message: 'Alterado com sucesso' })
                } catch ({ response: { status, data: { error } } }) {
                    setSnack(convertError(status, error))
                }
                setLoading(false)
            }
        }
    }

    const changeState = field => value => dispatch({ type: typeAction, payload: { [field]: value } })

    const handleCloseSnack = reason => {
        if (reason === 'clickaway') return
        setSnack({ ...snack, open: false})
    }

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
                <SelectTypeProvider for={["mark"]} />
                <DataTypeProvider
                    for={['id']}
                    availableFilterOperations={numberFilterOperations}
                    editorComponent={NumberEditor}
                />
                <CurrencyTypeProvider for={['price']} />

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
                <Table messages={noData} />

                <TableHeaderRow showSortingControls messages={sortingHint} />
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

                {filter && <TableFilterRow showFilterSelector messages={TableFilterRowMessages} />}


                <TableColumnVisibility
                    hiddenColumnNames={hiddenColumnNames}
                    onHiddenColumnNamesChange={changeState('hiddenColumnNames')}
                />
                <Toolbar />
                <ToolbarFilter activated={filter} toggleFilter={() => setFilter(!filter)} />
                <ColumnChooser messages={columnChooser} />
            </Grid>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snack.open}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
            >
                <CustomSnackbar
                    onClose={handleCloseSnack}
                    variant={snack.variant}
                    message={snack.message}
                />
            </Snackbar>
        </Paper>
    )
}

export default TableComponent