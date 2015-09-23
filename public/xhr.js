function xhrGetJson(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(xhr.statusText);
				}
			}
		};
		
		xhr.open('GET', url);
		xhr.send();
	});
}