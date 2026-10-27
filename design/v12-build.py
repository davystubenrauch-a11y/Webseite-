import sys
import os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d=root+'/design/'
t=open(d+'v12-template.html').read()
t=t.replace('<!--LOGO-->',open(d+'parts/logo.svg').read()).replace('<!--DEFS-->',open(d+'parts/disc-symbol.svg').read()).replace('<!--LD-->',open(d+'parts/schema.html').read())
t=t.replace('.logo svg { height: 30px; width: auto; }','.logo svg { height: 30px; width: auto; }\n.foot .logo__svg { height: 28px; width: auto; }')
open(root+'/public/site/index.html','w').write(t); print(len(t))
