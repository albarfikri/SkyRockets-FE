/* eslint-disable react-hooks/exhaustive-deps */
import type { PaginationParams, InventoryWarehouseResponse } from 'src/services/agent/types';

import { toast } from 'react-toastify';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { OutlinedInput } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import products from 'src/stores/product';
import { general as strings } from 'src/strings';
import { DashboardContent } from 'src/layouts/dashboard';
import { inventoryWarehouseService } from 'src/services/inventoryWarehouseService';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import MainDialog from 'src/components/dialog/main-dialog';
import { TableHeader } from 'src/components/table/table-head';
import { TableNoData } from 'src/components/table/table-no-data';
import { TableToolbar } from 'src/components/table/table-toolbar';
import { RenderRowsSkeleton } from 'src/components/skeleton/rows-skeleton';
import ConfirmationDialog from 'src/components/dialog/confirmation-dialog';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import { TableEmptyRows } from 'src/sections/user/table-empty-rows';

import { TableRows } from './table-row';

import type { FormAddWarehouse } from '../types';

// ----------------------------------------------------------------------



export function WarehouseView() {
  const table = useTable();
  const { selectedCompany } = products();
  const { company_id } = selectedCompany;

  const initAddWarehouseState: FormAddWarehouse = {
    name: "",
    location: "",
    contact: "",
    company_id,
  }

  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState<InventoryWarehouseResponse[]>();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormAddWarehouse>(initAddWarehouseState);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedId, setDeletedId] = useState('');

  useEffect(() => {
    fetchWarehouse();
  }, [isDeleted]);

  const fetchWarehouse = async () => {
    setIsLoadData(true);
    const payload = { companyId: company_id };
    const pagination: PaginationParams = {
      skip: 0,
      limit: 10,
    };
    const res = await inventoryWarehouseService.getWarehouse(payload, pagination);
    setData(res.data);
    setIsDeleted(false)
    setFormData(initAddWarehouseState)
    setIsLoadData(false);
  }

  const orderBy = table.orderBy as keyof InventoryWarehouseResponse;

  const dataFiltered: InventoryWarehouseResponse[] = applyFilter({
    inputData: data ?? [],
    comparator: getComparator<InventoryWarehouseResponse, keyof InventoryWarehouseResponse>(
      table.order,
      orderBy
    ),
    filterValue: '',
    filterBy: table.order,
  });
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState: FormAddWarehouse) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const renderContentAdd = () => {
    const fields = [
      {
        field: 'Name',
        type: 'text',
      },
      {
        field: 'Location',
        type: 'text',
      },
      {
        field: 'Contact',
        type: 'number',
      },
    ];
    return (
      <Grid container spacing={2}>
        {fields.map((m) => (
          <Grid item xs={12} key={m.field}>
            <OutlinedInput
              fullWidth
              type={m.type}
              value={formData[m.field.toLowerCase() as keyof FormAddWarehouse]}
              onChange={handleChange}
              placeholder={m.field}
              name={m.field.toLowerCase()} // Matches state keys
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const onSaveWarehouse = async () => {
    try {
      await inventoryWarehouseService.addWarehouse({ ...formData});
      toast.success(strings.succeedAddData);
      setOpen(false);
      fetchWarehouse()
    } catch(err){
      toast.success(strings.failedAddData);
    }
  } 

  const handleDelete = (id: string) => {
    setDeletedId(id);
    setOpenDeleteDialog(true);
  }

  const processDelete = async () => {
    try {
      await inventoryWarehouseService.delWarehouse(deletedId);
      setIsDeleted(true)
    } catch (_) {
      setIsDeleted(false)
    } finally {
      setDeletedId('');
      setOpenDeleteDialog(false);
    }
  }

  const notFound = !dataFiltered.length && !!filterName;

  const header = [
    { id: 'name', label: 'Name' },
    { id: 'location', label: 'Location' },
    { id: 'contact', label: 'Contact' },
    { id: 'createdAt', label: 'CreatedAt' },
    { id: '', label: '' },
  ]

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Warehouse
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpen(true)}
        >
          Add Warehouse
        </Button>
      </Box>

      <Card>
        <TableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={header}
              />
              <TableBody>
                { isLoadData ? 
                  RenderRowsSkeleton({ columns: header.length + 1, isDeletedAllEnabled: true, rowsPerPage: table.rowsPerPage }) :

                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TableRows
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDelete={handleDelete}
                      />
                    ))
                  
                }
             
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <MainDialog
        open={open}
        title="Tambah Gudang"
        children={renderContentAdd()}
        handleClose={() => setOpen(false)}
        singleButton={{
          isEnabled: true,
          btnText: 'Save',
          onClick: () => onSaveWarehouse(),
        }}
      />
      <ConfirmationDialog 
        open={openDeleteDialog}
        title="Delete Confirmation"
        children={<Typography>{strings.deletedData}</Typography>}
        handleClose={() => setOpenDeleteDialog(false)}
        singleButton={{
          isEnabled: true,
          btnText: 'Yes',
          onClick: () => processDelete(),
        }}
      
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<string>('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
