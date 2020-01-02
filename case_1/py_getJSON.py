# Using Python to get JSON from http and save as json file
# by seaniwei

import requests
import json
data = requests.get(url="http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=3")
with open("music.json","w",encoding="utf-8") as myFile:
    json.dump(data.json(), myFile,ensure_ascii=False)
myFile.close()
