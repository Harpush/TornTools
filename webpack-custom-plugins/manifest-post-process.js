class ManifestPostProcessPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ManifestPostProcessPlugin',
      (compilation, callback) => {
        const manifestJson = JSON.parse(
          compilation.assets['manifest.json'].source()
        );

        const otherMatches = manifestJson.content_scripts
          .slice(1)
          .reduce((allMatches, contentScript) => {
            allMatches.push(...contentScript.matches);
            return allMatches;
          }, []);

        manifestJson.content_scripts[0].exclude_matches = otherMatches;

        const newManifestJson = JSON.stringify(manifestJson, null, 2);

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
