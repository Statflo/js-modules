exports.over = function() {
    const listeners = new Map();
    
    return {
        subscribe(topic: string, callback: Function) {
            listeners.set(topic, callback);

            return {
                unsubscribe(topic: string) {
                    listeners.delete(topic);
                }
            };
        },
        send(topic: string, headers: object, message: string) {
            listeners.get(topic)(message);
        },
        connect(headers: object, callback: Function) {
            setTimeout(callback, 100);
        },
        disconnect(callback: Function) {
            setTimeout(callback, 100);
        }
    };
};
