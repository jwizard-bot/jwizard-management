import { config } from '@/config';

type ReturnProps = {
  shortSHA: string;
  vcsLink: string;
};

const useDeploymentInfo = (): ReturnProps => {
  const shortSHA = config.buildVersion?.substring(0, 7) || 'UNKNOWN';
  const vcsLink = `${config.orgLink}/${config.repositoryName}/tree/${config.buildVersion}`;

  return {
    shortSHA,
    vcsLink,
  };
};

export { useDeploymentInfo };
