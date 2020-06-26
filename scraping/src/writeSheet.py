import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials


class SheetWriter(object):
    def __init__(self):
        #  oauthで認証
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            'univ-seminer-unificate-9b2952dae41e.json', scope)
        self.gc = gspread.authorize(credentials)

    def writeEvent(self, event_list):
        try:
            workbook = self.gc.open_by_key(
                '1jV0rlU9rAptEpApgniMUgSWG-yQVcepNiqIx1NXn8rs')
            sheet = workbook.worksheet('Sheet1')

            row_cnt = sheet.row_count  # 現在の行数を取得
            event_cnt = len(event_list)
            sheet.add_rows(event_cnt)
            event_names = sheet.col_values(1)  # 既に登録されているイベント名を取得
            add_event_cnt = 0

            for i in range(event_cnt):
                # 既に登録されているイベントだったらスキップ
                if event_list[i]['title'] in event_names:
                    continue

                add_event_cnt += 1
                now = datetime.datetime.now()

                sheet.update_cell(
                    row_cnt + add_event_cnt, 1, event_list[i]['title'])
                sheet.update_cell(
                    row_cnt + add_event_cnt, 2, event_list[i]['date'])
                sheet.update_cell(
                    row_cnt + add_event_cnt, 3, '東北大学HPのイベントページに掲載されています。')
                sheet.update_cell(row_cnt + add_event_cnt, 4,
                                  now.strftime('%m/%d/%Y %H:%M:%S'))

            if add_event_cnt < event_cnt:
                sheet.delete_rows(
                    row_cnt + 1 + add_event_cnt,
                    row_cnt + event_cnt)

            response = {
                'result': 'success',
            }

            return response

        except RuntimeError as e:
            response = {
                'result': 'error',
                'error': 'Catch RuntimeError: {}'.format(e),
            }

            return response
