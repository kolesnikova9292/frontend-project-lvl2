install:
	    npm install


lint:
		npx eslint .

test:
		npm test

gendiff:
		node bin/gendiff.js
