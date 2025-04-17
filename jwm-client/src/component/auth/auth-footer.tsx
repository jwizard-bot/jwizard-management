import * as React from 'react';
import { config } from '@/config';
import { useDeploymentInfo } from '@/hook/use-deployment-info';
import { Container, Divider, Grid, Link, Typography } from '@mui/material';

const AuthFooter: React.FC = (): React.ReactElement => {
  const currentYear = new Date().getFullYear();
  const { shortSHA, vcsLink } = useDeploymentInfo();

  return (
    <Container maxWidth="xl">
      <Divider />
      <Grid container spacing={2} my={4}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
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
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
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

export { AuthFooter };
