<template>
  <div class="in-session px-lg-5 px-4">
<!--    todo: 各学部のイベントページのリンクが張ってあるページを1つ用意してそっちに移行する-->
<!--    <p class="mb-4 text-left">東北大学のイベントページは-->
<!--      <a href="https://www.tohoku.ac.jp/japanese/2020/cate_event/" target="_blank">こちら</a>-->
<!--    </p>-->
    <div class="d-flex justify-content-between align-items-start  flex-column flex-sm-row">
      <p class="text-left indent pb-3">※イベントのタイトル部分をクリックしてGoogleカレンダーへ移動し、そこでイベントを複製すれば自分のカレンダーにイベントを追加できます。</p>
      <div>
        <input class="mr-1 checkbox" type="checkbox" id="display_current" v-model="displayCurrent" />
        <label for="display_current">開催中のイベントのみ表示</label>
      </div>
    </div>
    <b-card-group deck :class="this.displayCurrent ? 'show_current' : ''">
      <Event :class="isCurrent(index)" :event-data="event" v-for="(event, index) in eventData" :key="index"/>
    </b-card-group>
  </div>
</template>

<script>
  import Event from '../components/Event.vue'
  import moment from 'moment'

  export default {
    name: 'InSession',
    components: { Event },
    data() {
      return {
        now: {}, //現在の時刻情報
        eventData: [], //全てのイベントデータ
        inSessionEvents: [], //開催中のイベントのインデックス
        calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/',
        calendarId: process.env.VUE_APP_CALENDAR_ID,
        apiKey: process.env.VUE_APP_CALENDAR_API_KEY,
        displayCurrent: false,
      }
    },
    methods: {
      //google calendar apiを読み込む
      load() {
        // eslint-disable-next-line no-undef
        gapi.load('client', this.init)
      },
      //google calendar apiを利用してイベント情報を取得する
      init() {
        // eslint-disable-next-line no-undef
        gapi.client.init({
          apiKey: this.apiKey,
        }).then(() => {
          // eslint-disable-next-line no-undef
          return gapi.client.request({
            'path': this.calendarUrl + encodeURIComponent(this.calendarId) + '/events'
          })
        }).then(response => {
          let items = response.result.items
          for (let i=0; i < items.length; i++) {
            let item = items[i]
            let start
            let end
            //終日イベントの場合はdateTimeでなくてdateプロパティを保持してる
            if ('dateTime' in item.start) {
              start = this.getTimeInfo(item.start.dateTime)
              end = this.getTimeInfo(item.end.dateTime)
            } else {
              start = this.getTimeInfo(item.start.date)
              end = this.getTimeInfo(item.end.date)
            }

            if (this.isInSession(start, end)) {
              this.inSessionEvents.push(i)
            }
            this.eventData.push(item)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      //イベントの開始時刻と終了時刻から、そのイベントが現在開催中かどうかを判定する
      isInSession(start, end) {
        let now = this.now
        if (start.year > now.year || end.year < now.year) {
          return false
        }
        if (start.month > now.month || end.month < now.month) {
          return false
        }
        if (start.day > now.day || end.day < now.day) {
          return false
        }
        //終日イベントならここでtrueを返す
        if (start.hour === 0 && end.hour === 0) {
          return true
        }

        if (start.hour > now.hour || end.hour < now.hour) {
          return false
        }
        if (start.hour === now.hour) {
          return !(start.minute > now.minute)
        }
        if (end.hour === now.hour) {
          return !(end.minute < now.minute)
        }

        return true
      },
      //世界標準時を引数に取り、年月日などをキーにしたオブジェクトにして返す
      getTimeInfo(dateTime = null) {
        if (dateTime === null) { //現在時刻の情報を取得する場合
          return {
            'year': parseInt(moment().format('YYYY')),
            'month': parseInt(moment().format('MM')),
            'day': parseInt(moment().format('DD')),
            'hour': parseInt(moment().format('HH')),
            'minute': parseInt(moment().format('mm')),
          }
        } else { //指定時刻の情報を取得する場合
          return {
            'year': parseInt(moment(dateTime).format('YYYY')),
            'month': parseInt(moment(dateTime).format('MM')),
            'day': parseInt(moment(dateTime).format('DD')),
            'hour': parseInt(moment(dateTime).format('HH')),
            'minute': parseInt(moment(dateTime).format('mm')),
          }
        }
      },
      isCurrent(index) {
        if (index in this.inSessionEvents) {
          return 'current'
        }
        else {
          return ''
        }
      }
    },
    created() {
      this.now = this.getTimeInfo()
      this.load()
    },
  }
</script>

<style scoped lang="scss">
  .indent {
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
</style>