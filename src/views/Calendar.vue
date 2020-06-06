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
  </div>
</template>

<script>
// @ is an alias to /src
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar'

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
        },
        {
          //祝日を取得
          googleCalendarId: 'japanese__ja@holiday.calendar.google.com',
          success: function(e) {
            let days = document.getElementsByClassName('fc-day-top')
            // let srcs = document.getElementsByClassName('fc-event-container')

            e.forEach(el => {
              for(let i=0; i<days.length; i++) {
                let day = days[i]
                if (el.start === day.dataset.date) {
                  day.classList.add('is_holiday')
                }

                console.log(el)
              }

            })

            
          }
        },
      ]
    }
  },
  methods: {
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

      .is_holiday {
        .fc-day-number {
          color: rgb(255, 84, 84);
        }
      }
    }
  }
</style>