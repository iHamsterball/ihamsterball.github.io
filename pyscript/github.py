# Author: Hamster<ihamsterball@gmail.com>
# Created on 14:03 2016/1/22
import BeautifulSoup
import os
import requests

def prase(item, js):
    date = item['data-date']
    year = date[0:4]
    month = date[5:7]
    day = date[8:10]
    cur = -1
    flag = False
    datastr = ''
    datastr += '  \"' + year + month + day + '\":' + item['data-count'] + ',\n'
    for fstr in js:
        if(datastr[0:len(datastr)-2] + '\n' == fstr or datastr == fstr):
            flag = True
            break
    if(not flag):
        for fstr in js:
            cur += 1
            if(fstr == '};\n'):
                js.insert(cur, datastr)
                break
def check(js):
    cur = -1
    for line in js:
        cur += 1
        if(line == '};\n'):
            js[cur-1] = js[cur-1][0:len(js[cur-1])-2] + '\n'
            break
        else:
            if(js[cur][len(js[cur])-2:len(js[cur])] != ',\n' and cur != 0):
                js[cur] = js[cur][0:len(js[cur])-1] + ',\n'

def main():
    # Open session of github contribution page
    session = requests.Session()
    url = "https://github.com/users/iHamsterball/contributions"
    response = session.get(url)
    s = BeautifulSoup.BeautifulSoup(response.text)
    l = s.findAll('rect')

    # Open file for rw
    if(os.name == 'nt'):
        if(os.getcwd() != 'C:\Users\Hamster\Documents\GitHub\ihamsterball.github.io\pyscript'):
            fp = open('js\calendarmap.js','r+')# Called by 'Jekyll Build.bat' script, different run path
        else:
            fp = open('..\js\calendarmap.js','r+')# Debug mode
    else:
        if(os.name == 'posix'):
           fp = open('/usr/local/nginx/site/js/calendarmap.js','r+')
        else:
           fp = open('/usr/local/nginx/site/js/calendarmap.js','r+')
    js = fp.readlines()

    # Reading count and add data
    for item in l:
        if item['data-count']!='0':
            prase(item, js)

    # Format datalist
    check(js)
    
    # Write to js file
    # WTF, r+ mode cannot clear the file in this way
    #fp.truncate()
    fp.seek(0)
    for line in js:
        fp.write(line)
    print 'Successfully update calendarmap.js'
    fp.close()
            
if __name__ == "__main__":
    main()
