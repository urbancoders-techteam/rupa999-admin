import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fCurrency } from '../../../utils/formatNumber';
import { fDateTimeSplit } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const STANDARD_CELL_SX = {
  py: { xs: 0.75, sm: 0.875, md: 1, lg: 1.25 },
  px: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
};

const COMPACT_CELL_SX = {
  py: { xs: 0.5, sm: 0.75, md: 1, lg: 1.25 },
  px: { xs: 0.25, sm: 0.75, md: 1.5, lg: 2 },
};

const MONEY_CELL_SX = {
  ...STANDARD_CELL_SX,
  minWidth: { xs: '50px', sm: 'auto' },
};

const MOBILE_TRUNCATE_SX = {
  whiteSpace: { xs: 'nowrap', sm: 'normal' },
  overflow: { xs: 'hidden', sm: 'visible' },
  textOverflow: { xs: 'ellipsis', sm: 'clip' },
};

const FONT_SIZE = {
  body: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem', lg: '0.9375rem' },
  dateTime: { xs: '0.65rem', sm: '0.75rem', md: '0.8125rem', lg: '0.875rem' },
  userName: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem', lg: '0.9375rem' },
  meta: { xs: '0.625rem', sm: '0.7rem', md: '0.75rem', lg: '0.8125rem' },
  particulars: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem', lg: '1rem' },
  market: { xs: '0.55rem', sm: '0.75rem', md: '0.8125rem', lg: '0.75rem' },
};

// ----------------------------------------------------------------------

MainTransactionTableRow.propTypes = {
  index: PropTypes.number,
  variant: PropTypes.oneOf(['ledger', 'deposit']),
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
      whatsappNumber: PropTypes.string,
    }),
    admin: PropTypes.object,
    remarks: PropTypes.string,
    marketName: PropTypes.string,
    gameName: PropTypes.string,
    utrNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    utrNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    transactionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modeOfPayment: PropTypes.string,
    paymentMode: PropTypes.string,
    paymentMethod: PropTypes.string,
  }),
};

function MainTransactionTableRow({ row = {}, index = 0, variant = 'ledger' }) {
  const {
    date,
    particulars,
    debit = 0,
    credit = 0,
    balance = 0,
    admin,
    marketName,
    gameName,
    user: userData,
  } = row || {};
  const navigate = useNavigate();
  const user = userData || {};
  const userMobile = user.number || user.mobile || user.whatsappNumber || '';
  const formattedDateTime = date ? fDateTimeSplit(date) : null;
  const isDepositHistory = variant === 'deposit';
  const utrNo = row.utrNo || row.utrNumber || row.transactionId || '—';
  const modeOfPayment = row.modeOfPayment || row.paymentMode || row.paymentMethod || '—';

  const handleUserClick = () => {
    if (!userMobile) return;
    navigate(`${PATH_DASHBOARD.user.list}?search=${encodeURIComponent(userMobile)}`);
  };

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <TableCell align="center" sx={STANDARD_CELL_SX}>
        <Typography variant="body2" sx={{ fontSize: FONT_SIZE.body }}>
          {index}.
        </Typography>
      </TableCell>

      <TableCell
        sx={{
          ...STANDARD_CELL_SX,
          minWidth: { xs: '120px', sm: 'auto' },
        }}
      >
        {formattedDateTime ? (
          <Stack spacing={{ xs: 0.25, sm: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: FONT_SIZE.body,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {formattedDateTime.date}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: FONT_SIZE.dateTime,
                whiteSpace: 'nowrap',
              }}
            >
              {formattedDateTime.time}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ fontSize: FONT_SIZE.body }}>
            —
          </Typography>
        )}
      </TableCell>

      {/* User Name Column */}
      <TableCell
        sx={{
          ...COMPACT_CELL_SX,
          maxWidth: { xs: '130px', sm: 'none' },
          pr: { xs: '15px', sm: 0.75, md: 1.5, lg: 2 },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            ...MOBILE_TRUNCATE_SX,
            fontSize: FONT_SIZE.userName,
          }}
        >
          {user.name || user.userName || '—'}
        </Typography>
        {userMobile ? (
          <Link
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            onClick={handleUserClick}
            sx={{
              ...MOBILE_TRUNCATE_SX,
              display: 'block',
              maxWidth: '100%',
              fontSize: FONT_SIZE.meta,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {userMobile}
          </Link>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              ...MOBILE_TRUNCATE_SX,
              fontSize: FONT_SIZE.meta,
            }}
          >
            —
          </Typography>
        )}
      </TableCell>

      {isDepositHistory ? (
        <>
          <TableCell align="left" sx={MONEY_CELL_SX}>
            <Typography
              variant="body2"
              color={credit > 0 ? 'success.main' : 'text.secondary'}
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {credit > 0 ? fCurrency(credit) : '—'}
            </Typography>
          </TableCell>

          <TableCell align="left" sx={MONEY_CELL_SX}>
            <Typography
              variant="body2"
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
                fontWeight: 500,
              }}
            >
              {fCurrency(balance) || '₹ 0'}
            </Typography>
          </TableCell>

          <TableCell sx={COMPACT_CELL_SX}>
            <Typography
              variant="body2"
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {utrNo}
            </Typography>
          </TableCell>

          <TableCell sx={COMPACT_CELL_SX}>
            <Typography
              variant="body2"
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {modeOfPayment}
            </Typography>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell
            sx={{
              ...COMPACT_CELL_SX,
              maxWidth: { xs: '120px', sm: 'none' },
              pr: { xs: '10px', sm: 0.75, md: 1.5, lg: 2 },
            }}
          >
            <Stack spacing={{ xs: 0.125, sm: 0.5 }} sx={{ overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  ...MOBILE_TRUNCATE_SX,
                  fontSize: FONT_SIZE.particulars,
                  fontWeight: { xs: 500, sm: 600 },
                }}
              >
                {particulars || '—'}
              </Typography>

              {marketName && (
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    ...MOBILE_TRUNCATE_SX,
                    fontSize: FONT_SIZE.market,
                  }}
                >
                  {marketName}
                </Typography>
              )}
              {Boolean(debit && gameName) && (
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    ...MOBILE_TRUNCATE_SX,
                    fontSize: FONT_SIZE.meta,
                  }}
                >
                  {`${gameName} - ${fCurrency(debit)}`}
                </Typography>
              )}
            </Stack>
          </TableCell>

          <TableCell align="left" sx={MONEY_CELL_SX}>
            <Typography
              variant="body2"
              color={debit > 0 ? 'error.main' : 'text.secondary'}
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {debit > 0 ? fCurrency(debit) : '—'}
            </Typography>
          </TableCell>

          <TableCell align="left" sx={MONEY_CELL_SX}>
            <Typography
              variant="body2"
              color={credit > 0 ? 'success.main' : 'text.secondary'}
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {credit > 0 ? fCurrency(credit) : '—'}
            </Typography>
          </TableCell>

          <TableCell align="left" sx={MONEY_CELL_SX}>
            <Typography
              variant="body2"
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
                fontWeight: 500,
              }}
            >
              {fCurrency(balance) || '₹ 0'}
            </Typography>
          </TableCell>

          <TableCell sx={COMPACT_CELL_SX}>
            <Typography
              variant="body2"
              sx={{
                ...MOBILE_TRUNCATE_SX,
                fontSize: FONT_SIZE.body,
              }}
            >
              {admin?.name || '—'}
            </Typography>
          </TableCell>
        </>
      )}

    </TableRow>
  );
}

export default memo(MainTransactionTableRow);
