import PropTypes from 'prop-types';
// @mui
import { Box, Link, Stack, Typography, Breadcrumbs } from '@mui/material';
//
import LinkItem from './LinkItem';

// ----------------------------------------------------------------------

CustomBreadcrumbs.propTypes = {
  sx: PropTypes.object,
  action: PropTypes.node,
  links: PropTypes.array,
  heading: PropTypes.string,
  moreLink: PropTypes.array,
  activeLast: PropTypes.bool,
};

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}) {
  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ mb: { xs: 1, sm: 2 }, ...sx }}>
      <Stack 
        direction="row" 
        alignItems="center"
        sx={{
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* HEADING */}
          {heading && (
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs 
              separator={<Separator />} 
              {...other}
              sx={{
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                },
                '& .MuiBreadcrumbs-li': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              {links.map((link) => (
                <LinkItem
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {action && (
          <Box 
            sx={{ 
              flexShrink: 0,
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 1, sm: 0 },
            }}
          >
            {action}
          </Box>
        )}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
    />
  );
}
