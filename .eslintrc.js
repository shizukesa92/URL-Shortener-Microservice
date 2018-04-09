module.exports = {
    "parser": "babel-eslint",
    "env": {
        "node": true,
		"es6": true,
		"browser": true
    },
    "plugins": [
        "react",
		"babel",
		"react-redux",
		"import",
		"html"
    ],
    "rules": {
			"no-tabs": 0,
			"linebreak-style": 0,
			"indent": 0,
			"quotes": [0, "double"],
			"no-plusplus": 0,
			"padded-blocks": 0,
			"comma-dangle": 0,
			"quote-props": 0,
			"prefer-template": 0
    },
	"extends": [
	        "plugin:react-redux/recommended",
			  "plugin:react/recommended",
			  "eslint:recommended",
			  "airbnb"
	]
}