export const loadFontAwesome = async () => {
  const fontAwesomeCssUrl = chrome.runtime.getURL('font-awesome.css');
  const res = await fetch(fontAwesomeCssUrl);
  const cssText = await res.text();

  const extensionAlteredCssText = cssText.replace(
    /\.\.\/webfonts\/[^)]+/g,
    match => {
      const fontPath = match.substring(2, match.length);

      return chrome.runtime.getURL(fontPath);
    }
  );

  const style = document.createElement('style');
  style.innerHTML = extensionAlteredCssText;

  document.head.appendChild(style);

  // TODO: Embed webfontloader to avoid font flicker?
};
