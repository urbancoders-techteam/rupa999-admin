import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// redux
import {
  createRoleAsync,
  updateRoleAsync,
  getRoleByIdAsync,
} from '../../../redux/services/role_services';
import {
  getAllRoutesAsync,
  getPermissionByRoleIdAsync,
  createPermissionAsync,
} from '../../../redux/services/auth_role_permission';

// -------------------------------------------------------------

RolePermissionForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentRole: PropTypes.object,
};

// Standard nested actions for all routes
const NESTED_ACTIONS = ['add', 'view', 'edit', 'delete'];

// -------------------------------------------------------------

export default function RolePermissionForm({ isEdit = false, isView = false, currentRole }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Redux state
  const { routes, permissions } = useSelector((state) => state.permission);
  const { loading: roleLoading } = useSelector((state) => state.role);
  const { loading: permissionLoading } = useSelector((state) => state.permission);

  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  // Group routes by menuMaster or parent to create sections
  const permissionSections = useMemo(() => {
    if (!routes || routes.length === 0) return [];

    // Filter only active routes
    const activeRoutes = routes.filter((route) => route.status !== false);

    // Group routes by menuMaster (or parent if menuMaster is not available)
    const groupedRoutes = {};
    activeRoutes.forEach((route) => {
      const sectionKey = route.menuMaster || route.parent || '';
      if (!groupedRoutes[sectionKey]) {
        groupedRoutes[sectionKey] = [];
      }
      groupedRoutes[sectionKey].push({
        _id: route._id,
        key: route._id?.toString() || route._id, // Use route ID as key (convert to string)
        label: route.title,
        path: route.path,
        hasNested: true,
        nestedActions: NESTED_ACTIONS,
      });
    });

    // Convert to array format
    return Object.keys(groupedRoutes).map((sectionTitle) => ({
      title: sectionTitle,
      permissions: groupedRoutes[sectionTitle],
    }));
  }, [routes]);

  // Build validation schema dynamically based on routes
  const RolePermissionSchema = useMemo(() => {
    const schemaShape = {
      designationName: Yup.string().required('Designation name is required'),
    };

    permissionSections.forEach((section) => {
      section.permissions.forEach((permission) => {
        schemaShape[permission.key] = Yup.object().shape({
          enabled: Yup.boolean(),
          ...(permission.hasNested &&
            permission.nestedActions.reduce((acc, action) => {
              acc[action] = Yup.boolean();
              return acc;
            }, {})),
        });
      });
    });

    return Yup.object().shape(schemaShape);
  }, [permissionSections]);

  // Build default values based on routes
  const defaultValues = useMemo(() => {
    const defaults = {
      designationName: currentRole?.designationName || currentRole?.roleName || '',
    };

    permissionSections.forEach((section) => {
      section.permissions.forEach((permission) => {
        defaults[permission.key] = currentRole?.permissions?.[permission.key] || {
          enabled: false,
          ...(permission.hasNested &&
            permission.nestedActions.reduce((acc, action) => {
              acc[action] = false;
              return acc;
            }, {})),
        };
      });
    });

    return defaults;
  }, [currentRole, permissionSections]);

  const methods = useForm({
    resolver: yupResolver(RolePermissionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Load routes on mount
  useEffect(() => {
    if (!routesLoaded) {
      dispatch(getAllRoutesAsync()).then(() => {
        setRoutesLoaded(true);
      });
    }
  }, [dispatch, routesLoaded]);

  // Load permissions if editing or viewing
  useEffect(() => {
    if ((isEdit || isView) && currentRole?._id && routesLoaded && !permissionsLoaded) {
      dispatch(getPermissionByRoleIdAsync(currentRole._id)).then(() => {
        setPermissionsLoaded(true);
      });
    }
  }, [isEdit, isView, currentRole?._id, routesLoaded, permissionsLoaded, dispatch]);

  // Update form when permissions are loaded (for both edit and view mode)
  useEffect(() => {
    if ((isEdit || isView) && permissionsLoaded && permissions.length > 0 && routesLoaded) {
      // Map API permissions to form format using route ID as key
      // API returns: { _id: routeId, add, view, edit, delete, ... }
      const permissionMap = {};
      permissions.forEach((perm) => {
        // API returns _id directly as route ID (not nested in routeId)
        const routeId = perm._id?.toString() || perm.routeId?.toString() || perm.routeId?._id?.toString();

        if (routeId) {
          permissionMap[routeId] = {
            enabled: perm.add || perm.view || perm.edit || perm.delete,
            add: perm.add || false,
            view: perm.view || false,
            edit: perm.edit || false,
            delete: perm.delete || false,
          };
        }
      });

      // Update form with loaded permissions
      // Use setTimeout to ensure form is ready
      setTimeout(() => {
        Object.keys(permissionMap).forEach((key) => {
          methods.setValue(key, permissionMap[key], { shouldValidate: false });
        });
      }, 100);
    }
  }, [isEdit, isView, permissionsLoaded, permissions, routesLoaded, methods]);

  useEffect(() => {
    if ((isEdit && currentRole) || (isView && currentRole)) {
      // Don't reset if permissions are being loaded
      if (!permissionsLoaded) {
        reset(defaultValues);
      }
    }
  }, [isEdit, isView, currentRole, reset, defaultValues, permissionsLoaded]);

  const onSubmit = async (data) => {
    try {
      // Step 1: Create or Update Role
      let roleId = currentRole?._id;

      if (isEdit && roleId) {
        // Update existing role
        const updateResult = await dispatch(
          updateRoleAsync({
            id: roleId,
            data: { roleName: data.designationName },
          })
        ).unwrap();
        roleId = updateResult?.data?._id || roleId;
      } else {
        // Create new role
        const createResult = await dispatch(
          createRoleAsync({ roleName: data.designationName })
        ).unwrap();
        roleId = createResult?.data?._id;
      }

      if (!roleId) {
        throw new Error('Failed to create/update role');
      }

      // Step 2: Format permissions for API
      const permissionItems = [];

      permissionSections.forEach((section) => {
        section.permissions.forEach((permission) => {
          const permData = data[permission.key];
          if (permData?.enabled) {
            // Use route ID directly as key
            permissionItems.push({
              routeId: permission._id || permission.key, // route._id (MongoDB ObjectId)
              add: permData.add || false,
              view: permData.view || false,
              edit: permData.edit || false,
              delete: permData.delete || false,
            });
          }
        });
      });

      // Step 3: Create/Update Permissions
      if (permissionItems.length > 0) {
        await dispatch(
          createPermissionAsync({
            roleId,
            permission: permissionItems,
          })
        ).unwrap();
      }

      enqueueSnackbar(
        isEdit ? 'Role and permissions updated successfully!' : 'Role and permissions created successfully!',
        { variant: 'success' }
      );
      navigate(PATH_DASHBOARD.designation.list);
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(error?.message || 'An error occurred', { variant: 'error' });
    }
  };

  const handleBack = () => navigate(PATH_DASHBOARD.designation.list);

  // Handle select all / unselect all toggle
  const handleToggleSelectAll = () => {
    const newState = !allSelected;
    setAllSelected(newState);

    permissionSections.forEach((section) => {
      section.permissions.forEach((permission) => {
        const updates = {
          enabled: newState,
          ...(permission.hasNested &&
            permission.nestedActions.reduce((acc, action) => {
              acc[action] = newState;
              return acc;
            }, {})),
        };
        methods.setValue(permission.key, updates, { shouldValidate: true });
      });
    });
  };

  // Handle main checkbox change
  const handleMainCheckboxChange = (permissionKey, checked) => {
    const permission = permissionSections.flatMap((s) => s.permissions).find(
      (p) => p.key === permissionKey
    );
    if (!permission || !permission.hasNested) return;

    // If unchecking main checkbox, uncheck all nested checkboxes
    if (!checked) {
      const updates = { enabled: false };
      permission.nestedActions.forEach((action) => {
        updates[action] = false;
      });
      methods.setValue(permissionKey, updates, { shouldValidate: true });
    } else {
      // If checking main checkbox, keep nested checkboxes as they are
      methods.setValue(`${permissionKey}.enabled`, true, { shouldValidate: true });
    }
  };

  // Handle nested checkbox change
  const handleNestedCheckboxChange = (permissionKey, actionKey, checked) => {
    const permission = permissionSections.flatMap((s) => s.permissions).find(
      (p) => p.key === permissionKey
    );

    if (!permission) return;

    // Get the latest form values (after the field update)
    const currentPermissionValue = getValues(permissionKey);

    // Build the updated permission object with the new value
    const updatedPermission = {
      ...currentPermissionValue,
      [actionKey]: checked,
    };

    // Check if any nested checkbox is checked
    const hasAnyChecked = permission.nestedActions.some(
      (action) => updatedPermission[action] === true
    );

    // Update the main checkbox and ensure all values are synced
    methods.setValue(permissionKey, {
      ...updatedPermission,
      enabled: hasAnyChecked,
    }, { shouldValidate: true });
  };

  // -------------------------------------------------------------

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Designation Name */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <RHFTextField
                    name="designationName"
                    label="Designation Name"
                    disabled={isView}
                    fullWidth
                  />
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Permission Sections */}
          <Grid item xs={12}>
            {permissionSections.length === 0 && routesLoaded && (
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No routes available. Please add routes first.
                </Typography>
              </Card>
            )}
            <Grid container spacing={2}>
              {permissionSections.map((section, sectionIndex) => (
                <Grid item xs={12} md={12} key={section.title}>
                  <Card
                    sx={{
                      p: 3,
                      boxShadow: 3,
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    {!isView && permissionSections.length > 0 && (
                      <LoadingButton
                        onClick={handleToggleSelectAll}
                        variant={allSelected ? 'contained' : 'outlined'}
                        color={allSelected ? 'error' : 'primary'}
                        size="medium"
                        sx={{ minWidth: 140, mt: -1, mb: 2 }}
                      >
                        {allSelected ? 'Unselect All' : 'Select All'}
                      </LoadingButton>
                    )}

                    {section.title !== '' && (
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {section.title}
                      </Typography>
                    )}

                    <Grid container spacing={2}>
                      {section.permissions.map((permission, permIndex) => {
                        const permissionValue = watch(permission.key);
                        const isEnabled = permissionValue?.enabled || false;

                        return (
                          <Grid item xs={12} sm={6} key={permission.key}>
                            <Box>
                              {/* Main Permission Checkbox */}
                              <Controller
                                name={`${permission.key}.enabled`}
                                control={control}
                                render={({ field }) => (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={isEnabled}
                                        onChange={(e) => {
                                          field.onChange(e.target.checked);
                                          handleMainCheckboxChange(permission.key, e.target.checked);
                                        }}
                                        disabled={isView}
                                      />
                                    }
                                    label={permission.label}
                                    sx={{
                                      mb: permission.hasNested ? 1 : 0,
                                      '& .MuiFormControlLabel-label': {
                                        fontWeight: 500,
                                      },
                                    }}
                                  />
                                )}
                              />

                              {/* Nested Action Checkboxes */}
                              {permission.hasNested && (
                                <Box sx={{ ml: 4, mt: 1 }}>
                                  <Stack spacing={1}>
                                    {permission.nestedActions.map((action) => (
                                      <Controller
                                        key={action}
                                        name={`${permission.key}.${action}`}
                                        control={control}
                                        render={({ field: nestedField }) => (
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={nestedField.value || false}
                                                onChange={(e) => {
                                                  const newValue = e.target.checked;
                                                  // Update the field value
                                                  nestedField.onChange(newValue);
                                                  // Use setTimeout to ensure form state is updated
                                                  setTimeout(() => {
                                                    handleNestedCheckboxChange(
                                                      permission.key,
                                                      action,
                                                      newValue
                                                    );
                                                  }, 0);
                                                }}
                                                disabled={isView}
                                                size="small"
                                              />
                                            }
                                            label={action === 'add' ? 'Create' : action.charAt(0).toUpperCase() + action.slice(1)}
                                          />
                                        )}
                                      />
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {isView ? (
                <Stack alignItems="flex-end">
                  <LoadingButton onClick={handleBack} type="button" variant="contained">
                    Back
                  </LoadingButton>
                </Stack>
              ) : (
                <Stack
                  gap="10px"
                  justifyContent="flex-end"
                  flexDirection="row"
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || roleLoading || permissionLoading}
                  >
                    {isEdit ? 'Save Changes' : 'Create Role'}
                  </LoadingButton>

                  <LoadingButton
                    onClick={handleBack}
                    type="button"
                    variant="contained"
                    color="error"
                  >
                    Cancel
                  </LoadingButton>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

