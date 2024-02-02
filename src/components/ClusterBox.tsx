import React from 'react';
import { Field } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { LinkButton, Icon, Toggletip, useTheme2 } from '@grafana/ui';

type ClusterBoxProps = {
  cluster?: Field;
  highlightedCluster?: { [key: string]: string };
  onHighlight: (clusterName?: string) => void;
};

const ClusterBox: React.FC<ClusterBoxProps> = ({ cluster, highlightedCluster, onHighlight }) => {
  const theme = useTheme2();
  const labels = cluster?.labels || {};
  const toggleTipContent = (
    <ul
      className={cx(css`
        list-style-type: none;
      `)}
    >
      <li>
        <strong>Name: </strong>
        {highlightedCluster?.['DisplayName'] || ''}
      </li>
      <li>
        <strong>K8s version: </strong>
        {highlightedCluster?.['Version']}
      </li>
      <li>
        <strong>Management cluster name: </strong>
        {highlightedCluster?.['cluster_name']}
      </li>
      <li>
        <strong>Connected: </strong>
        {highlightedCluster?.['Connected'] ? 'yes' : 'no'}
      </li>
    </ul>
  );

  const boxColor = labels.DisplayName?.startsWith('ds3') ? theme.colors.warning : theme.colors.primary;

  const toggleTipFooter = (
    <>
      <LinkButton fill="outline" href={`${labels.RancherServerURL}/dashboard/c/${labels.Name}`} target="_blank">
        Manage cluster&nbsp;
        <Icon name="external-link-alt" />
      </LinkButton>
    </>
  );

  return (
    <Toggletip
      title={
        <h3>
          <Icon name="monitor" />
          &nbsp;
          {labels.DisplayName}
        </h3>
      }
      content={toggleTipContent}
      footer={toggleTipFooter}
      closeButton={true}
      placement="auto"
      onClose={() => onHighlight(undefined)}
    >
      <div
        className={cx(css`
          width: 2rem;
          height: 2rem;
          margin: 3px;
          border-radius: 5px;
          cursor: pointer;
          background: ${boxColor.main};
          transition: all 0.1s linear;
          &:hover {
            background-color: ${boxColor.shade};
            transform: scale(1.2);
          }
        `)}
        onClick={(event) => onHighlight(cluster?.labels?.DisplayName)}
      />
    </Toggletip>
  );
};

export default ClusterBox;
