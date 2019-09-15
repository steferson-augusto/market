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
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import api from '../../services/api'
import { pagingPanelMessages, ActiveTypeProvider, Command } from './Helpers/TableMessages'

const styles = theme => ({
    lookupEditCell: {
        padding: theme.spacing(1),
    },
    dialog: {
        width: 'calc(100% - 16px)',
    },
    inputRoot: {
        width: '100%',
    },
})

const availableValues = {
    product: [],
    region: [],
    customer: [],
}

const LookupEditCellBase = ({ availableColumnValues, value, onValueChange, classes }) => (
    <TableCell
        className={classes.lookupEditCell}
    >
        <Select
            value={value}
            onChange={event => onValueChange(event.target.value)}
            input={(
                <Input
                    classes={{ root: classes.inputRoot }}
                />
            )}
        >
            {availableColumnValues.map(item => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    </TableCell>
);
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase)

// const Cell = (props) => {
//     const { column } = props;
//     if (column.name === 'discount') {
//         return <ProgressBarCell {...props} />;
//     }
//     if (column.name === 'amount') {
//         return <HighlightedCell {...props} />;
//     }
//     return <Table.Cell {...props} />;
// };

const EditCell = (props) => {
    const { column } = props;
    const availableColumnValues = availableValues[column.name];
    if (availableColumnValues) {
        return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
    }
    return <TableEditRow.Cell {...props} />;
}

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
    ]

    const onPageSizeChange = size => {
        console.log('onPageSizeChange')
        setQuery({ ...query, perPage: size })
        getData()
    }

    const changeAddedRows = (value) => {
        const initialized = value.map(row => (Object.keys(row).length ? row : { city: 'Tokio' }));
        setAddedRows(initialized);
    };

    const deleteRows = (deletedIds) => {
        console.log('deleteRows')
    }

    const commitChanges = props => {
        console.log(props)
        if (props.added) {
            console.log('added')
        }
        if (props.changed) {
            console.log('changed')
        }
        if (props.deleted) {
            console.log('deleted')
        }
    }

    return (
        <Paper style={{ position: 'relative' }}>
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
                />
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
                <TableEditRow
                    cellComponent={EditCell}
                />
                <TableEditColumn
                    width={170}
                    showAddCommand={!addedRows.length}
                    showEditCommand
                    showDeleteCommand
                    commandComponent={Command}
                />
                <PagingPanel
                    pageSizes={pageSizes}
                    messages={pagingPanelMessages}
                />
            </Grid>
            {loading && <CircularProgress />}
        </Paper>
    )
}

export default Mark