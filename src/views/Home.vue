<template>
  <div class="home">
    <h1>Hello World</h1>
    <button @click="openConnection">Open Connection</button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    // HelloWorld,
  },
  created() {
    console.log('WebSocket is connected.');

    const socket = new WebSocket('ws://localhost:3000/cable');

    socket.onopen = () => {
      const subscribeMsg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          id: 1,
          channel: 'RoomChannel',
        }),
      };

      socket.send(JSON.stringify(subscribeMsg));
    };

    socket.onmessage = (event) => {
      const response = event.data;
      const msg = JSON.parse(response);

      if (msg.type === 'ping') { return; }

      console.log('FROM RAILS: ', msg);
    };
  },
  methods: {
    openConnection() {
    },
  },
};
</script>
