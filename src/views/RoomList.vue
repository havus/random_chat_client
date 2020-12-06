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
        <b-button variant="primary" @click="createNewRoom" :disabled="isLoading">
          <b-spinner v-if="isLoading" small type="grow"></b-spinner>
          <span>Create New Room</span>
        </b-button>
      </b-col>
    </b-row>

    <b-row class="mt-5">
      <b-col sm="12" md="6">
        <b-spinner v-if="isLoading" variant="primary" label="Spinning"></b-spinner>

        <b-list-group class="mt-5">
          <b-list-group-item
            v-for="(room, i) in allRoom"
            :key="i"
            class="d-flex row align-items-center"
          >
            <p class="m-0">{{ room.attributes.name }}</p>
            <b-button variant="primary" class="ml-auto" :to="'/room/' + room.id">Join</b-button>
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
    isLoading: false,
  }),
  async created() {
    this.isLoading = true;
    this.allRoom = await this.getRooms();

    const socket = new WebSocket('ws://localhost:3000/cable');
    console.log('WebSocket is connected.');

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

      while (this.allRoom.length > 7) {
        this.allRoom.pop();
      }
    };

    this.isLoading = false;
  },
  methods: {
    async createNewRoom() {
      this.isLoading = true;

      const response = await this.submitData('rooms', { name: this.newRoomName });

      if (!response.errors) {
        this.newRoomName = '';
      }

      this.isLoading = false;
    },
  },
};
</script>

<style>

</style>
