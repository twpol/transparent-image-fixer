chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type === "image-render") {
		const image = new Image();
		image.addEventListener("load", () => {
			const w = image.width;
			const h = image.height;
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const context = canvas.getContext("2d");

			context.fillStyle = "black";
			context.fillRect(0, 0, w, h);
			context.drawImage(image, 0, 0);
			const transparent = context.getImageData(0, 0, w, h);

			context.fillStyle = "red";
			context.fillRect(0, 0, w, h);
			context.fillStyle = "white";
			context.fillRect(4, 4, w - 8, h - 8);
			context.drawImage(image, 0, 0);
			const opaque = context.getImageData(0, 0, w, h);

			sendResponse({
				dataURL: compareImageData(opaque, transparent)
					? null
					: canvas.toDataURL(),
			});
		});
		image.src = request.imageSrc;
		return true;
	}
});

/** @type {(a: ImageData, b: ImageData) => boolean} */
function compareImageData(a, b) {
	if (a.width !== b.width || a.height !== b.height) return false;
	for (let i = 0; i < a.data.length; i++) {
		if (a.data[i] !== b.data[i]) return false;
	}
	return true;
}
