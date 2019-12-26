# -*- coding: utf-8 -*-

goodName = []
tradName = []

with open("../goodName.txt", "r") as f:
    for x in f.readlines():
        goodName.append(x)
        
with open("../tradName.txt", "r") as f:
    for x in f.readlines():
        tradName.append(x)
        