import { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import { HOST_API_KEY } from '../../config-global';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSnackbar } from '../../components/snackbar';
import { uploadApkAsync, getApkInfoAsync } from '../../redux/services/apk_services';
import Iconify from '../../components/iconify';

export default function ApkUploadPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [apkInfo, setApkInfo] = useState(null);
  const fileInputRef = useRef(null);

  const loadApkInfo = useCallback(async () => {
    try {
      const result = await dispatch(getApkInfoAsync()).unwrap();
      setApkInfo(result.data);
    } catch (error) {
      // No APK exists yet, that's okay
      setApkInfo(null);
    }
  }, [dispatch]);

  useEffect(() => {
    loadApkInfo();
  }, [loadApkInfo]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.apk')) {
      enqueueSnackbar('Please select an APK file', { variant: 'error' });
      return;
    }

    // Validate file size (100 MB = 100 * 1024 * 1024 bytes)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      enqueueSnackbar('File size exceeds 100 MB limit', { variant: 'error' });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select an APK file', { variant: 'error' });
      return;
    }

    setUploading(true);
    try {
      await dispatch(uploadApkAsync(selectedFile)).unwrap();
      enqueueSnackbar('APK uploaded successfully', { variant: 'success' });
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reload APK info
      await loadApkInfo();
    } catch (error) {
      enqueueSnackbar(error || 'Failed to upload APK', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / (k ** i)) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Helmet>
        <title> APK Upload | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="APK Upload"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'APK Upload' },
          ]}
        />

        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Upload APK File</Typography>
              <Typography variant="body2" color="text.secondary">
                Upload an APK file (maximum size: 100 MB). If an APK already exists, it will be replaced.
              </Typography>

              <Box>
                <input
                  accept=".apk"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  aria-label="Select APK file"
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<Iconify icon="eva:upload-fill" />}
                  disabled={uploading}
                  aria-label="Select APK file button"
                >
                  Select APK File
                </Button>
              </Box>

              {selectedFile && (
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Selected File:</strong> {selectedFile.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Size:</strong> {formatFileSize(selectedFile.size)}
                  </Typography>
                </Alert>
              )}

              {uploading && (
                <Box>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Uploading APK...
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              >
                {uploading ? 'Uploading...' : 'Upload APK'}
              </Button>
            </Stack>
          </Card>

          {apkInfo && (
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Current APK Information</Typography>
                <Box>
                  <Typography variant="body2">
                    <strong>File Name:</strong> {apkInfo.fileName}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>File Size:</strong> {formatFileSize(apkInfo.fileSize)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Uploaded At:</strong> {formatDate(apkInfo.uploadedAt)}
                  </Typography>
                  {apkInfo.uploadedBy && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Uploaded By:</strong> {apkInfo.uploadedBy.name || apkInfo.uploadedBy.email || 'N/A'}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  href={`${HOST_API_KEY}/apk/download`}
                  target="_blank"
                  startIcon={<Iconify icon="eva:download-fill" />}
                >
                  Download APK
                </Button>
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </>
  );
}
