import { TableCell, TableRow, Typography, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { fDateTime } from '../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

BidRecordTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
};

export default function BidRecordTableRow({ index, row }) {
  const { marketName, userName, mobile, session, number, amount, createdAt } = row;

  const navigate = useNavigate();

  const handleUserClick = () => {
    if (!userName) return;
    navigate(`${PATH_DASHBOARD.user.list}?search=${encodeURIComponent(userName)}`);
  };

  return (
    <TableRow hover>
      <TableCell align="left">{index + 1}</TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {marketName}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Link
          component="button"
          type="button"
          onClick={handleUserClick}
          sx={{ fontWeight: 600, textDecoration: 'underline' }}
        >
          {userName}
        </Link>
      </TableCell>
      <TableCell align="left">{mobile || '—'}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {session}
      </TableCell>

      <TableCell align="left">₹{amount?.toLocaleString('en-IN') || 0}</TableCell>

      <TableCell align="left">{number}</TableCell>

      <TableCell align="left" maxWidth="190px">
        {fDateTime(createdAt) || '—'}
      </TableCell>
    </TableRow>
  );
}
