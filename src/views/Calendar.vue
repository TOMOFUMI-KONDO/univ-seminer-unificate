<template>
  <div class="calendar">
    <div id="calendar" class="calender-wrapper">
      <FullCalendar
        default-view="dayGridMonth"
        :plugins="calendarPlugins"
        :google-calendar-api-key="googleCalendarApiKey"
        :event-sources="eventSources"
      />
    </div>
    <b-button @click="click">click</b-button>
  </div>
</template>

<script>
// @ is an alias to /src
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarPlugins: [
              dayGridPlugin, googleCalendarPlugin
      ],
      googleCalendarApiKey: process.env.VUE_APP_CALENDAR_API_KEY,
      eventSources: [
        {
          googleCalendarId: process.env.VUE_APP_CALENDAR_ID,
          // googleCalendarId: process.env.VUE_APP_CALENDAR_ID,
          //todo: ここらへんで予定を取得してるのでいじる
          success: function(e) {
            console.log(e)
            // let days = document.getElementsByClassName('fc-day-top')
            // e.forEach(el => {
            //   console.log(el)
            //   // for (let i = 0; i < days.length; i++) {
            //   //   let day = days[i]
            //   //   if (el.start === day.dataset.date) {
            //   //     day.classList.add('is_holiday')
            //   //   }
            //   // }
            // })
          }
        },
        {
          googleCalendarId: 'japanese__ja@holiday.calendar.google.com',
          success: function(e) {
            console.log(e)
            let days = document.getElementsByClassName('fc-day-top');

            e.forEach(el => {
              for(let i=0; i<days.length; i++) {
                let day = days[i]
                console.log(day)
                if (el.start === day.dataset.date) {
                  day.classList.add('is_holiday')
                }
              }

            });
          }
        },
      ]
    }
  },
  methods: {
    click() {
      console.log('clicked')
      axios.get('https://www.googleapis.com/calendar/v3/calendars/tomofumi.kondo.r1%40dc.tohoku.ac.jp?key=AIzaSyDSXtHq8PmXCRRrb6a9RyfxPTB-nKWA1z4')
        .then(res => {
          console.log(res)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss">
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';

  .calender-wrapper {
    width: 90%;
    max-width: 700px;
    margin: 0 auto;

    .fc-scroller {
      min-height: 384px;
    }
  }
</style>