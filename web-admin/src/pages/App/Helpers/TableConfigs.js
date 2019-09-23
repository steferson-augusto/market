import React, { useState ,useEffect } from 'react'
import { Template, TemplatePlaceholder, Plugin } from '@devexpress/dx-react-core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { TableEditRow } from '@devexpress/dx-react-grid-material-ui'
import NumberFormat from 'react-number-format'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import AddIcon from '@material-ui/icons/Add'
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'

import api from '../../../services/api'

const style = {
    numericInput: {
        textAlign: 'right',
        width: '100%',
    },
    select: {
        width: '100%',
    }
}

export const pageSizes = [5, 10, 15, 20, 25]

export const pagingPanelMessages = {
    showAll: 'Tudo',
    rowsPerPage: 'Itens por página',
    info: '{from} - {to} de {count}',
}

export const TableFilterRowMessages = {
    filterPlaceholder: 'Filtro...',
    contains: 'Contém',
    notContains: 'Não contém',
    startsWith: 'Inicia com',
    endsWith: 'Termina com',
    equal: 'Igual',
    notEqual: 'Diferente',
    greaterThan: 'Maior',
    greaterThanOrEqual: 'Maior ou igual',
    lessThan: 'Menor',
    lessThanOrEqual: 'Menor ou igual',
}

export const numberFilterOperations = [
    'equal',
    'notEqual',
    'greaterThan',
    'greaterThanOrEqual',
    'lessThan',
    'lessThanOrEqual',
]

const ActiveEditorBase = ({ value = "", onValueChange, classes }) => {
    const handleChange = event => {
        const { value: targetValue } = event.target
        onValueChange(targetValue)
    }
    return (
        <Select
            className={classes.select}
            value={value}
            onChange={handleChange}
        >
            <MenuItem value={""}>{""}</MenuItem>
            <MenuItem value={1}>Ativo</MenuItem>
            <MenuItem value={0}>Inativo</MenuItem>
        </Select>
    )
}

const ActiveEditor = withStyles(style)(ActiveEditorBase)

const ActiveFormatter = ({ value }) => {
    const label = (value === 1) ? 'Ativo' : (value === 0) ? 'Inativo' : 'Desconhecido'
    const color = (value === 1) ? 'primary' : 'default'
    // const icon = (value === 1) ? <CheckIcon /> : <CloseIcon />
    return (
        <Chip label={label} color={color} />
    )
}

export const ActiveTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ActiveFormatter}
        availableFilterOperations={['equal', 'notEqual']}
        editorComponent={ActiveEditor}
        {...props}
    />
)

export const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Tooltip title='Adicionar'>
            <IconButton color="primary" onClick={onExecute} >
                <AddIcon />
            </IconButton>
        </Tooltip>
    </div>
)

export const EditButton = ({ onExecute }) => (
    <Tooltip title='Editar'>
        <IconButton onClick={onExecute}>
            <EditIcon />
        </IconButton>
    </Tooltip>
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
    <Tooltip title='Salvar'>
        <IconButton color="primary" onClick={onExecute}>
            <SaveIcon />
        </IconButton>
    </Tooltip>
)

export const CancelButton = ({ onExecute }) => (
    <Tooltip title='Cancelar'>
        <IconButton color="secondary" onClick={onExecute}>
            <CancelIcon />
        </IconButton>
    </Tooltip>
)

const commandComponents = {
    "add": AddButton,
    "edit": EditButton,
    "delete": DeleteButton,
    "commit": CommitButton,
    "cancel": CancelButton,
}

export const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id]
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

const NumberEditorBase = ({ value, onValueChange, classes, disabled }) => {
    const handleChange = (event) => {
        const { value: targetValue } = event.target
        if (targetValue.trim() === '') {
            onValueChange()
            return
        }
        onValueChange(parseInt(targetValue, 10))
    }
    return (
        <Input fullWidth
            type="number" disabled={disabled}
            classes={{ input: classes.numericInput, }}
            value={value === undefined ? '' : value}
            inputProps={{ min: 1 }}
            onChange={handleChange}
        />
    )
}

export const NumberEditor = withStyles(style)(NumberEditorBase)

export const ToolbarFilter = ({ toggleFilter, activated }) => {
    const title = activated ? 'Ocultar filtros' : 'Exibir filtros'
    return (
        <Plugin
            name="ToolbarFilter"
            dependencies={[{ name: 'Toolbar' }]}
        >
            <Template name="toolbarContent" >
                <TemplatePlaceholder />
                <Tooltip title={title} placement='bottom'>
                    <IconButton onClick={toggleFilter}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </Template>
        </Plugin>
    )
}

const CurrencyFormatCustom = props => {
    const { inputRef, onChange, ...other } = props

    return (
        <NumberFormat
            {...other} 
            getInputRef={inputRef} allowNegative={false}
            onValueChange={value => onChange({ target: { value: value.value } }) }
            decimalScale={2} fixedDecimalScale={true}
        />
    )
}

const CurrencyEditor = ({ value, onValueChange, disabled }) => {
    const handleChange = event => onValueChange(event.target.value)

    return (
        <TextField
            value={value} disabled={disabled}
            onChange={event => handleChange(event)}
            id="formatted-numberformat-input"
            InputProps={{
                inputComponent: CurrencyFormatCustom,
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
        />
    )
}

const CurrencyFormatter = ({ value }) => value ? `R$ ${value}` : ''

export const CurrencyTypeProvider = props => (
    <DataTypeProvider
        availableFilterOperations={numberFilterOperations}
        editorComponent={CurrencyEditor}
        formatterComponent={CurrencyFormatter}
        {...props}
    />
)

const SelectEditorBase = ({ value = 1, onValueChange, classes, column: { name } }) => {
    const [data, setData] = useState([{ value: 1, title: '' }])
    useEffect(() => {
        const [model] = name.split('_')
        console.log(model, name)
        const getData = async() => {
            let { data: result } = await api.get(`/admin/${model}s`)
            result = result.map( ({ id, name }) => ({ value: id, title: name }))
            setData(result)
        }
        getData()
    }, [])
    const handleChange = event => {
        const { value: targetValue } = event.target
        onValueChange(targetValue)
    }
    return (
        <Select
            className={classes.select}
            value={value}
            onChange={handleChange}
        >
            {data.map(d => <MenuItem key={`${d.value}`} value={d.value}>{d.title}</MenuItem>)}
        </Select>
    )
}

const SelectEditor = withStyles(style)(SelectEditorBase)

const SelectFormatter = ({ value }, ...rest) => {
    console.log(value)
    return value
}

export const SelectTypeProvider = props => {
    console.log(props)
    return (
        <DataTypeProvider
            availableFilterOperations={['equal', 'notEqual']}
            editorComponent={SelectEditor}
            formatterComponent={SelectFormatter}
            {...props}
        />
    )}