
import React from 'react'
import ChartsSquare from './ChartsSquare'
import Charts from './Charts'
import UsersCharts from './UsersCharts'
import { Grid } from '@mui/material';

export default function Home() {
  return (
    <>
    <ChartsSquare/>

    <Grid container spacing={5} sx={{margin:20}}>
    
      <Grid size={6}>
        <Charts />
      </Grid>

      
      <Grid size={6}>
        <UsersCharts />
      </Grid>
    </Grid>
    </>
  )
}
