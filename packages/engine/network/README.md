# @slotplate/network

Package with **SignalR** server connection manager. Expandable with necessary requests to the server if required.
Package uses **mobx** as error state management system.

## Installation

```bash
npm install --save @slotplate/network
```

## Usage

See the [Documentation](https://slots-broit.atlassian.net/wiki/spaces/SLOTSBROIT/pages/401440906/g-slots+network).

### Example

Setup network manager:

```javascript
import {
  NetworkManager
} from "@slotplate/network";

class RootStore {
  
  ...
  
  readonly
  network: NetworkManager;

  constructor() {

  ...
    const urlForLogger = `https://kafka-api.geekslots.studio/topics/${NODE_ENV}-${gameId}`
    this.network = new NetworkManager(urlForLogger, lng = 'en');
  }
}
```

Init:
```javascript
store.network.start({
  gameId: "your gameId",
  sessionId: "your seession id",
  url: "server url",
});
```
Use:
```javascript
import { CustomResponseType, RequestStatus, sessionBaseSchema } 
  from '@slotplate/network';


type SessionRequest = CustomResponseType<typeof sessionBaseSchema>

// validator  
const isSessionBase = (obj: unknown): obj is SessionRequest => {
  const validationResult = sessionBaseSchema.safeParse(obj);
  if (validationResult.success) {
  return true;
  }
  return false;
};

const response = await store.network
  .gameRequest<SessionRequest>({ requestType: "session" }, isSessionBase)

switch (response.status) {
  case RequestStatus.Done:
    sessionInfo.parseResponse(response.data);
    break;
  case RequestStatus.Error:
    errorStore.parseError(response.errorData);
    break;
  }
```
use reconnect handler:
```javascript
import { ConnectionRetrySpinner, MessageButton, ModalAlert }
  from '@slotplate/winspinity-ui';

const [isReconnecting, setIsReconnecting] = useState(false);

useEffect(() => {
  store.network.addReconnectCallback(reconnectHandler);
}, []);

const reconnectHandler = useCallback((value: boolean) => {
  setIsReconnecting(value);
}, []);

<ConnectionRetrySpinner
  open={isReconnecting}
  isPortrait={device.isPortrait}
  isMobile={device.platform === Platform.Mobile}
/>
```

use error handler:
```javascript
import { IResponse, RequestStatus } from '@slotplate/network';

export class ErrorStore {
  @observable
  public errorId: Nullable<number> = null;
  @observable
  public errorHeader: Nullable<string> = null;
  @observable
  public errorDescription: Nullable<string> = null;
  
  constructor(private rootStore: IRootStore) {
    makeObservable(this);
    this.rootStore.network.addErrorCallback(this.handleError);
  }

  @action.bound
  public handleError(data: IResponse): void {
    if (data.status === RequestStatus.Error) {
      this.errorId = data.errorData.errorId;
      this.errorHeader = data.errorData.header;
      this.errorDescription = data.errorData.description;
    }
  }

  @action.bound
  public clear(): void {
    this.errorHeader = null;
    this.errorDescription = null;
    this.errorId = null;
  }
}
```