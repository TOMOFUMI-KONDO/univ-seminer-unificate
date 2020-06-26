from scraping import Scraper
from writeSheet import SheetWriter


def main():
    scraper = Scraper()
    event_list = scraper.scrape()
    if event_list['result'] != 'success':
        print(event_list['error'])

    writer = SheetWriter()
    write_event = writer.writeEvent(event_list['data'])
    if write_event['result'] != 'success':
        print(write_event['error'])


if __name__ == '__main__':
    main()
