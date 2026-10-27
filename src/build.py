import re
p=open('src/page.html').read()
p=p.replace('<script>\n/*__ENGINE__*/\n/*__PROGRESS__*/\n/*__AVATAR__*/\n</script>','<script src="engine.js"></script>\n<script src="progress.js"></script>\n<script src="avatar.js"></script>')
assert '__ENGINE__' not in p
i=p.index('</style>')+len('</style>')
head,body=p[:i],p[i:]
html='<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#080b2b">\n<meta name="robots" content="noindex,nofollow">\n<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpolygon points=%2212,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6%22 fill=%22%23ffd36b%22/%3E%3C/svg%3E">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'+head+'\n</head>\n<body>'+body+'\n</body>\n</html>\n'
open('index.html','w').write(html)
print(len(html))
