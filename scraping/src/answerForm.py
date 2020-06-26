from selenium import webdriver
from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException

# Seleniumをあらゆる環境で起動させるChromeオプション
options = Options()
options.add_argument('--disable-gpu')
options.add_argument('--disable-extensions')
options.add_argument('--proxy-server="direct://"')
options.add_argument('--proxy-bypass-list=*')
options.add_argument('--start-maximized')
# options.add_argument('--headless')  # ※ヘッドレスモードを使用する場合、コメントアウトを外す

DRIVER_PATH = 'asset/chromedriver.exe'
driver = webdriver.Chrome(executable_path=DRIVER_PATH, chrome_options=options)


def answer():
    url = 'https://forms.gle/meMCea38KCUjk8CVA'
    driver.get(url)

    WebDriverWait(
        driver, 30).until(
        EC.presence_of_element_located(
            (By.NAME, "identifier")))
    driver.find_element_by_name('identifier').send_keys(
        'ugax2kontomo0314@gmail.com')

    driver.find_element_by_css_selector('#identifierNext > div').click()

    print(driver.title)
