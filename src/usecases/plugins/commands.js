// Command pattern: Encapsulate a request as an object with execute()

class ResizeImageCommand {
  constructor({ width, height }) { this.width = width; this.height = height; }
  async execute(payload) {
    await new Promise((r) => setTimeout(r, 25));
    return { action: 'resize-image', width: this.width, height: this.height, input: payload.path, output: payload.path + `.resized_${this.width}x${this.height}.jpg` };
  }
}

class TranscodeVideoCommand {
  constructor({ codec }) { this.codec = codec; }
  async execute(payload) {
    await new Promise((r) => setTimeout(r, 35));
    return { action: 'transcode-video', codec: this.codec, input: payload.path, output: payload.path + `.transcoded_${this.codec}.mp4` };
  }
}

module.exports = { ResizeImageCommand, TranscodeVideoCommand };