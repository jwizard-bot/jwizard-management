import * as React from 'react';
import { config } from '@/config';
import { Container, Divider, Grid, Link, Typography, useMediaQuery, useTheme } from '@mui/material';

const AppFooter: React.FC = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentYear = new Date().getFullYear();
  const shortSHA = config.buildVersion?.substring(0, 7) || 'UNKNOWN';
  const vcsLink = `${config.orgLink}/${config.repositoryName}/tree/${config.buildVersion}`;

  return (
    <Container maxWidth="xl">
      <Divider />
      <Grid container spacing={2} mt={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
          <Link href="https://status.jwizard.pl" target="_blank">
            Service status
          </Link>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
          <Typography>
            &copy; {currentYear} by{' '}
            <Link href={config.orgLink} target="_blank">
              JWizard
            </Link>
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
          <Typography>
            Build:{' '}
            <Link href={vcsLink} target="_blank">
              {shortSHA}
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export { AppFooter };
