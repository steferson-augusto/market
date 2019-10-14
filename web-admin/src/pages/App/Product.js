import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PagingState, EditingState, SortingState, CustomPaging, FilteringState, DataTypeProvider, } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, PagingPanel, TableEditRow, TableEditColumn, TableFilterRow, ColumnChooser, TableColumnVisibility, Toolbar, } from '@devexpress/dx-react-grid-material-ui'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'

import api from '../../services/api'
import useDebounce from '../../services/hooks/useDebounce'
import { SET_PRODUCTS } from '../../store/actionTypes'
import CustomSnackbar, { convertError } from './Helpers/Snackbar'
import { pagingPanelMessages, ActiveTypeProvider, Command, EditCell, NumberEditor, pageSizes, TableFilterRowMessages, numberFilterOperations, ToolbarFilter, CurrencyTypeProvider, SelectTypeProvider, columnChooser, sortingHint, noData  } from './Helpers/TableConfigs'

const Product = () => {
    const dispatch = useDispatch()
    const { data, total, editingRowIds, addedRows, rowChanges, ums,
            filters, hiddenColumnNames, marks, sections, ...params 
    } = useSelector(state => state.products)
    // const [marks, setMarks] = useState([])
    // const [sections, setSections] = useState([])
    // const [ums, setUms] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState(false)
    const [snack, setSnack] = useState({
        open: false,
        variant: 'success',
        message: 'Carregado com sucesso'
    })
    const debouncedSearchTerm = useDebounce(filters, 500)
    const editingExtensions = [ { columnName: 'id', editingEnabled: false } ]
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Produto' },
        { name: 'mark_id', title: 'Marca' },
        { name: 'section_id', title: 'Seção' },
        { name: 'um_id', title: 'Unidade' },
        { name: 'price', title: 'Preço' },
        { name: 'active', title: 'Status' },
        { name: 'description', title: 'Descrição' },
    ]
    const tableColumnExtensions = [
        { columnName: 'id', width: 40 },
        { columnName: 'name', width: '30%' },
        { columnName: 'mark_id', width: 90 },
        { columnName: 'section_id', width: 90 },
        { columnName: 'um_id', width: 90 },
        { columnName: 'price', width: 80 },
        { columnName: 'active', width: 80 },
        { columnName: 'description', width: 'auto' },
    ]

    const getData = async () => {
        setLoading(true)
        try {
            const { data: { marks, sections, ums, data: { data, total }} } = await api.post(`/admin/products/filter`, { ...params, filters })
            // setMarks(marks)
            // setSections(sections)
            // setUms(ums)
            dispatch({ type: SET_PRODUCTS, payload: { data, marks, sections, ums, total: parseInt(total) } })
        } catch ({ response: { status, data: { error } } }) {
            setSnack(convertError(status, error))
        }
        setLoading(false)
    }

    useEffect(() => {
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
        dispatch({ type: SET_PRODUCTS, payload: { addedRows } })
    }

    const commitChanges = async ({ added, changed }) => {
        if (added) {
            setLoading(true)
            try {
                console.log(added[0])
                const { data: { data: result } } = await api.post(`/admin/products`, added[0])
                dispatch({ type: SET_PRODUCTS, payload: { data: [result, ...data] } })
                setSnack({ open: true, variant: 'success', message: 'Adicionado com sucesso' })
            } catch ({ response: { status, data: { error } } }) {
                setSnack(convertError(status, error))
            }
            setLoading(false)
        }
        if (changed) {
            const [index] = Object.keys(changed)
            if (changed[index]) {
                console.log(changed[index])
                setLoading(true)
                const { id } = data[index]
                try {
                    await api.put(`/admin/products/${id}`, changed[index])
                    const rows = [...data]
                    rows[index] = { ...rows[index], ...changed[index] }
                    dispatch({ type: SET_PRODUCTS, payload: { data: rows } })
                    setSnack({ open: true, variant: 'success', message: 'Alterado com sucesso' })
                } catch ({ response: { status, data: { error } } }) {
                    setSnack(convertError(status, error))
                }
                setLoading(false)
            }
        }
    }

    const changeState = field => value => dispatch({ type: SET_PRODUCTS, payload: { [field]: value } })

    const handleCloseSnack = reason => {
        if (reason === 'clickaway') return
        setSnack({ ...snack, open: false})
    }

    return (
        <Paper style={{ position: 'relative' }}>
            {loading && <LinearProgress />}
            <Grid rows={data} columns={columns} >
                <PagingState
                    currentPage={params.page}
                    onCurrentPageChange={changeState('page')}
                    pageSize={params.perPage}
                    onPageSizeChange={changeState('perPage')}
                />
                <ActiveTypeProvider for={["active"]} />
                <SelectTypeProvider for={["mark_id"]} data={marks} />
                <SelectTypeProvider for={["section_id"]} data={sections} />
                <SelectTypeProvider for={["um_id"]} data={ums} />
                <DataTypeProvider for={['id']}
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
                <Table messages={noData} columnExtensions={tableColumnExtensions} />

                <TableHeaderRow showSortingControls messages={sortingHint} />
                <TableEditRow cellComponent={EditCell} />
                <TableEditColumn
                    width={170}
                    showAddCommand={!addedRows.length}
                    showEditCommand
                    commandComponent={Command}
                />
                <PagingPanel pageSizes={pageSizes} messages={pagingPanelMessages} />
                <FilteringState filters={filters} onFiltersChange={changeState('filters')} />
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

export default Product