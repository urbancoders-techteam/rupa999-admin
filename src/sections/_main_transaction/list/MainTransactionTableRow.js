import { Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fCurrency } from '../../../utils/formatNumber';
import { fDateTimeSplit } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

MainTransactionTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    _id: PropTypes.string,
    date: PropTypes.string,
    particulars: PropTypes.string,
    debit: PropTypes.number,
    credit: PropTypes.number,
    balance: PropTypes.number,
    user: PropTypes.shape({
      name: PropTypes.string,
      userName: PropTypes.string,
      number: PropTypes.string,
      mobile: PropTypes.string,
    }),
    admin: PropTypes.object,
    remarks: PropTypes.string,
    marketName: PropTypes.string,
    gameName: PropTypes.string,
  }),
};

export default function MainTransactionTableRow({ row, index }) {
  const { date, particulars, debit, credit, balance, admin, marketName, gameName, user } = row;

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
        align="center"
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
          {index + 1}.
        </Typography>
      </TableCell>

      <TableCell
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
            minWidth: '120px',
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.875, 1),
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

      {/* User Name Column */}
      {user.name && (
        <TableCell
          sx={(theme) => ({
            padding: theme.spacing(1, 1.5),
            [theme.breakpoints.down('sm')]: {
              padding: theme.spacing(0.5, 0.25),
              maxWidth: '130px',
              paddingRight: '15px',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              padding: theme.spacing(0.75, 0.75),
            },
            [theme.breakpoints.up('lg')]: {
              padding: theme.spacing(1.25, 2),
            },
          })}
        >
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              fontSize: '0.875rem',
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              overflow: { xs: 'hidden', sm: 'visible' },
              textOverflow: { xs: 'ellipsis', sm: 'clip' },
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.65rem',
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '0.75rem',
              },
              [theme.breakpoints.up('lg')]: {
                fontSize: '0.9375rem',
              },
            })}
          >
            {user?.name || user?.userName || '—'}
          </Typography>
          <Typography
            variant="body2"
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
            {user?.number || user?.mobile || '—'}
          </Typography>
        </TableCell>
      )}

      <TableCell
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5, 0.25),
            maxWidth: '120px',
            paddingRight: '10px',
          },
          [theme.breakpoints.between('sm', 'md')]: {
            padding: theme.spacing(0.75, 0.75),
          },
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.25, 2),
          },
        })}
      >
        <Stack
          spacing={{ xs: 0.125, sm: 0.5 }}
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
            minWidth: '50px',
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
            minWidth: '50px',
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
          {fCurrency(credit > 0 ? credit : '0')}
        </Typography>
      </TableCell>

      <TableCell
        align="left"
        sx={(theme) => ({
          padding: theme.spacing(1, 1.5),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.75, 0.5),
            minWidth: '50px',
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
