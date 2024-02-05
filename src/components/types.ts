export type Cluster = {
  name?: string;
  displayName?: string;
  k8sVersion?: string;
  rancherServerURL?: string;
  mgmtClusterName?: string;
  connected?: boolean;
  diskPressure?: boolean;
  memoryPressure?: boolean;
  ready?: boolean;
  readyReason?: string;
  readyMessage?: string;
};

export type Clusters = {
  [key: string]: Cluster;
};
