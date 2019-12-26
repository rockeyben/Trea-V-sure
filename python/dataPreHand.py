# -*- coding: utf-8 -*-

import csv

useless = ["\"", " ", "\n", "\t"]

data = []
with open("../data_sch.csv", "r") as f:
    lineN = 0
    csvd = csv.reader(f)
    for x in f.readlines():
        lineN += 1
        if lineN == 5:
            for patt in useless:
                x = x.replace(patt, "")
            keys = x.split(",")
        if lineN > 5 and lineN < 5316:
            tempDict = {}
            for patt in useless:
                x = x.replace(patt, "")
            for (key,val) in zip(keys, x.split(",")):
                tempDict[key] = val
            data.append(tempDict)
            
with open("../data_mx.csv", "r") as f:
    lineN = 0
    csvd = csv.reader(f)
    for x in f.readlines():
        lineN += 1
        if lineN == 5:
            for patt in useless:
                x = x.replace(patt, "")
            keys = x.split(",")
        if lineN > 5 and lineN < 3627:
            tempDict = {}
            for patt in useless:
                x = x.replace(patt, "")
            for (key,val) in zip(keys, x.split(",")):
                tempDict[key] = val
            data.append(tempDict)

tradId = [x["交易号"] for x in data]
goodName = {}.fromkeys([x["商品名称"] for x in data]).keys()
goodFat = {}.fromkeys([x["交易对方"] for x in data]).keys()

with open("../goodName.txt", "w") as f:
    for x in goodName:
        f.write(x+"\n")
        
with open("../tradName.txt", "w") as f:
    for x in goodFat:
        f.write(x+"\n")