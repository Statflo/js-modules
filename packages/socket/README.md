# @statflo/socket

A promised StompJS and SockJS class for managing subscriptions easily.

## Usage

```js
import SocketService from '@statflo/socket';

const service = new SocketService('http://foo.bar/live', { connectHeader: 'foobar' }); // where { connectHeader } is an instance of Stomp.StompHeaders

service.connect()
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
exchange.unsubscribe('foo/bar');
```

### Messaging 

```js
service.message('foo/bar', 'Hello world!');
```

## License
MIT Statflo Inc.
