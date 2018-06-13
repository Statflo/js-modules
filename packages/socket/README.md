# @statflo/socket

A promised StompJS and SocketJS class for managing subscriptions easily.

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
service.subscribe('foo/bar', function(message) {});
service.unsubscribe('foo/bar');
```

### Messaging 

```js
service.message('foo/bar', 'Hello world!');
```

## License
MIT Statflo Inc.
