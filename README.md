# TOP CHEF

> How to launch the programm?

call the command: node scraping.js

> Informations

I focused my work on the server-side, I did not do the client side because I had to much to do on the server-side.
I have lost a lot of time resolving some problems due to the complexity of promises and callbacks.

So the programm scraps the michelin website and store all the stared restaurants into a JSON file, after that the programm gets the LaFourchette id of each restaurant (if it exists) on the LaFourchette API. The JSON file is updated with this id and we can get the deals on the LaFourchette deals API and update the JSON file a second time with the deals. Then the programm displays all the restaurants which have deals and their deal. 
