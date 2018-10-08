const path = require("path")
const gm = require("gm").subClass({ imageMagick: true })
const nativeUtil = require("../util/native")
const fs = require("fs")

class ImageProcessor {
    static get TRANSPARENCY_TOLERANCE_PERCENTAGE() {
        return 10
    }

    /**
     * 
     * @param {Object} config 
     * @param {File} tmpFile 
     * @param {File} sourceFile 
     */
    constructor(config, tmpFile, sourceFile) {
        this.config = config
        this.tmpFile = tmpFile
        this.sourceFile = sourceFile
        this.manipulator = gm(this.sourceFile)
    }

    /**
     * Resize according to configuration, if any resize required
     */
    _resize() {
        if (this.config.width === -1 && this.config.height === -1)
            return;

        this.manipulator.gravity(this.config.gravity)

        switch (this.config.resize) {
            case "crop":
                this.manipulator.crop(this.config.width, this.config.height)
                break;

            case "resize":
                this.manipulator.resize(this.config.width, this.config.height)
                break;

            default:
                break;
        }
    }

    /**
     * Apply effect to image
     */
    _applyEffect() {
        if (!this.config.effect)
            return;

        switch (this.config.effect) {
            case "paint":
                this.manipulator.paint(this.config.radius)
                break;

            case "monochrome":
                this.manipulator.monochrome()
                break;

            case "mosaic":
                this.manipulator.mosaic()
                break;

            case "blur":
                this.manipulator.blur(this.config.radius, 4)
                break;

            default:
                break;
        }
    }

    /**
     * Remove specified color with transparency
     */
    _applyTransparency() {
        if (!this.config.transparent)
            return;

        this.manipulator.fuzz(ImageProcessor.TRANSPARENCY_TOLERANCE_PERCENTAGE, true)
            .trim()
            // Sharpen by 1 pixel to remove ugly edges
            .sharpen(1, 4)
            .transparent(this.config.transparent)
    }

    /**
     * Rotate image and fill remaining space with fill color
     */
    _rotate() {
        if (!this.config.rotate)
            return;

        this.manipulator.rotate(this.config.fillColor, this.config.rotate)
    }

    /**
     * Add backdrop to image
     */
    _addBackdrop() {
        if (!this.config.backdrop)
            return

        return nativeUtil.execScript("add_blur.sh", [this.tmpFile])
    }

    _addBorder() {
        if (!this.config.borderWidth)
            return;

        this.manipulator.borderColor(this.config.borderColor)
        this.manipulator.border(this.config.borderWidth, this.config.borderWidth)
    }

    /**
     * Process all gm operations
     */
    process() {
        this._resize()
        this._applyEffect()
        this._applyTransparency()
        this._rotate()
        this._addBorder()
    }

    /**
     * Stream image result to some output and remove temp file
     * @param {Stream} destinationStream 
     */
    async stream(destinationStream) {
        return new Promise((resolve, reject) => {
            this.manipulator.write(this.tmpFile, async (err) => {
                if (err) {
                    reject(err)
                }

                try {
                    await this._addBackdrop()
                } catch (e) {
                    console.error("Error adding backdrop", e)
                }

                const fileStream = fs.createReadStream(this.tmpFile);

                fileStream.on("end", () => {
                    fs.unlinkSync(this.tmpFile)
                    resolve()
                })

                fileStream.pipe(destinationStream)
            })
        })
    }
}

module.exports = {
    ImageProcessor
}