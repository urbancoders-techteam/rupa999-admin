import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  // alpha,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/system';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
};

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
}) {
  // const theme = useTheme();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      padding: theme.spacing(1, 1.5),
      fontSize: '0.875rem',
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.75, 0.5),
        fontSize: '0.7rem',
        fontWeight: 500,
      },
      [theme.breakpoints.between('sm', 'md')]: {
        padding: theme.spacing(0.875, 1),
        fontSize: '0.8rem',
      },
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(1.25, 2),
        fontSize: '0.9375rem',
      },
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.white,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <TableHead sx={sx}>
      <StyledTableRow>
        {onSelectAllRows && (
          <StyledTableCell 
            padding="checkbox"
            sx={(theme) => ({
              padding: theme.spacing(1, 0.5),
              [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(0.5, 0.25),
                '& .MuiCheckbox-root': {
                  padding: theme.spacing(0.5),
                  '& svg': {
                    fontSize: '1.125rem',
                  },
                },
              },
            })}
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
              size="small"
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  padding: theme.spacing(0.5),
                },
              })}
            />
          </StyledTableCell>
        )}

        {headLabel.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={(theme) => ({ 
              width: headCell.width, 
              minWidth: headCell.minWidth,
              color: theme.palette.common.white,
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              overflow: { xs: 'hidden', sm: 'visible' },
              textOverflow: { xs: 'ellipsis', sm: 'clip' },
            })}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
                sx={(theme) => ({ 
                  textTransform: 'capitalize',
                  color: theme.palette.common.white,
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  '&:hover': {
                    color: theme.palette.common.white,
                    opacity: 0.8,
                  },
                  '&.Mui-active': {
                    color: theme.palette.common.white,
                    fontWeight: { xs: 700, sm: 800 },
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: theme.palette.common.white,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.7rem',
                    padding: theme.spacing(0.25, 0),
                  },
                })}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Box
                component="span"
                sx={(theme) => ({
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.7rem',
                  },
                })}
              >
                {headCell.label}
              </Box>
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}
