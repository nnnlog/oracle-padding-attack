const assert = require("assert").strict;

module.exports = async (cipher, BLOCK_SZ, requestAndValidate, options = {}) => {
	assert(typeof requestAndValidate === "function");
	assert(typeof options === "object");
	assert(typeof BLOCK_SZ === "number");
	assert(cipher.length % BLOCK_SZ === 0);

	let iv = Buffer.alloc(16, 0);
	let result = Buffer.of();
	for (let blockId = 0; blockId < cipher.length / BLOCK_SZ; ++blockId) {
		let block = cipher.slice(blockId * BLOCK_SZ, (blockId + 1) * BLOCK_SZ);
		let table = Buffer.alloc(16, 0);
		for (let charIndex = 15; charIndex >= 0; --charIndex) {
			for (let c = 0; c <= 256; ++c) {
				let tmpIV = Buffer.alloc(16, 0);
				for (let j = 0; j < 16; ++j) if (table[j] !== 0) tmpIV[j] = table[j] ^ (BLOCK_SZ - j) ^ (BLOCK_SZ - charIndex);
				tmpIV[charIndex] = c;
				if (options.debug)
					process.stdout.write(
						"\rRequest    [ " + (charIndex + 1).toString().padStart(2, "0") + " of Block " + blockId + " ] : \033[31m" +
						block.slice(0, charIndex).toString('hex') + "\033[33m" +
						c.toString(16).padStart(2, "0") + "\033[36m" +
						table.slice(charIndex + 1).toString('hex') + "\033[0m"
					);
				if (await requestAndValidate(Buffer.concat([tmpIV, block]).toString('base64'))) {
					table[charIndex] = c;
					break;
				}
			}
		}

		if (options.debug)
			process.stdout.write(
				"\rRequest    [ 01 of Block " + blockId + " ] : \033[36m" +
				table.toString('hex') +
				"\033[0m\n\n"
			);
		for (let i = 0; i < 16; ++i) table[i] = table[i] ^ (BLOCK_SZ - i) ^ iv[i];
		result = Buffer.concat([result, table]);
		iv = block;

		if (options.debug) {
			process.stdout.write("\nFinish     [ Block " + blockId + " ] : " + table.toString('utf8') + "\n");
			process.stdout.write("Decrypted  : " + result.toString('utf8') + "\n");
		}
	}

	return result;
};
