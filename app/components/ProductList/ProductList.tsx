import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Product = ({ id, name, imageUrl, masterVariant }) => (
  <Grid item xs={6} md={4}>
    <Paper elevation={3} style={{ textAlign: 'center' }}>
      <Typography style={{ height: '4em', padding: 4, color: '#222' }}>{name}</Typography>
      <img
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        src={masterVariant?.images?.[0]?.url}
        width={200}
        alt={name}
      />
    </Paper>
  </Grid>
);

const ProductList: React.FC<Props> = ({ products }) => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      {products.map(product => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Product {...product} key={product.key ?? product.id} />
      ))}
    </Grid>
  </Box>
);

export default ProductList;
