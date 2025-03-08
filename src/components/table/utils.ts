
// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

export function getComparator<T, K extends keyof T>(
  order: 'asc' | 'desc',
  orderBy: K
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T, K extends keyof T>(a: T, b: T, orderBy: K): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

// ----------------------------------------------------------------------

type ApplyFilterProps<T> = {
  inputData: T[];
  filterValue?: string;
  filterBy?: string;
  comparator: (a: T, b: T) => number;
};

export function applyFilter<T>({
  inputData,
  comparator,
  filterValue,
  filterBy,
}: ApplyFilterProps<T>): T[] {
  // Sort the data while maintaining stability
  const stabilizedData = inputData.map((el, index) => [el, index] as const);

  stabilizedData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedData.map((el) => el[0]);

  // Apply filtering if a filterValue is provided
  if (filterValue && filterBy) {
    filteredData = filteredData.filter((item) => {
      const value = item[filterBy as keyof T];
      return typeof value === 'string' && value.toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  return filteredData;
}
