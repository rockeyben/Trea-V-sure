# -*- coding: utf-8 -*-

import json

with open("./cls.json", "r") as f:
    clsInfo = json.load(f)

clsVals = [z for x in clsInfo.values() for z in x]
oldone = 0
newone = 0
goodName = []

with open("../test.txt", "r") as f:
    for x in f.readlines():
        oldone += 1
        check = True
        for key in clsVals:
            if key in x:
                check = False
        if check:
            goodName.append(x)
            newone += 1

with open("../test.txt", "w") as f:
    for x in goodName:
        f.write(x)
        
print("Compress Ratio is: "+("%0.4f" % (newone/oldone)))
    

