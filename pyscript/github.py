# Author: Hamster<ihamsterball@gmail.com>
# Created on 14:03 2016/1/22
import BeautifulSoup
import os
import requests

def prase(item, js, crlf):
    date = item['data-date']
    year = date[0:4]
    month = date[5:7]
    day = date[8:10]
    cur = -1
    flag = False
    datastr = ''
    datastr += '  \"' + year + month + day + '\":' + item['data-count'] + ',' + crlf
    for fstr in js:
        if(datastr[0:len(datastr)-2] + crlf == fstr or datastr == fstr):
            flag = True
            break
    if(not flag):
        for fstr in js:
            cur += 1
            if(fstr == '};'+crlf):
                js.insert(cur, datastr)
                break
def check(js, crlf):
    cur = -1
    for line in js:
        cur += 1
        if(line == '};'+crlf):
            js[cur-1] = js[cur-1][0:len(js[cur-1])-len(crlf)-1] + crlf
            break
        else:
            if(js[cur][len(js[cur])-len(crlf)-1:len(js[cur])] != ','+crlf and cur != 0):
                js[cur] = js[cur][0:len(js[cur])-len(crlf)] + ',' + crlf

def main():
    # Open session of github contribution page
    session = requests.Session()
    url = "https://github.com/users/iHamsterball/contributions"
    response = session.get(url)
    s = BeautifulSoup.BeautifulSoup(response.text)
    l = s.findAll('rect')

    # Open file for rw
    crlf = ''
    if(os.name == 'nt'):
        crlf = '\n'
        if(os.getcwd() != 'C:\Users\Hamster\Documents\GitHub\ihamsterball.github.io\pyscript'):
            fp = open('js\calendarmap.js','r+')# Called by 'Jekyll Build.bat' script, different run path
        else:
            fp = open('..\js\calendarmap.js','r+')# Debug mode
    else:
        crlf = '\r\n'
        if(os.name == 'posix'):
           fp = open('/usr/local/nginx/site/js/calendarmap.js','r+')
        else:
           fp = open('/usr/local/nginx/site/js/calendarmap.js','r+')
    js = fp.readlines()

    # Reading count and add data
    for item in l:
        if item['data-count']!='0':
            prase(item, js, crlf)

    # Format datalist
    check(js, crlf)

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
