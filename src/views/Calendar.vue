<template>
  <div class="calendar">
    <div id="calendar" class="calender-wrapper">
      <p class="text-left indent pb-3">※イベントをクリックしてGoogleカレンダーへ移動し、そこでイベントを複製すれば自分のカレンダーにイベントを追加できます。</p>
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
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar'

export default {
  name: 'Calendar',
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
          className: 'is_holiday',
          description: '祝日だよ',
          success: function(events) {
            let dayTops = document.getElementsByClassName('fc-day-top')

            events.forEach(event => {
              for(let i=0; i < dayTops.length; i++) {
                let dayTop = dayTops[i]
                if (event.start === dayTop.dataset.date) {
                  dayTop.classList.add('is_holiday')
                }
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