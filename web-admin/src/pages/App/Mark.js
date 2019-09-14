import React, { useEffect } from "react"
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { PagingState, IntegratedPaging, } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui'

import api from '../../services/api'
import { pagingPanelMessages } from './Helpers/TableMessages'

const Mark = () => {
    const [loading, setLoading] = React.useState(true)
    const [rows, setRows] = React.useState([])
    const [query, setQuery] = React.useState({
        total: 0,
        page: 1,
        perPage: 10,
        sorting: 'name',
        lastPage: null
    })

    useEffect(() => {
        const fetchData = async () => getData()
        fetchData()
    }, [])

    const pageSizes = [5, 10, 15, 20]
    const sorting = ['id', 'name', 'active']
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'name', title: 'Marca' },
        { name: 'active', title: 'Ativo' },
    ]

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

    const onPageSizeChange = size => {
        console.log('onPageSizeChange')
        setQuery({ ...query, perPage: size })
        getData()
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
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
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