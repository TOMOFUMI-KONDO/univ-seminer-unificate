<template>
    <div class="card event mb-5 mx-15px">
        <p v-b-tooltip="this.summary" class="card-header bg-info font-weight-bold">
            <a :href="this.html_link" class="text-light" target="_blank">{{this.short_summary}}</a>
        </p>
            <div class="card-body">
            <b-list-group class="font-weight-normal text-left">
                <small class="pb-3"><u>{{this.date}}{{this.time}}</u></small>
    <!--            todo:URLをaタグで囲うようにする？セキュリティは？-->
                <p class="mb-0">{{this.description}}</p>
            </b-list-group>
            </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        name: "Event",
        props: ['eventData'],
        data() {
            return {
                summary: '',
                short_summary: '',
                max_summary: 15, //タイトルの文字数上限。一行に収まるように。
                description: '',
                max_description: 100, //説明文の文字数上限
                date: '',
                time: '',
                html_link: '',
            }
        },
        methods: {
            setValue(val) {
                this.summary = val.summary //tooltipで表示するように元のタイトルを取っておく
                if (val.summary.length > this.max_summary) {
                    this.short_summary = val.summary.substring(0,this.max_summary) + '...'
                }
                else {
                    this.short_summary = val.summary
                }

                this.description = val.description.substring(0,this.max_description)

                if ('dateTime' in val.start) {
                    let dateTime = val.start.dateTime
                    this.date = this.getDate(dateTime)
                    this.time = this.getTime(dateTime)
                }
                //終日イベントの場合
                else {
                    let date = val.start.date
                    this.date = this.getDate(date)
                }

                this.html_link = val.htmlLink
            },
            getDate(datetime) {
                return moment(datetime).format('YYYY/MM/DD')
            },
            getTime(datetime) {
                return moment(datetime).format('　HH:mm~')
            },
            // modifySummary(summary) {
            //     //東北大のHPからとってきたデータに
            // }
        },
        created() {
            this.setValue(this.eventData)
        }
    }
</script>

<style scoped lang="scss">
    .event {
        @media (min-width: 576px) {
            flex: 0 45%;
        }

        @media (min-width: 918px) {
            flex: 0 30%;
        }
    }
</style>