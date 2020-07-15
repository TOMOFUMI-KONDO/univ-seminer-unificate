<template>
  <div class="events px-lg-5 px-4">
    <p class="text-left">登録済みのイベントを削除することができます。</p>
    <button @click="remove(tmp)">delete</button>
    <b-card-group deck>
      <Event
        :event-data="event"
        v-for="event in eventData"
        :key="event.summary"
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
import Event from "../components/Event.vue";

export default {
  name: "Events",
  components: { Event },
  data() {
    return {
      eventData: [], //全てのイベントデータ
      calendarUrl: "https://www.googleapis.com/calendar/v3/calendars/",
      calendarId: process.env.VUE_APP_CALENDAR_ID,
      apiKey: process.env.VUE_APP_CALENDAR_API_KEY,
      tmp: "2r5apt3s261dpam5l7jkc6ui1k",
    };
  },
  methods: {
    //google calendar apiを読み込む
    load(method, eventId = null) {
      window.gapi.load("client", () => this.init(method, eventId));
    },
    //google calendar apiを利用してイベント情報を取得する
    init(method, eventId) {
      window.gapi.client
        .init({
          apiKey: this.apiKey,
          clientId:
            "1043408526545-l8rn9a0b8qe07hq5hq20u8gp9fden1ai.apps.googleusercontent.com",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: "https://www.googleapis.com/auth/calendar",
        })
        .then(() => {
          console.log(
            this.calendarUrl +
              encodeURIComponent(this.calendarId) +
              "/events" +
              (method === "delete" ? `/${eventId}` : "")
          );
          console.log(method.toUpperCase());
          if (method === "get") {
            // eslint-disable-next-line no-undef
            return window.gapi.client.request({
              path:
                this.calendarUrl +
                encodeURIComponent(this.calendarId) +
                "/events",
            });
          } else {
            return window.gapi.auth2.getAuthInstance();
            // return window.gapi.client.request({
            //   path:
            //     this.calendarUrl +
            //     encodeURIComponent(this.calendarId) +
            //     "/events" +
            //     `/${eventId}`,
            //   method: method.toUpperCase(),
            // });
          }
        })
        .then((response) => {
          if (method === "get") {
            const items = response.result.items;

            for (let i = 0; i < items.length; i++) {
              this.eventData.push(items[i]);
            }
          } else {
            console.log(response);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    remove(eventId) {
      this.load("delete", eventId);
    },
  },
  created() {
    this.load("get");
  },
};
</script>

<style scoped lang="scss">
.card-deck {
  justify-content: space-around;
}
</style>
