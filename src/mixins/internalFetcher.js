export default {
  methods: {
    async getRooms() {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/api/v1/rooms.json`);
      const { data } = await response.json();

      return data;
    },
    async getMessagesFromRoom(roomId) {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/api/v1/rooms/${roomId}.json`);
      const { data } = await response.json();

      return data.attributes.messages;
    },
  },
};
