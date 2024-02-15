import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import ClusterBox from './ClusterBox';
import { Clusters } from './types';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const [highlightedClusterName, setHighlightedClusterName] = React.useState<string | undefined>(undefined);

  console.log('DATA', data);

  // const clusters = data.series.map((serie) => serie.fields.find((field) => field.name === CLUSTERS_METRIC));

  // const clusterWidth = width / clusters.length
  // const clusterHeight = height / clusters.length
  // const clusterArea = width * height / clusters.length;
  // const panelAspectRatio = width / height;
  // const clusterWidth = Math.sqrt(panelAspectRatio * clusterArea)
  // const clusterHeight = Math.sqrt(clusterArea / panelAspectRatio);

  // TODO(jtomasek): useMemo here
  // const highlightedCluster = React.useMemo(
  //   () =>
  //     highlightedClusterName
  //       ? data.series.reduce((clusterDetails, currentSerie) => {
  //           const field = currentSerie.fields.find((field) =>
  //             [field.labels?.Name, field.labels?.DisplayName].includes(highlightedClusterName)
  //           );
  //           if (field) {
  //             console.log('Field:', field);
  //             const n: string = field?.labels?.['__name__'] || '';
  //             switch (n) {
  //               case 'rancher_cluster_status':
  //                 return { ...clusterDetails, ...(field?.labels || {}) };
  //               case 'cluster_not_connected':
  //                 return { ...clusterDetails, Connected: !field?.values[0] };
  //               default:
  //                 return clusterDetails;
  //             }
  //           }
  //           return clusterDetails;
  //         }, {})
  //       : {},
  //   [highlightedClusterName, data.series]
  // );

  const clusters = data.series.reduce<Clusters>((result, currentSerie) => {
    const field = currentSerie.fields[1];
    const clusterName = field.labels?.Name;
    if (clusterName) {
      switch (currentSerie.refId) {
        case 'clustersInfo':
          return {
            ...result,
            [clusterName]: {
              ...(result[clusterName] || {}),
              name: field.labels?.Name,
              displayName: field.labels?.DisplayName,
              k8sVersion: field.labels?.Version,
              rancherServerURL: field.labels?.RancherServerURL,
              mgmtClusterName: field.labels?.['cluster_name'],
            },
          };
        case 'connected':
          return { ...result, [clusterName]: { ...result[clusterName], connected: field.values.get(0) } };
        case 'diskPressure':
          return { ...result, [clusterName]: { ...result[clusterName], diskPressure: field.values.get(0) } };
        case 'memoryPressure':
          return { ...result, [clusterName]: { ...result[clusterName], memoryPressure: field.values.get(0) } };
        case 'ready':
          return {
            ...result,
            [clusterName]: {
              ...result[clusterName],
              ready: field.values.get(0),
              readyReason: field.labels?.Reason,
              readyMessage: field.labels?.Message,
            },
          };
        default:
          return result;
      }
    }
    return result;
  }, {});

  // if (data.state === LoadingState.Loading) {
  //   return <LoadingPlaceholder text="Loading..." />;
  // } else {
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {/* <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        // viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {clusters.map((cluster, i) => (
          <g key={i} fill="white" stroke="white" strokeWidth="1" transform={`translate(${i * clusterWidth + clusterWidth / 2}, 0)`}>
            <rect style={{ fill: theme.colors.primary.main, cursor: 'pointer' }} width={clusterWidth - 1} height={clusterHeight - 1} rx={8} onClick={(event) => {alert('Hi!')}} />
          </g>
        ))}
      </svg> */}

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-around' }}>
        {Object.values(clusters).map((cluster, i) => (
          <ClusterBox
            key={i}
            cluster={cluster}
            onHighlight={setHighlightedClusterName}
            highlightedClusterName={highlightedClusterName}
          />
        ))}
      </div>

      {/* <div className={styles.textBox}>
          Highlighted cluster: {highlightedClusterName}
          {options.showSeriesCount && <div>Number of series: {data.series.length}</div>}
          <div>Text option value: {options.text}</div>
        </div> */}
    </div>
  );
  // }
};
