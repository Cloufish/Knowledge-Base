---
title: BotnetFlooder CyberThreatForce CTF 2021
tags: permanent-note web-os-injection
references:
---
# BotnetFlooder CyberThreatForce CTF 2021

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