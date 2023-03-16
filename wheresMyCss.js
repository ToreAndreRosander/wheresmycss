/** wheresmycss by Rosander - www.rosander.no
 *  version 0.1
 */

const seen = new Set();
let defined = false;

function detectUndefined(node) {
    if(!node?.classList) {
        return;
    }

  	node._cssChecked = true;

	for (let cssSelector of node.classList) {
		if(defined.has(cssSelector) || seen.has(cssSelector)) {
			continue;
		}

		seen.add(cssSelector);
		console.log(`Missing selector: ${cssSelector}`);
	}
}

function checkCssRules(rules) {
	for(let rule of rules) {
		if(rule?.cssRules) {
			checkCssRules(rule.cssRules);
		} else if (rule.selectorText) {
			const selectors = rule.selectorText?.match(/\.[\w-]+/g);
			if (selectors) {
				for (let cssSelector of selectors) {
				defined.add(cssSelector.substr(1));
				}
			}
		}
	}
}

function initiate() {
	if(defined) {
		return defined;
	}

	console.log("Checking for undefined CSS classes...")
	defined = new Set();

	checkCssRules(document.styleSheets);

	const observer = new MutationObserver((mutationsList) => {
		for(let change of mutationsList) {
			if(change.type === "childList" && change?.addedNodes) {
				for(let elem of change.addedNodes) {

					if(elem.nodeType == 3) { 
						continue;
					}

					detectUndefined(elem);
					for (let cel of elem.querySelectorAll("*")) {
						detectUndefined(cel);
					}
				}
			} else if (change?.attributeName == "class") {
				detectUndefined(change.target);
			}
		}
	});

	observer.observe(document, {
		attributes: true,
		childList: true,
		subtree: true,
	});
}

initiate();