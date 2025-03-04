/* eslint-disable import/no-duplicates */
/* eslint-disable react-hooks/exhaustive-deps */
import type { CategoryRes } from 'src/services/agent/types';
import type { FiltersProps } from 'src/components/dialog/side-dialog';

import { toast } from 'react-toastify';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Pagination } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import products from 'src/stores/product';
import { productService } from 'src/services/products';
import { DashboardContent } from 'src/layouts/dashboard';
import {  type ProductRes, type ProductPayload, type PaginationParams } from 'src/services/agent/types';

import { SideDialog } from 'src/components/dialog/side-dialog';

import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../product-cart-widget';

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  colors: [COLOR_OPTIONS[4]],
  category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const { selectedCompany } = products();
  const { company_id } = selectedCompany;

  const [sortBy, setSortBy] = useState('featured');

  const [openFilter, setOpenFilter] = useState(false);

  const [productsList, setProductsList] = useState<ProductRes[]>();
  const [categoryList, setCategoryList] = useState<CategoryRes[]>([]);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const fetchProducts = useCallback(async () => {
    const payload: ProductPayload = {
      categoryId: '',
      companyId: company_id,
    }
    const pagination: PaginationParams = {
      skip: 0,
      limit: 10,
    }
    try {
      const { data } = await productService.getProducts(payload, pagination);
      setProductsList(data);
      toast.success('Data loaded successfully');
    } catch (err) {
      toast.error('Data loaded unsuccessfully');
    }
  }, [company_id]); 

  const fetchCategory = useCallback(async () => {
    const payload: any = {
      companyId: company_id,
    }
    try {
      const { data } = await productService.getCategory(payload);
      setCategoryList(data);
      toast.success('Data loaded successfully');
    } catch (err) {
      toast.error('Data loaded unsuccessfully');
    }
  }, [company_id]); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts])

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
    fetchCategory()
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <CartIcon totalItems={8} />

      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
          <SideDialog
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              categories: categoryList?.length
                ? categoryList.map(item => ({ value: item.name, label: item.name }))
                : [],
            }}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {productsList && productsList.map((product: ProductRes) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductItem product={product} />
          </Grid>
        ))}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
