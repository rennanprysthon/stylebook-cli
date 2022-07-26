function getValue(name, objects) {
	let filtered = objects.filter(object => {
		return object.name === name
	})

	return filtered.length > 0 && filtered[0]
}

function getCategory(categoryName, object) {
	if (!!object && !!object.frontendTokenCategories) {
		return getValue(categoryName, object.frontendTokenCategories)
	}
	return false
}
function getTokenSet(categoryName, tokenSetName, object) {
	let category = getCategory(categoryName, object)
	if (!!category && !!category.frontendTokenSets) {
		return getValue(tokenSetName, category.frontendTokenSets)
	}
	return false
}
function getToken(categoryName, tokenSetName, token, object) {
	let tokenSet = getTokenSet(categoryName, tokenSetName, object)
	if (!!tokenSet && !!tokenSet.frontendTokens) {
		return getValue(token, tokenSet.frontendTokens)
	}
	return false
}

export {
	getCategory,
	getTokenSet,
	getToken
}