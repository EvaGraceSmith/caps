'use strict';

const io = require('socket.io-client');
const capsSocket = io.connect('http://localhost:3000/caps');


capsSocket.on('connect', () => {
    console.log('Vendor connected to CAPS hub');

    capsSocket.emit('join', '1-206-flowers');
    capsSocket.emit('get-all-delievered-orders', {store: '1-206-flowers'});
});

capsSocket.on('disconnect', () => {
    console.log('Vendor disconnected from CAPS hub');
});


capsSocket.on('delivered', (payload) => {
    console.log(`Thank you for your order ${payload.customer}`);
});

// Simulating new customer orders every 5 seconds
setInterval(() => {
    const order = {
        store: '1-206-flowers',
        orderId: generateOrderId(),
        driverId: 0,
        customer: generateCustomerName(),
        address: generateAddress(),
    };

    capsSocket.emit('pickup', order);
}, 5000);

function generateOrderId() {
    return Math.floor(Math.random() * 1000);
}

function generateCustomerName() {
    const names = ['John Smith', 'Jane Doe', 'Mike Johnson'];
    return names[Math.floor(Math.random() * names.length)];
}

function generateAddress() {
    const addresses = ['Seattle, WA', 'Portland, OR', 'San Francisco, CA'];
    return addresses[Math.floor(Math.random() * addresses.length)];
}

