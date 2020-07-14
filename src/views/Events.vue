<template>
  <div class="events px-lg-5 px-4">
    <div
      class="d-flex justify-content-between align-items-start flex-column flex-lg-row"
    >
      <p class="text-left pb-3 description">
        ※イベントの<b>タイトル部分</b>をクリックしてGoogleカレンダーへ移動し、そこでイベントを複製すれば自分のカレンダーにイベントを追加できます。
      </p>
      <div class="ml-lg-5">
        <input
          class="mr-1 checkbox"
          type="checkbox"
          id="display_current"
          v-model="displayCurrent"
        />
        <label for="display_current">開催中のイベントのみ表示</label>
      </div>
    </div>
    <b-card-group deck :class="this.displayCurrent ? 'show_current' : ''">
      <Event
        :class="isCurrent(index)"
        :event-data="event"
        v-for="(event, index) in eventData"
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
import moment from "moment";

export default {
  name: "Events",
  components: { Event },
  props: ["id"],
  data() {
    return {
      now: {}, //現在の時刻情報
      eventData: [], //全てのイベントデータ
      inSessionEvents: [], //開催中のイベントのインデックス
      calendarUrl: "https://www.googleapis.com/calendar/v3/calendars/",
      calendarId: process.env.VUE_APP_CALENDAR_ID,
      apiKey: process.env.VUE_APP_CALENDAR_API_KEY,
      displayCurrent: false,
      event_id: "",
      try_times: 0,
    };
  },
  methods: {
    //google calendar apiを読み込む
    load() {
      // eslint-disable-next-line no-undef
      gapi.load("client", this.init);
    },
    //google calendar apiを利用してイベント情報を取得する
    init() {
      // eslint-disable-next-line no-undef
      gapi.client
        .init({
          apiKey: this.apiKey,
        })
        .then(() => {
          // eslint-disable-next-line no-undef
          return gapi.client.request({
            path:
              this.calendarUrl +
              encodeURIComponent(this.calendarId) +
              "/events",
          });
        })
        .then((response) => {
          const items = response.result.items;
          let j = 0; //eventDataに保存したイベントの個数だけをカウントする変数

          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let start;
            let end;
            //終日イベントの場合はdateTimeでなくてdateプロパティを保持してる
            if ("dateTime" in item.start) {
              start = this.getTimeInfo(item.start.dateTime);
              end = this.getTimeInfo(item.end.dateTime);
            } else {
              start = this.getTimeInfo(item.start.date);
              end = this.getTimeInfo(item.end.date);
            }

            let event_time = this.getEventTime(start, end);
            switch (event_time) {
              //既に終わったイベントは表示しない
              case "past":
                break;

              //開催中のイベントのインデックスを保存＆eventDataに追加
              case "now":
                this.inSessionEvents.push(j);
                this.eventData.push(item);
                j++;
                break;

              //これから開催するイベントをeventDataに追加
              case "future":
                this.eventData.push(item);
                j++;
                break;

              //past, now, future以外の値が返ってきたとき
              default:
                console.log(
                  `予期せぬエラー：getEventTimeが不正な値${event_time}を返しました。`
                );
                break;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //イベントの開始時刻と終了時刻を受け取り、イベントの開催状況（開催中・終わった  ・これから）を返す。
    //note: カレンダーからの遷移を考慮して今日のイベントは全てnowにしてるが、そこは要検討。時分まで見る実装も残しておく。
    getEventTime(start, end) {
      let now = this.now;

      //現在時刻の年月日を合成
      let joinedNowYMD = this.getJoinedYMD(now.year, now.month, now.day);
      //イベント開催時刻の年月日を合成
      let joinedStartYMD = this.getJoinedYMD(
        start.year,
        start.month,
        start.day
      );
      //イベント終了時刻の年月日を合成
      let joinedEndYMD = this.getJoinedYMD(end.year, end.month, end.day);

      //まだ開催されていないイベントの場合
      if (joinedNowYMD - joinedStartYMD < 0) return "future";
      //既に終わったイベントの場合
      if (joinedEndYMD - joinedNowYMD < 0) return "past";

      // note: 時分まで見る場合はこれは消す
      return "now";

      // note: 時分まで見る実装
      // //全日イベントの場合は開始・終了時刻に0が入っている
      // if (start.hour === 0 && end.hour === 0) {
      //   return "now";
      // }
      //
      // //現在時刻の時分を合成
      // let joinedNowHM = this.getJoinedHM(now.hour, now.minute);
      // //イベント開催時刻の時分を合成
      // let joinedStartHM = this.getJoinedHM(start.hour, start.minute);
      // //イベント終了時刻の時分を合成
      // let joinedEndHM = this.getJoinedHM(end.hour, end.minute);
      //
      // //まだ開催されていないイベントの場合
      // if (joinedNowHM - joinedStartHM < 0) return "future";
      // //既に終わったイベントの場合
      // if (joinedEndHM - joinedNowHM < 0) return "past";
      //
      // //イベントが開催中の場合
      // return "now";
    },
    //年月日を受け取り、桁を考慮して合成する関数
    getJoinedYMD(year, month, day) {
      return year * 10 ** 4 + month * 10 ** 2 + day;
    },
    //時分を受け取り、桁を考慮して合成する関数
    getJoinedHM(hour, minute) {
      return hour * 10 ** 2 + minute;
    },
    //世界標準時を引数に取り、年月日などをキーにしたオブジェクトにして返す
    getTimeInfo(dateTime = null) {
      if (dateTime === null) {
        //現在時刻の情報を取得する場合
        return {
          year: parseInt(moment().format("YYYY")),
          month: parseInt(moment().format("MM")),
          day: parseInt(moment().format("DD")),
          hour: parseInt(moment().format("HH")),
          minute: parseInt(moment().format("mm")),
        };
      } else {
        //指定時刻の情報を取得する場合
        return {
          year: parseInt(moment(dateTime).format("YYYY")),
          month: parseInt(moment(dateTime).format("MM")),
          day: parseInt(moment(dateTime).format("DD")),
          hour: parseInt(moment(dateTime).format("HH")),
          minute: parseInt(moment(dateTime).format("mm")),
        };
      }
    },
    //開催中のイベントかどうかを返す関数
    isCurrent(index) {
      if (this.inSessionEvents.includes(index)) {
        return "current";
      } else {
        return "";
      }
    },
    //propsに渡されたidを持つ要素位置へページ内画面遷移する関数
    scrollToEvent(id) {
      //どれだけ待ってもイベントデータが取得できなければAPIの通信が上手くいっていない可能性が高いので、再帰処理を終了する。
      if (this.try_times > 10) {
        console.log("Failed to load event data...");
        return;
      }
      this.try_times++;

      const self = this;
      setTimeout(function () {
        const element = document.getElementById(id);

        //要素が取得できるまで再帰的に実行する
        if (element === null) {
          self.scrollToEvent(id);
        } else {
          //ジャンプ先のイベントの枠線色変更
          element.classList.remove("border-info");
          element.classList.add("border-warning");

          //ジャンプ先のイベントのヘッダー色変更
          const el_event_header = element.getElementsByClassName(
            "card-header"
          )[0];
          el_event_header.classList.remove("bg-info");
          el_event_header.classList.add("bg-warning");

          const element_height = element.offsetTop; //要素のページ内位置を取得
          window.scrollTo(0, element_height - 100); //上部に少し余裕を持たせるため、要素位置-100の高さの位置に移動
        }
      }, 600); //600msくらいだと丁度イベントデータのレンダリングが終わっていが、念のためscrollToIdを再起実行している。
    },
  },
  mounted() {
    if (this.id !== undefined) {
      //Calender APIからのイベントデータの取得が終わり、レンダリングされてから要素を探すようにsetTimeoutする。
      this.scrollToEvent(this.id);
    }
  },
  created() {
    this.now = this.getTimeInfo();
    this.load();
  },
};
</script>

<style scoped lang="scss">
.description {
  flex: 1;
  padding-left: 1em;
  text-indent: -1em;
}

.checkbox {
  transform: scale(1.3);
}

.show_current {
  > :not(.current) {
    display: none;
  }
}

.card-deck {
  justify-content: space-around;
}
</style>
