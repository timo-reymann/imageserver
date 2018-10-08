const gm = require("gm").subClass({ imageMagick: true })
const { uniqueTmpFile } = require("../util/general")
const fs = require("fs")

class PlaceholderGenerator {
    constructor(width, height, options) {
        this.width = width;
        this.height = height;
        this.options = options
    }

    render(outputStream) {
        return new Promise(resolve => {
            const placeholderImage = uniqueTmpFile("placeholder_") + ".png"

            gm(this.width, this.height, this.options.backgroundColor)
                .gravity("Center")
                .fontSize(this.width * .04)
                .fill(this.options.foregroundColor)
                .drawText(0, 0, this.options.text === 'resolution' ? `${this.width}x${this.height}` : this.options.text, 'Center')
                .write(placeholderImage, (err) => {
                    if (err) {
                        console.error("Error generating placeholder image", err)
                        outputStream.send("Internal Server Error");
                        outputStream.status = 500;
                        return;
                    }

                    const fileStream = fs.createReadStream(placeholderImage);
                    outputStream.setHeader("Content-Type", "image/png")
                    fileStream.on("end", () => {
                        fs.unlinkSync(placeholderImage)
                        resolve()
                    })

                    fileStream.pipe(outputStream)
                })
        })
    }
}

module.exports = {
    PlaceholderGenerator
}