export default {
  methods: {
    async submitData(recordType, payload, recordId) {
      let url = null;
      let method = null;

      if (recordId) {
        url = `${process.env.VUE_APP_BASE_URL}/api/v1/${recordType}/${recordId}.json`;
        method = 'PUT';
      } else {
        url = `${process.env.VUE_APP_BASE_URL}/api/v1/${recordType}.json`;
        method = 'POST';
      }

      try {
        const options = {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();

        return responseJson;
      } catch (err) {
        return err;
      }
    },
  },
};
