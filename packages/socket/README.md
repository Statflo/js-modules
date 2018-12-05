# @statflo/socket

A promised StompJS and SockJS class for managing subscriptions easily.

## Usage

```js
import SocketService from '@statflo/socket';

const service = new SocketService('http://foo.bar/live');

service.connect({})  // where {} are Stomp headers
    .then(frame => {
        console.log(frame);
    })
    .catch(error => {
        console.error(error);
    });
```

### Subscription

```js
const exchange = service.subscribe('foo/bar', function(message) {
    console.log(message);
});
exchange.unsubscribe();
```

### Messaging 

```js
service.message('foo/bar', 'Hello world!');
```

## License
MIT Statflo Inc.
