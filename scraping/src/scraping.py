import re
import datetime
from urllib import request
from bs4 import BeautifulSoup


class Scraper(object):
    def __init__(self):
        url = "https://www.tohoku.ac.jp/japanese/2020/cate_event/"
        response = request.urlopen(url)
        self.soup = BeautifulSoup(response, features="html.parser")
        response.close()

        self.now = datetime.datetime.now()

    def scrape(self):
        soup = self.soup

        try:
            tab_panes = soup.find_all('div', class_="tab-pane")  # イベント一覧を取得

            now = self.now
            now_month = int(now.strftime('%m'))
            list = []
            for i in range(1, 3):
                # 今月と来月のイベント一覧を取得
                list.append(tab_panes[now_month - 2 + i].find_all('li'))

            now_year = int(now.strftime('%Y'))
            event_list = []
            for events in list:  # イベントの日付とタイトルを持つdictのlistを作成
                for event in events:
                    date_text = event.find('div', class_="date").text
                    date = re.search(r'([0-9]{2})\.([0-9]{2})', date_text)
                    date_groups = date.groups()
                    date_month = date_groups[0]
                    date_day = date_groups[1]

                    title = event.find('div', class_="entry").a.text
                    #  中止のイベントをはじく
                    if re.match(r'^【中止】', title):
                        continue

                    #  イベント名末尾の開催日に関する記述を消す
                    title = re.sub(r'（(.*)[0-9]{1,2}/[0-9]{1,2}(.*)）$', '', title)

                    event_list.append({
                        "date": "{}/{}/{}".format(now_year, date_month, date_day),
                        "title": title,
                    })

            response = {
                'result': 'success',
                'data': event_list,
            }

            return response

        except RuntimeError as e:
            response = {
                'result': 'error',
                'error': 'Catch RuntimeError: {}'.format(e),
            }

            return response
