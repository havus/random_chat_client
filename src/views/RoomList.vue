<template>
  <b-container>
    <b-row class="my-1 mt-5">
      <b-col sm="2">
        <label for="create-new-room">New Room Name</label>
      </b-col>
      <b-col sm="4">
        <b-form-input id="create-new-room" type="text" v-model="newRoomName"></b-form-input>
      </b-col>
      <b-col sm="2">
        <b-button variant="primary" @click="createNewRoom">Create New Room</b-button>
      </b-col>
    </b-row>

    <b-row class="mt-5">
      <b-col sm="12" md="6">
        <b-list-group class="mt-5">
          <b-list-group-item
            v-for="(room, i) in allRoom"
            :key="i"
            class="d-flex row align-items-center"
          >
            <p class="m-0">{{ room.attributes.name }}</p>
            <b-button variant="primary" class="ml-auto">Join</b-button>
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
  mixins: [InternalFetcher, InternalPoster],
  data: () => ({
    newRoomName: '',
    allRoom: [],
  }),
  async created() {
    this.allRoom = await this.getRooms();

    console.log('WebSocket is connected.');

    const socket = new WebSocket('ws://localhost:3000/cable');

    socket.onopen = () => {
      const subscribeMsg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'AllRoomChannel',
        }),
      };

      socket.send(JSON.stringify(subscribeMsg));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.type === 'ping') { return; }
      if (!response.message) { return; }

      const newRoom = response.message.data;

      if (newRoom) {
        this.allRoom.unshift(newRoom);
      }
    };
  },
  methods: {
    async createNewRoom() {
      const response = await this.submitData('rooms', { name: this.newRoomName });

      if (!response.errors) {
        this.newRoomName = '';
      }
    },
  },
};
</script>

<style>

</style>
