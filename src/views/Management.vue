<template>
  <div class="events px-lg-5 px-4">
    <p class="text-left mb-5">登録済みのイベントを削除することができます。</p>
    <b-card-group deck>
      <EventOnManage
        :event-data="event"
        v-for="event in eventData"
        :key="event.id"
      />
    </b-card-group>
    <p class="text-right font-weight-bold">
      東北大学のイベントページは
      <a
        href="https://www.tohoku.ac.jp/japanese/2020/cate_event/"
        target="_blank"
        >こちら</a
      >
    </p>
  </div>
</template>

<script>
import EventOnManage from "../components/EventOnManage";

export default {
  name: "Management",
  components: { EventOnManage },
  data() {
    return {
      eventData: [], //全てのイベントデータ
      calendarUrl: "https://www.googleapis.com/calendar/v3/calendars/",
      calendarId: this.$calendarId,
      apiKey: process.env.VUE_APP_CALENDAR_API_KEY,
    };
  },
  methods: {
    load() {
      window.gapi.load("client", this.init);
    },
    //gapiの初期化・認証
    init() {
      window.gapi.client
        .init({
          apiKey: this.apiKey,
        })
        .then(() => {
          return window.gapi.client.request({
            path:
              this.calendarUrl +
              encodeURIComponent(this.calendarId) +
              "/events",
          });
        })
        .then((response) => {
          const items = response.result.items;

          for (let i = 0; i < items.length; i++) {
            this.eventData.push(items[i]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.load();
  },
};
</script>

<style scoped lang="scss">
.card-deck {
  justify-content: space-around;
}
</style>
