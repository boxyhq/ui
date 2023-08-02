import ConnectionList from '../ConnectionList/index.lite';
import { ConnectionsWrapperProp } from '../types';

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  return <ConnectionList getConnectionsUrl={props.urls.get} onActionClick={() => {}} />;
}
