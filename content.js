setInterval(() => {
	const images = document.querySelectorAll(
		"img:not(.transparent-image-fixer)"
	);
	for (const image of images) {
		image.classList.add("transparent-image-fixer");
		chrome.runtime.sendMessage(
			{
				type: "image-render",
				imageSrc: image.src,
			},
			(response) => {
				if (response.dataURL) {
					image.classList.add("transparent-image-fixed");
					image.src = response.dataURL;
					image.style.filter = "invert()";
				}
			}
		);
	}
}, 1000);
