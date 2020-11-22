export default {
  methods: {
    async getRooms() {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/api/v1/rooms.json`);
      const { data } = await response.json();

      return data;
    },
  },
};
