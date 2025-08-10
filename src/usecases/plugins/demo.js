const { CommandRegistry } = require('./registry');
const { createCommand } = require('./factory');
const { ResizeImageCommand, TranscodeVideoCommand } = require('./commands');
const { globalEventBus } = require('./observer');

async function runPluginsDemo() {
  const registry = CommandRegistry.getInstance();

  // Register commands (plugins could do this at load time)
  registry.register('resize-image', (options) => new ResizeImageCommand(options));
  registry.register('transcode-video', (options) => new TranscodeVideoCommand(options));

  // Observe command execution
  globalEventBus.on('command:executed', ({ name, result }) => {
    console.log(`[Observer] Command executed: ${name}`, result);
  });

  // Create commands via factory and execute
  const resize = createCommand('resize-image', { width: 1280, height: 720 });
  const transcode = createCommand('transcode-video', { codec: 'h264' });

  const r = await resize.execute({ path: '/tmp/photo.jpg' });
  globalEventBus.emit('command:executed', { name: 'resize-image', result: r });

  const t = await transcode.execute({ path: '/tmp/clip.mov' });
  globalEventBus.emit('command:executed', { name: 'transcode-video', result: t });

  console.log('Available commands:', registry.list());
}

module.exports = { runPluginsDemo };

if (require.main === module) {
  runPluginsDemo();
}