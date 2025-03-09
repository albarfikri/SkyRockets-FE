/* eslint-disable @typescript-eslint/no-shadow */
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface RowsSkeletonProps {
  columns: number;
  isDeletedAllEnabled?: boolean,
  rowsPerPage: number;
}

export function RenderRowsSkeleton({ columns, isDeletedAllEnabled = false, rowsPerPage }: RowsSkeletonProps) {
  return Array.from({ length: rowsPerPage }, (_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from({ length: columns }, (_, colIndex) => (
        <TableCell key={colIndex}>
          {(isDeletedAllEnabled ? colIndex === 0 || colIndex === columns - 1 : colIndex === columns - 1) ? (
            <Skeleton variant="circular" width={30} height={30} animation="wave" />
          ) : (
            <Skeleton variant="text" width={120} height={30} animation="wave" />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));
}
