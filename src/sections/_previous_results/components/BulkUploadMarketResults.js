import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import { HOST_API_KEY } from '../../../config-global';
import { getAllMarketResultsAsync } from '../../../redux/services/market_result_services';
import { getAllMarketsAsync } from '../../../redux/services/market_services';

// ----------------------------------------------------------------------

BulkUploadMarketResults.propTypes = {
  selectedMarketId: PropTypes.string,
};

// Market helpers
const getMarketLabel = (option) => (option?.name || option || '');
const getMarketId = (option) => (option?._id || option || '');
const isMarketEqual = (option, value) => getMarketId(option) === getMarketId(value);

export default function BulkUploadMarketResults({ selectedMarketId: propSelectedMarketId }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  // Redux state
  const { marketList, loading: marketLoading } = useSelector((state) => state.market);

  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
    success: 0,
    failed: 0,
    currentRow: 0,
  });
  const [uploadResult, setUploadResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch markets when dialog opens
  useEffect(() => {
    if (open) {
      dispatch(getAllMarketsAsync({ page: 1, limit: 1000 }));
    }
  }, [dispatch, open]);

  // Set market from prop if provided
  useEffect(() => {
    if (propSelectedMarketId && marketList.length > 0) {
      const market = marketList.find((m) => m._id === propSelectedMarketId);
      if (market) {
        setSelectedMarket(market);
      }
    }
  }, [propSelectedMarketId, marketList]);

  const handleOpen = () => {
    setOpen(true);
    setProgress({
      current: 0,
      total: 0,
      percentage: 0,
      success: 0,
      failed: 0,
      currentRow: 0,
    });
    setUploadResult(null);
    setSelectedFile(null);
    // Reset market selection if prop is not provided
    if (!propSelectedMarketId) {
      setSelectedMarket(null);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setOpen(false);
      setSelectedFile(null);
      setProgress({
        current: 0,
        total: 0,
        percentage: 0,
        success: 0,
        failed: 0,
        currentRow: 0,
      });
      setUploadResult(null);
      // Reset market if prop is not provided
      if (!propSelectedMarketId) {
        setSelectedMarket(null);
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        '.xlsx',
        '.xls',
      ];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validTypes.includes(file.type) && !['xlsx', 'xls'].includes(fileExtension)) {
        enqueueSnackbar('Please select a valid Excel file (.xlsx or .xls)', { variant: 'error' });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select a file', { variant: 'error' });
      return;
    }

    const marketId = selectedMarket?._id || getMarketId(selectedMarket);
    if (!marketId) {
      enqueueSnackbar('Please select a market first', { variant: 'error' });
      return;
    }

    setUploading(true);
    setProgress({
      current: 0,
      total: 0,
      percentage: 0,
      success: 0,
      failed: 0,
      currentRow: 0,
    });
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const url = `${HOST_API_KEY}/market-results/bulk-upload-stream?marketsId=${marketId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let isDone = false;

      const processChunk = async () => {
        const result = await reader.read();
        isDone = result.done;

        if (!isDone && result.value) {
          buffer += decoder.decode(result.value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));

                if (data.type === 'connected') {
                  // Upload started
                  console.log('Upload started');
                } else if (data.type === 'progress') {
                  // Update progress
                  setProgress({
                    current: data.current || 0,
                    total: data.total || 0,
                    percentage: data.percentage || 0,
                    success: data.success || 0,
                    failed: data.failed || 0,
                    currentRow: data.currentRow || 0,
                  });
                } else if (data.type === 'complete') {
                  // Upload complete
                  setUploadResult(data.data);
                  setProgress((prev) => ({
                    ...prev,
                    percentage: 100,
                  }));
                  enqueueSnackbar('Bulk upload completed successfully!', { variant: 'success' });
                  // Refresh market results list
                  dispatch(getAllMarketResultsAsync());
                } else if (data.type === 'error') {
                  throw new Error(data.message || 'Upload failed');
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          });
        }
      };

      // Process chunks until done
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        await processChunk();
        if (isDone) break;
      }
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar(error.message || 'Upload failed. Please try again.', { variant: 'error' });
      setUploadResult({
        success: progress.success,
        failed: progress.failed,
        errors: [],
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:upload-fill" />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Bulk Upload (XLSX)
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            position: 'fixed',
            // bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
            maxHeight: '85vh',
            borderRadius: '16px 16px 0 0',
            boxShadow: theme.shadows[24],
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Bulk Upload Market Results</Typography>
            <IconButton
              onClick={handleClose}
              disabled={uploading}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Upload an XLSX file with columns: <strong>Date, openPana, openDigit, closeDigit, closePana</strong>
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Default values: percentage=&quot;no&quot;, session=&quot;close&quot;
              </Typography>
            </Alert>

            <Grid container>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={marketList || []}
                  loading={marketLoading}
                  value={selectedMarket}
                  onChange={(event, newValue) => {
                    setSelectedMarket(newValue);
                  }}
                  getOptionLabel={getMarketLabel}
                  isOptionEqualToValue={isMarketEqual}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Market"
                      placeholder="Choose a market"
                      required
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id || option}>
                      {getMarketLabel(option)}
                    </li>
                  )}
                  disabled={uploading}
                />
              </Grid>
            </Grid>

            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<Iconify icon="eva:file-fill" />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                fullWidth
                sx={{ mb: 2 }}
              >
                {selectedFile ? selectedFile.name : 'Select XLSX File'}
              </Button>
            </Box>

            {uploading && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Uploading...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {progress.current} / {progress.total} ({progress.percentage}%)
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress.percentage}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip
                    label={`Success: ${progress.success}`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`Failed: ${progress.failed}`}
                    color="error"
                    size="small"
                  />
                  {progress.currentRow > 0 && (
                    <Chip
                      label={`Row: ${progress.currentRow}`}
                      color="info"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
            )}

            {uploadResult && !uploading && (
              <Alert
                severity={uploadResult.failed > 0 ? 'warning' : 'success'}
                sx={{ mt: 2 }}
              >
                <Typography variant="body2">
                  Upload completed! Success: {uploadResult.success}, Failed: {uploadResult.failed}
                </Typography>
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold">
                      Errors:
                    </Typography>
                    {uploadResult.errors.slice(0, 5).map((error, index) => (
                      <Typography key={index} variant="caption" display="block">
                        Row {error.row}: {error.error}
                      </Typography>
                    ))}
                    {uploadResult.errors.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        ... and {uploadResult.errors.length - 5} more errors
                      </Typography>
                    )}
                  </Box>
                )}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} disabled={uploading}>
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || uploading || !selectedMarket}
            startIcon={<Iconify icon="eva:upload-fill" />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

