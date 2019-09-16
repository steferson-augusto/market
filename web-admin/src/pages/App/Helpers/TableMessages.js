import React from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { TableEditRow } from '@devexpress/dx-react-grid-material-ui'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'

// const tableMessages = {
//     noData: 'Keine Daten verfügbar',
// };
// const editColumnMessages = {
//     addCommand: 'Neue Zeile',
//     editCommand: 'Bearbeiten',
//     deleteCommand: 'Entfernen',
//     commitCommand: 'Speichern',
//     cancelCommand: 'Abbrechen',
// };
// const groupingPanelMessages = {
//     groupByColumn: 'Ziehen Sie eine Spalte hierhin, um danach zu gruppieren',
// };
// const filterRowMessages = {
//     filterPlaceholder: 'Filter...',
// };

export const pagingPanelMessages = {
    showAll: 'Tudo',
    rowsPerPage: 'Itens por página',
    info: '{from} - {to} de {count}',
}

const ActiveFormatter = ({ value }) => (
    <b style={(value === 1) ? { color: 'green' } : (value === 0) ? { color: 'red' } : { color: 'grey' }}>
        {(value === 1) ? 'Ativo' : (value === 0) ? 'Inativo' : 'Desconhecido'}
    </b>
)

export const ActiveTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ActiveFormatter}
        {...props}
    />
)

export const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new row"
        >
            Add
      </Button>
    </div>
)

export const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Editar">
        <EditIcon />
    </IconButton>
)

export const DeleteButton = ({ onExecute }) => (
    <IconButton
        onClick={() => {
            // eslint-disable-next-line
            if (window.confirm('Are you sure you want to delete this row?')) {
                onExecute()
            }
        }}
        title="Inativar"
    >
        <DeleteIcon />
    </IconButton>
)

export const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Save changes">
        <SaveIcon />
    </IconButton>
)

export const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
        <CancelIcon />
    </IconButton>
)

const commandComponents = {
    "add": AddButton,
    "edit": EditButton,
    "delete": DeleteButton,
    "commit": CommitButton,
    "cancel": CancelButton,
}

export const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
        <CommandButton
            onExecute={onExecute}
        />
    )
}


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
    active: [
        {
            value: 0,
            label: 'Inativo'
        },
        {
            value: 1,
            label: 'Ativo'
        },
    ],
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
            {availableColumnValues.map((item, index) => (
                <MenuItem key={`${index}`} value={item.value}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    </TableCell>
)

const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase)

export const EditCell = props => {
    const { column } = props
    const availableColumnValues = availableValues[column.name]
    if (availableColumnValues) {
        return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />
    }
    return <TableEditRow.Cell {...props} />
}