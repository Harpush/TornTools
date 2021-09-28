const stripJsonComments = require('strip-json-comments');

class ManifestPostProcessPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ManifestPostProcessPlugin',
      (compilation, callback) => {
        const manifestJson = JSON.parse(
          stripJsonComments(
            compilation.assets['manifest.jsonc'].source().toString()
          )
        );

        const otherMatches = manifestJson.content_scripts
          .slice(1)
          .reduce((allMatches, contentScript) => {
            allMatches.push(...contentScript.matches);
            return allMatches;
          }, []);

        manifestJson.content_scripts[0].exclude_matches = otherMatches;

        const newManifestJson = JSON.stringify(manifestJson, null, 2);

        delete compilation.assets['manifest.jsonc'];

        compilation.assets['manifest.json'] = {
          source: () => newManifestJson,
          size: () => newManifestJson.length
        };

        callback();
      }
    );
  }
}

module.exports = ManifestPostProcessPlugin;
