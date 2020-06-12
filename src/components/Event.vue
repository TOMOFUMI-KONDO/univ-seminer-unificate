<template>
<!--    todo:レイアウトしづらいから、bootstrap vueの独自要素使わないで普通にcssでスタイル調整した方いいかも-->
    <b-card header-bg-variant="info" header-text-variant="light" :header="this.summary" class="event mb-5 font-weight-bold">
        <b-list-group class="font-weight-normal">
            <b-list-group-item><p class="mb-0">{{this.date}}</p></b-list-group-item>
<!--            todo:URLをaタグで囲うようにする？セキュリティの問題気にしながら-->
            <b-list-group-item><p class="mb-0">{{this.description}}</p></b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script>
    import moment from 'moment'
    export default {
        name: "Event",
        props: ['eventData'],
        data() {
            return {
                summary: '',
                description: '',
                date: '',
            }
        },
        methods: {
            setValue(val) {
                this.summary = val.summary
                this.description = val.description
                this.date = this.getDate(val.start.dateTime)
            },
            getDate(datetime) {
                return moment(datetime).format('YYYY/MM/DD　HH:mm~')
            }
        },
        created() {
            this.setValue(this.eventData)
        }
    }
</script>

<style scoped lang="scss">
    .event {
        flex: 0 30%;
    }
</style>