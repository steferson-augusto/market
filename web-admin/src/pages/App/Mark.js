import React from "react"
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'

const Mark = () => {
    return (
        <Grid
            rows={[
                { id: 0, product: 'DevExtreme', owner: 'DevExpress' },
                { id: 1, product: 'DevExtreme Reactive', owner: 'DevExpress' },
            ]}
            columns={[
                { name: 'id', title: 'ID' },
                { name: 'product', title: 'Product' },
                { name: 'owner', title: 'Owner' },
            ]}>
            <Table />
            <TableHeaderRow />
        </Grid>
    )
}

export default Mark