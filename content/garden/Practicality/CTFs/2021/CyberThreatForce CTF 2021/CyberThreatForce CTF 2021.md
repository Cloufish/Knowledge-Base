---
title: CyberThreatForce CTF 2021
tags: project-note
references:
---
# CyberThreatForce CTF 2021
# CyberThreatForce CTF 2021

## Web Challs
[[RaaS_Recruitment CyberThreatForce CTF 2021]] <- Blind XSS Exploitation Challenge
---------------------------------------------------------------------
[[BotnetFlooder CyberThreatForce CTF 2021]] <- OS Injection in Python. Data Exfiltration via `open().read()` function
---------------------------------------------------------------------
### Forum403 
- [ ] Was Solved By Me
#### Points - 400
#### Description:
Agent of CyberThreatForce,

APT 403 has a forum where they sell their ransomware. Your mission is to pawn the admin account of the website in order to paralyze their income. You can access it there: [http://51.68.72.26/](http://51.68.72.26/) Please do not use the docker instance through CTFd for availability reasons.

Best of luck and may the hack be with you.

Headquarters of CyberThreatForce


#### Write-Up
- From the description, it seems We have to perform CSRF Attack
![](https://i.imgur.com/4hrpAYE.png)
- After trying basic SQL Injection... we get to inscription.php:
 ![](https://i.imgur.com/5pWH8iA.png)
- The first time I saw It I really got scared! xD
- I downloaded the `trollface.png` file	and performed basic steganography steps like extracting with binwalk, uncompressing with zlib-flate, but nothing :/ a dead end indeed
#### Notes After The Competition

