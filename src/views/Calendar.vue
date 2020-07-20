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
          googleCalendarId: this.$calendarId,
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
    //引数のDOM要素から、そのイベントの開催日を取得する
    getEventDateTime: function (element) {
      const td = element.parentNode; //elementを含むtd(fc-event-container)を取得
      const tr = td.parentNode;
      const tds = Array.from(tr.childNodes); //tdを含むtrの子要素をすべて取得し配列に
      const index = tds.indexOf(td); //tdのインデックスを取得

      const thead = tr.parentNode.previousSibling;

      //対応するtheadのclassListを取得
      const class_list = Array.from(
        thead.firstChild.childNodes.item(index).classList
      );

      //イベントの開催時期を示すクラスを取得
      const event_period = class_list.find((element) =>
        element.match(/fc-(past|today|future)/)
      );

      return event_period.replace("fc-", "");
    },
    //カレンダー内のイベントをクリックしたときの挙動を設定
    //eventsページの該当するイベントの箇所に飛ばす
    modifyEventElement: function () {
      const self = this;
      const event_elements = self.$el.getElementsByClassName("fc-event");

      //要素の取得に失敗したとき（まだfc-event要素がレンダーされていない。）。その月にイベントがない時も失敗する。
      if (event_elements.length === 0) {
        return false;
      }

      event_elements.forEach((element) => {
        //祝日名をクリックしても画面遷移しないようにする
        if (element.classList.contains("is_holiday")) {
          element.href = "";
          element.addEventListener("click", (e) => e.preventDefault());
        } else {
          //イベントのタイトルを取得
          const title_element = element.getElementsByClassName("fc-title")[0];
          let title = title_element.innerHTML;

          const event_period = this.getEventDateTime(element);

          //東北大HPからスクレイピングしたイベントだと【Web○○】などが頭についてるが、
          //少ないスペースでどんなイベントかを伝えたいためこれらを除外する。
          title = title.replace(/^【Web(開催|配信)(\/(学内限定|PDP))?】/, "");
          title_element.innerHTML = title;

          //過去のイベントでなければevents、過去のイベントならarchiveにジャンプするように
          element.href =
            event_period !== "past" ? `/events#${title}` : `/archive#${title}`;

          //イベント名が一定より長かったら途中で切る。ホバー時にポップオーバーするとき表示が崩れないようにするため。
          if (title.length > 40) {
            title_element.innerHTML = title.substring(0, 40) + "...";
          }

          //イベントクリック時の画面遷移を設定する
          element.addEventListener("click", (e) => {
            e.preventDefault(); //vue-routerで制御するため
            self.$router.push({
              name: event_period !== "past" ? "Events" : "Archive", //note: nameキーで遷移先を指定しないとparamsが渡せなかった.
              params: { id: title },
            });
          });
        }
      });

      return true;
    },
    //クリックを無効にしてからmodifyEventElementを呼び出す。modifyEventElementが成功したらクリック無効を解除する。
    tryModifyEventElement: function () {
      const self = this;
      const preventClick = (e) => e.preventDefault();

      //modifyEventElementが発火するまではクリックしてもリンク先に飛ばないようにする
      this.$el.addEventListener("click", preventClick);
      console.log("Add preventClick.");

      const removeClickListener = function () {
        self.$el.removeEventListener("click", preventClick);
        console.log("Removed preventClick.");
      };

      const sayFailLoad = () => {
        console.log("Failed to load event data");
      };

      //500msくらい時間を置いて実行すれば大丈夫そうだが、念のためpromiseメソッドで成功するまで再起実行するようにしている。
      this.promise(
        this.modifyEventElement,
        removeClickListener,
        sayFailLoad,
        500
      );
    },
    //カレンダーのボタンをクリックしたとき
    addClickButtonListener: function () {
      const self = this;

      //カレンダーの月を移動した時にonLoadPageが発動するように設定
      const button_elements = Array.from(
        self.$el.getElementsByClassName("fc-button")
      );
      button_elements.forEach((element) => {
        element.addEventListener("click", self.onLoadPage);
      });
    },
    //ページロード時にカレンダーのイベントをクリックした時の挙動を設定する
    onLoadPage: function () {
      this.tryModifyEventElement();
      this.addClickButtonListener();
    },
  },
  mounted() {
    this.onLoadPage();
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

    .fc-week {
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
          td {
            &.fc-event-container {
              .fc-event {
                &:not(.is_holiday) {
                  width: 90%;
                  transition-property: padding-left, padding-right;
                  transition-duration: 0.1s;
                }
              }

              &:hover {
                position: relative;
                height: 22px;

                .fc-event {
                  &:not(.is_holiday) {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    width: 200%;
                    padding: 5px;
                    border: 2px solid darken(#175899, 10%);
                    background-color: #175899;
                    text-align: center;
                    transition-property: padding, background-color;
                    transition-duration: 0.1s;

                    .fc-content {
                      white-space: normal;
                    }
                  }
                }
              }

              .is_holiday {
                border-color: rgb(255, 84, 84);
                background-color: rgb(255, 84, 84);
              }
            }

            &:first-of-type {
              &.fc-event-container:hover {
                .fc-event:not(.is_holiday) {
                  left: 0;
                  transform: translate(0, -50%);
                }
              }
            }

            &:last-of-type {
              &.fc-event-container:hover {
                .fc-event:not(.is_holiday) {
                  left: unset;
                  right: 0;
                  transform: translate(0, -50%);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
