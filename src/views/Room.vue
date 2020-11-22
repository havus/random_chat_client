<template>
  <h1>Room {{ $route.params.id }}</h1>
</template>

<script>
export default {
  name: 'Room',
  components: {
  },
  created() {
    console.log('WebSocket is connected.');

    const socket = new WebSocket('ws://localhost:3000/cable');

    socket.onopen = () => {
      const subscribeMsg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          id: this.$route.params.id,
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

<style>

</style>
