import { ProductProjection } from '@commercetools/platform-sdk';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Product = ({ name, masterVariant }: ProductProjection): JSX.Element => (
  <Grid item md={4} xs={6}>
    <Paper elevation={3} style={{ textAlign: 'center' }}>
      <Box style={{ height: '4em', display: 'flex' }}>
        <Typography style={{ margin: 'auto', padding: 4, color: '#222' }}>{name}</Typography>
      </Box>
      <img
        alt={name}
        height={300}
        src={masterVariant?.images?.[0]?.url}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </Paper>
  </Grid>
);

export const ProductList = ({ products }: { products: Array<ProductProjection> }): JSX.Element => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      {products.map(product => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Product {...product} key={product.key ?? product.id} />
      ))}
    </Grid>
  </Box>
);
