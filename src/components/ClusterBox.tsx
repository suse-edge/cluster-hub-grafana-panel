import React from 'react';
import { css, cx } from '@emotion/css';
import { LinkButton, Icon, useTheme2, Modal, Tooltip } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { Cluster } from './types';
// import { Toggletip } from './Toggletip';

const getBoxColor = (cluster: Cluster, theme: GrafanaTheme2) => {
  if (!cluster.connected) {
    return theme.colors.secondary;
  }
  if (cluster.diskPressure || cluster.memoryPressure) {
    return theme.colors.warning;
  }
  if (!cluster.ready) {
    return theme.colors.error;
  }
  return theme.colors.primary;
};

type ClusterBoxProps = {
  cluster: Cluster;
  onHighlight: (clusterName?: string) => void;
  highlightedClusterName?: string;
};

const ClusterBox: React.FC<ClusterBoxProps> = ({ cluster, onHighlight, highlightedClusterName }) => {
  const theme = useTheme2();
  const {
    name,
    displayName,
    k8sVersion,
    rancherServerURL,
    mgmtClusterName,
    connected,
    diskPressure,
    memoryPressure,
    ready,
    readyReason,
    readyMessage,
  } = cluster;

  const toggleTipContent = (
    <ul
      className={cx(css`
        list-style-type: none;
      `)}
    >
      <li>
        <strong>Name: </strong>
        {displayName || ''}
      </li>
      <li>
        <strong>K8s version: </strong>
        {k8sVersion}
      </li>
      <li>
        <strong>Management cluster name: </strong>
        {mgmtClusterName}
      </li>
      <li>
        <strong>Connected: </strong>
        {connected ? 'yes' : 'no'}
      </li>
      <li>
        <strong>Disk pressure: </strong>
        {diskPressure ? 'yes' : 'no'}
      </li>
      <li>
        <strong>Memory pressure: </strong>
        {memoryPressure ? 'yes' : 'no'}
      </li>
      <li>
        <strong>Status: </strong>
        {ready ? 'Ready' : 'Not ready'}
      </li>
      {readyReason && readyMessage && (
        <li>
          <strong>Status info: </strong>
          {`${readyReason}: ${readyMessage}`}
        </li>
      )}
    </ul>
  );

  const toggleTipFooter = (
    <>
      <LinkButton
        fill="outline"
        style={{ textDecoration: 'none', color: theme.colors.primary.main }}
        href={`${rancherServerURL}/dashboard/c/${name}`}
        target="_blank"
        rel="noopener nofollow"
        onClick={() => onHighlight()}
      >
        Manage cluster&nbsp;
        <Icon name="external-link-alt" />
      </LinkButton>
    </>
  );

  const boxColor = React.useMemo(() => getBoxColor(cluster, theme), [cluster, theme]);

  return (
    // <Toggletip
    //   title={
    //     <h3>
    //       <Icon name="monitor" />
    //       &nbsp;
    //       {cluster.displayName}
    //     </h3>
    //   }
    //   content={toggleTipContent}
    //   footer={toggleTipFooter}
    //   closeButton={true}
    //   placement="auto"
    //   onClose={() => onHighlight(undefined)}
    // >
    <>
      <Tooltip content={cluster.displayName || ''}>
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
          onClick={(event) => onHighlight(name)}
        />
      </Tooltip>
      <Modal
        title={cluster.displayName || ''}
        isOpen={cluster.name === highlightedClusterName}
        closeOnBackdropClick
        closeOnEscape
        onDismiss={onHighlight}
      >
        {toggleTipContent}
        <Modal.ButtonRow>{toggleTipFooter}</Modal.ButtonRow>
      </Modal>
    </>
    // </Toggletip>
  );
};

export default ClusterBox;
