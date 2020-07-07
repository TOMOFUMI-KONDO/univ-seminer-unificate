<template>
  <div class="calendar">
    <div id="calendar" class="calender-wrapper">
      <p class="text-left indent pb-3">
        ※イベントをクリックするとイベント詳細へ移動します。
      </p>
      <FullCalendar
        default-view="dayGridMonth"
        :plugins="calendarPlugins"
        :google-calendar-api-key="googleCalendarApiKey"
        :event-sources="eventSources"
        :locale="locale"
      />
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

export default {
  name: "Calendar",
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin, googleCalendarPlugin],
      googleCalendarApiKey: process.env.VUE_APP_CALENDAR_API_KEY,
      eventSources: [
        {
          googleCalendarId: process.env.VUE_APP_CALENDAR_ID,
        },
        {
          //祝日を取得
          googleCalendarId: "japanese__ja@holiday.calendar.google.com",
          className: "is_holiday",
          description: "祝日だよ",
          success: function (events) {
            let dayTops = document.getElementsByClassName("fc-day-top");

            events.forEach((event) => {
              for (let i = 0; i < dayTops.length; i++) {
                let dayTop = dayTops[i];
                if (event.start === dayTop.dataset.date) {
                  dayTop.classList.add("is_holiday");
                }
              }
            });
          },
        },
      ],
      locale: "ja", //カレンダーの表示言語
      try_times: 0, //promiseの再起呼び出しを行った回数
    };
  },
  methods: {
    promise: function (func, resolveFunc, rejectFunc, delay) {
      const self = this;

      new Promise((resolve, reject) => {
        setTimeout(() => {
          let result = func(); //成功したらtrueが返ってくる

          //成功した場合はresolve
          if (result) {
            resolve();
          }
          //失敗した場合は再起実行
          else {
            //どれだけ待ってもイベントデータが取得できなければAPIの通信が上手くいっていない可能性が高いので、再帰処理を終了する。
            if (self.try_times > 10) {
              reject();
              return;
            }
            this.try_times++;

            //再帰呼び出し
            self.promise(func, resolveFunc, rejectFunc, delay);
          }
        }, delay);
      })
        .then(() => {
          resolveFunc();
        })
        .catch(() => {
          rejectFunc();
        });
    },
    //カレンダー内のイベントをクリックしたときの挙動を設定
    //in-sessionページの該当するイベントの箇所に飛ばす
    changeEventHref: function () {
      const self = this;
      const event_elements = self.$el.getElementsByClassName("fc-event");

      //要素の取得に失敗したとき（まだfc-event要素がレンダーされていない。）
      if (event_elements.length === 0) {
        return false;
      }

      event_elements.forEach((element) => {
        //祝日名をクリックしても画面遷移しないようにする
        if (element.classList.contains("is_holiday")) {
          element.href = "";
          element.addEventListener("click", (e) => e.preventDefault());
        }
        //イベントのタイトルを取得してクリック時の画面遷移を設定する
        else {
          let title_element = element.getElementsByClassName("fc-title")[0];
          let title = title_element.innerHTML;
          element.href = `/in-session#${title}`;

          element.addEventListener("click", (e) => {
            e.preventDefault(); //vue-routerで制御するため
            self.$router.push({
              name: "InSession", //note: nameで遷移先を指定しないとparamsが渡せなかった.
              params: { id: title },
            });
          });
        }
      });

      return true;
    },
  },
  mounted() {
    //note: レンダリング直後だとカレンダーのイベントがまだDOMに存在していない（多分非同期で取ってきてる）ため、setTimeoutで調整
    //note: 余裕をもって3秒でしているが、1秒くらいでも大丈夫なはず。
    //note: 適当に時間を置いて実行するのではなく、イベントがレンダーされたときに実行するようにしたかったが難しかったので断念。
    const self = this;
    const preventClick = (e) => e.preventDefault();

    //changeEventHrefが発火するまではクリックしてもリンク先に飛ばないようにする
    this.$el.addEventListener("click", preventClick);
    console.log("Add event listener.");

    const removeClickListener = function () {
      self.$el.removeEventListener("click", preventClick);
      console.log("Removed event listener.");
    };

    const sayFailLoad = () => {
      console.log("Failed to load event data");
    };

    //500msくらい時間を置いて実行すれば大丈夫そうだが、念のためpromiseメソッドで成功するまで再起実行するようにしている。
    this.promise(this.changeEventHref, removeClickListener, sayFailLoad, 500);
  },
};
</script>

<style lang="scss">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";

.calender-wrapper {
  width: 90%;
  max-width: 700px;
  margin: 0 auto;

  .indent {
    padding-left: 1em;
    text-indent: -1em;
  }

  .fc-scroller {
    min-height: 384px;

    .fc-content-skeleton {
      thead {
        .is_holiday {
          .fc-day-number {
            color: rgb(255, 84, 84);
          }
        }

        .fc-sun {
          .fc-day-number {
            color: rgb(255, 84, 84);
          }
        }
      }

      tbody {
        .is_holiday {
          border-color: rgb(255, 84, 84);
          background-color: rgb(255, 84, 84);
        }
      }
    }
  }
}
</style>
