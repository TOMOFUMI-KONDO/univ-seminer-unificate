<template>
  <div class="event card border-info mb-5 mx-0" :id="this.summary">
    <p v-b-tooltip="this.summary" class="card-header bg-info font-weight-bold">
      <a :href="this.html_link" class="text-light" target="_blank">{{
        this.short_summary
      }}</a>
    </p>
    <div class="card-body">
      <b-list-group class="font-weight-normal text-left">
        <small class="pb-3"
          ><u>{{ this.date }}{{ this.time }}</u></small
        >
        <!--            todo:URLをaタグで囲うようにする？セキュリティは？-->
        <p v-html="description" class="mb-0"></p>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Event",
  props: ["eventData"], //親コンポーネントで:event-data="~~~"で与えられるデータ
  data() {
    return {
      summary: "",
      short_summary: "",
      max_summary: 15, //タイトルの文字数上限。一行に収まるように。
      description: "",
      max_description: 100, //説明文の文字数上限
      date: "",
      time: "",
      html_link: "",
    };
  },
  methods: {
    setValue(val) {
      //tooltipで表示するように元のタイトルを取っておく
      let summary = val.summary;
      summary = summary.replace(/^【Web(開催|配信)(\/(学内限定|PDP))?】/, "");
      this.summary = summary;

      //タイトルがthis.max_summaryの値より長かったら途中で切る。
      if (val.summary.length > this.max_summary) {
        this.short_summary = summary.substring(0, this.max_summary) + "...";
      } else {
        this.short_summary = summary;
      }

      //文字数が150文字より多ければ切り取る。
      let description = val.description.substring(0, this.max_description);
      //urlをaタグに変更
      this.description = description.replace(
        /(http(s)?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/,
        '<a href="$1" target="_blank">$1</a>'
      );

      if ("dateTime" in val.start) {
        let dateTime = val.start.dateTime;
        this.date = this.getDate(dateTime);
        this.time = this.getTime(dateTime);
      }
      //終日イベントの場合
      else {
        let date = val.start.date;
        this.date = this.getDate(date);
      }

      this.html_link = val.htmlLink;
    },
    getDate(datetime) {
      return moment(datetime).format("YYYY/MM/DD");
    },
    getTime(datetime) {
      return moment(datetime).format("　HH:mm~");
    },
  },
  created() {
    this.setValue(this.eventData);
  },
};
</script>

<style scoped lang="scss">
.event {
  @media (min-width: 576px) {
    flex: 0 50%;
    max-width: 45%;
  }

  @media (min-width: 918px) {
    flex: 0 33%;
    max-width: 30%;
  }
}
</style>
