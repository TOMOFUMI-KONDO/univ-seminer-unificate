<template>
  <div class="in-session px-lg-5 px-4">
    <b-card-group deck>
      <Event :event-data="event" v-for="(event, index) in eventData" :key="index"/>
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
        now: {},
        eventData: [],
        calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/',
        calendarId: process.env.VUE_APP_CALENDAR_ID,
        apiKey: process.env.VUE_APP_CALENDAR_API_KEY,
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
            let start = this.getTimeInfo(item.start.dateTime)
            let end = this.getTimeInfo(item.end.dateTime)
            console.log(item.summary)
            console.log(`${start.year} ${start.month} ${start.day} ${start.hour} ${start.minute}`)
            console.log(`${end.year} ${end.month} ${end.day} ${end.hour} ${end.minute}`)

            if (this.isInSession(start, end)) {
              this.eventData.push(item)
            }
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
      }
    },
    created() {
      this.now = this.getTimeInfo()
      console.log(this.now)
      this.load()
    }
  }
</script>
