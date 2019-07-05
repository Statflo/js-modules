# @statflo/socket

A promised StompJS and SockJS class for managing subscriptions easily.

## IE Support Warning

This library does not currently work in any Windows browser due to missing polyfills. Please see this [`@stompJS` documentation](https://stomp-js.github.io/guide/stompjs/rx-stomp/ng2-stompjs/2018/06/29/pollyfils-for-stompjs-v5.html) for more details.

At the time there is no plan to implement polyfill support in this library as the `text-encoding` package recommended by the `@stompJS` team is no longer being maintained and will add ~200kB to the socket client. If you need to support any legacy/Widnows browsers, it is recommended to use version `2.0.0` of this package.

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
