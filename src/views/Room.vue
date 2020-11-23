<template>
  <b-container>
    <h1 class="mt-5">Room {{ roomId }}</h1>

    <b-row class="my-1 mt-5">
      <b-col sm="2">
        <label for="create-new-message">New Message</label>
      </b-col>
      <b-col sm="4">
        <b-form-input id="create-new-message" type="text" v-model="newMessage"></b-form-input>
      </b-col>
      <b-col sm="2">
        <b-button variant="primary" @click="createNewMessage">Post</b-button>
      </b-col>
    </b-row>

    <b-row class="mt-5">
      <b-col sm="12" md="6">
        <b-list-group class="mt-5">
          <b-list-group-item
            v-for="(message, i) in allMessages"
            :key="i"
            class="d-flex row align-items-center"
          >
            {{ message.text }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InternalFetcher from '../mixins/internalFetcher';
import InternalPoster from '../mixins/internalPoster';

export default {
  name: 'Room',
  mixins: [InternalFetcher, InternalPoster],
  components: {
  },
  computed: {
    roomId() {
      return this.$route.params.id;
    },
  },
  data: () => ({
    newMessage: '',
    allMessages: [],
  }),
  async created() {
    this.allMessages = await this.getMessagesFromRoom(this.roomId);

    const socket = new WebSocket('ws://localhost:3000/cable');
    console.log('WebSocket is connected.');

    socket.onopen = () => {
      const subscribeMsg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          id: this.roomId,
          channel: 'RoomChannel',
        }),
      };

      socket.send(JSON.stringify(subscribeMsg));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.type === 'ping') { return; }
      if (!response.message) { return; }

      const newMessage = response.message;

      if (newMessage) {
        this.allMessages.unshift(newMessage);
      }
    };
  },
  methods: {
    async createNewMessage() {
      if (!this.newMessage) {
        return;
      }

      const response = await this.submitData('messages', {
        text: this.newMessage,
        user_id: 1,
        room_id: this.roomId,
      });

      if (!response.errors) {
        this.newMessage = '';
      }
    },
  },
};
</script>

<style>

</style>
