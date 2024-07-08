import requests

URL = 'https://www.google.com'
page = requests.get(URL)

print(page.text)
