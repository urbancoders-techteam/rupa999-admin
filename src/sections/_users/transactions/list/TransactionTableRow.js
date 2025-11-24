import { Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fCurrency } from '../../../../utils/formatNumber';
import { fDateTimeSplit } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

TransactionTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    _id: PropTypes.string,
    date: PropTypes.string,
    particulars: PropTypes.string,
    debit: PropTypes.number,
    credit: PropTypes.number,
    balance: PropTypes.number,
    user: PropTypes.object,
    admin: PropTypes.object,
    remarks: PropTypes.string,
    marketName: PropTypes.string,
    gameName: PropTypes.string,
  }),
};

export default function TransactionTableRow({ row, index }) {
  const { date, particulars, debit, credit, balance, admin, marketName, gameName } = row;

  return (
    <TableRow 
      hover
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      })}
    >
      <TableCell
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Typography 
          variant="body2"
          sx={(theme) => ({
            fontSize: '0.875rem',
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.7rem',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              fontSize: '0.8rem',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: '0.9375rem',
            },
          })}
        >
          {index + 1}
        </Typography>
      </TableCell>

      <TableCell 
        width="200px"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
            width: '120px',
            minWidth: '120px',
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
            width: '160px',
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        {date ? (
          <Stack spacing={{ xs: 0.25, sm: 0.5 }}>
            <Typography 
              variant="body2"
              sx={(theme) => ({
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.7rem',
                },
                [theme.breakpoints.between('sm', 'md')]: {
                  fontSize: '0.8rem',
                },
                [theme.breakpoints.up('lg')]: {
                  fontSize: '0.9375rem',
                },
              })}
            >
              {fDateTimeSplit(date).date}
            </Typography>
            <Typography 
              variant="body2"
              color="text.secondary"
              sx={(theme) => ({
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.65rem',
                },
                [theme.breakpoints.between('sm', 'md')]: {
                  fontSize: '0.75rem',
                },
                [theme.breakpoints.up('lg')]: {
                  fontSize: '0.875rem',
                },
              })}
            >
              {fDateTimeSplit(date).time}
            </Typography>
          </Stack>
        ) : (
          <Typography 
            variant="body2"
            sx={(theme) => ({
              fontSize: '0.875rem',
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.7rem',
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '0.8rem',
              },
              [theme.breakpoints.up('lg')]: {
                fontSize: '0.9375rem',
              },
            })}
          >
            —
          </Typography>
        )}
      </TableCell>

      <TableCell
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Stack 
          spacing={{ xs: 0.25, sm: 0.5 }}
          sx={{
            overflow: 'hidden',
          }}
        >
          <Typography 
            variant="subtitle1"
            sx={(theme) => ({
              fontSize: '0.9375rem',
              fontWeight: 600,
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              overflow: { xs: 'hidden', sm: 'visible' },
              textOverflow: { xs: 'ellipsis', sm: 'clip' },
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.75rem',
                fontWeight: 500,
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '0.875rem',
              },
              [theme.breakpoints.up('lg')]: {
                fontSize: '1rem',
              },
            })}
          >
            {particulars}
          </Typography>
          {marketName && (
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={(theme) => ({
                fontSize: '0.8125rem',
                whiteSpace: { xs: 'nowrap', sm: 'normal' },
                overflow: { xs: 'hidden', sm: 'visible' },
                textOverflow: { xs: 'ellipsis', sm: 'clip' },
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.55rem',
                },
                [theme.breakpoints.between('sm', 'md')]: {
                  fontSize: '0.75rem',
                },
                [theme.breakpoints.up('lg')]: {
                  fontSize: '0.75rem',
                },
              })}
            >
              {marketName || '—'}
            </Typography>
          )}
          {debit && (
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={(theme) => ({
                fontSize: '0.75rem',
                whiteSpace: { xs: 'nowrap', sm: 'normal' },
                overflow: { xs: 'hidden', sm: 'visible' },
                textOverflow: { xs: 'ellipsis', sm: 'clip' },
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.625rem',
                },
                [theme.breakpoints.between('sm', 'md')]: {
                  fontSize: '0.7rem',
                },
                [theme.breakpoints.up('lg')]: {
                  fontSize: '0.8125rem',
                },
              })}
            >
              {debit ? `${gameName} - ${fCurrency(debit)}` : '—'}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell 
        align="left"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Typography 
          variant="body2" 
          color={debit > 0 ? 'error.main' : 'text.secondary'}
          sx={(theme) => ({
            fontSize: '0.875rem',
            whiteSpace: { xs: 'nowrap', sm: 'normal' },
            overflow: { xs: 'hidden', sm: 'visible' },
            textOverflow: { xs: 'ellipsis', sm: 'clip' },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.7rem',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              fontSize: '0.8rem',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: '0.9375rem',
            },
          })}
        >
          {debit > 0 ? fCurrency(debit) : '-'}
        </Typography>
      </TableCell>

      <TableCell 
        align="left"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Typography 
          variant="body2" 
          color={credit > 0 ? 'success.main' : 'text.secondary'}
          sx={(theme) => ({
            fontSize: '0.875rem',
            whiteSpace: { xs: 'nowrap', sm: 'normal' },
            overflow: { xs: 'hidden', sm: 'visible' },
            textOverflow: { xs: 'ellipsis', sm: 'clip' },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.7rem',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              fontSize: '0.8rem',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: '0.9375rem',
            },
          })}
        >
          { fCurrency(credit > 0 ? credit : '0')}
        </Typography>
      </TableCell>

      <TableCell 
        align="left"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Typography 
          variant="body2" 
          fontWeight="fontWeightMedium"
          sx={(theme) => ({
            fontSize: '0.875rem',
            whiteSpace: { xs: 'nowrap', sm: 'normal' },
            overflow: { xs: 'hidden', sm: 'visible' },
            textOverflow: { xs: 'ellipsis', sm: 'clip' },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.7rem',
              fontWeight: 500,
            },
            [theme.breakpoints.between('sm', 'md')]: {
              fontSize: '0.8rem',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: '0.9375rem',
            },
          })}
        >
          {fCurrency(balance)}
        </Typography>
      </TableCell>

      <TableCell 
        align="left"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Typography 
          variant="body2"
          sx={(theme) => ({
            fontSize: '0.875rem',
            whiteSpace: { xs: 'nowrap', sm: 'normal' },
            overflow: { xs: 'hidden', sm: 'visible' },
            textOverflow: { xs: 'ellipsis', sm: 'clip' },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.7rem',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              fontSize: '0.8rem',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: '0.9375rem',
            },
          })}
        >
          {admin?.name || '—'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

