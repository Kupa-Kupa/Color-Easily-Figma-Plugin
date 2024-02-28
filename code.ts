// This plugin will open a window to prompt the user to enter a Color Easily URL
// it will then generate the corresponding link's palette on the screen.

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 400, height: 630, title:"Color Easily Palette Generator"});

// updated to support dynamic page loading
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-palette') {  
    const nodes: SceneNode[] = [];
    const currentColorStyles = await figma.getLocalPaintStylesAsync();
    const colorStyleNamesArr = currentColorStyles.map((colorStyle) => colorStyle.name);

    if(msg.replaceColors) {

      for(let j = 0; j < currentColorStyles.length; j++) {
        if (msg.palette[j] !== undefined && currentColorStyles[j].name == 'text') {
          const hex = figma.util.solidPaint(`#${msg.palette[0]}`);
          currentColorStyles[j].paints = [hex];
        } else if (msg.palette[j] !== undefined && currentColorStyles[j].name == 'background') {
          const hex = figma.util.solidPaint(`#${msg.palette[1]}`);
          currentColorStyles[j].paints = [hex];
        } else if (msg.palette[j] !== undefined && currentColorStyles[j].name == 'accent 1') {
          const hex = figma.util.solidPaint(`#${msg.palette[2]}`);
          currentColorStyles[j].paints = [hex];
        } else if (msg.palette[j] !== undefined && currentColorStyles[j].name == 'accent 2') {
          const hex = figma.util.solidPaint(`#${msg.palette[3]}`);
          currentColorStyles[j].paints = [hex];
        } else if (msg.palette[j] !== undefined && currentColorStyles[j].name == 'accent 3') {
          const hex = figma.util.solidPaint(`#${msg.palette[4]}`);
          currentColorStyles[j].paints = [hex];
        } else if (msg.palette[j] !== undefined && currentColorStyles[j] !== undefined && currentColorStyles[j].name == `accent ${j - 1}`) {
          const hex = figma.util.solidPaint(`#${msg.palette[j]}`);
          currentColorStyles[j].paints = [hex];
        }
      }

      if (colorStyleNamesArr.indexOf('text') == -1) {
          const colorStyle = figma.createPaintStyle();
          const hex = figma.util.solidPaint(`#${msg.palette[0]}`);
          colorStyle.name = `text`;
          colorStyle.paints = [hex];
      }

      if(colorStyleNamesArr.indexOf('background') == -1) {
        const colorStyle = figma.createPaintStyle();
        const hex = figma.util.solidPaint(`#${msg.palette[1]}`);
        colorStyle.name = `background`;
        colorStyle.paints = [hex];
      }

      if(colorStyleNamesArr.indexOf('accent 1') == -1) {
        const colorStyle = figma.createPaintStyle();
        const hex = figma.util.solidPaint(`#${msg.palette[2]}`);
        colorStyle.name = `accent 1`;
        colorStyle.paints = [hex];
      }

      if(colorStyleNamesArr.indexOf('accent 2') == -1) {
        const colorStyle = figma.createPaintStyle();
        const hex = figma.util.solidPaint(`#${msg.palette[3]}`);
        colorStyle.name = `accent 2`;
        colorStyle.paints = [hex];
      }

      if(colorStyleNamesArr.indexOf('accent 3') == -1) {
        const colorStyle = figma.createPaintStyle();
        const hex = figma.util.solidPaint(`#${msg.palette[4]}`);
        colorStyle.name = `accent 3`;
        colorStyle.paints = [hex];
      }
      
    }

    for (let i = 0; i < msg.palette.length; i++) {
      const rect = figma.createRectangle();
      rect.x = 50 + i * 150;
      rect.y = 50;
      const hex = figma.util.solidPaint(`#${msg.palette[i]}`);
      rect.fills = [hex];

      
      if(msg.replaceColors) {

        if(i == 0) {
          rect.name = 'Text Color';
        } else if(i == 1) {
          rect.name = 'Background Color';
        } else if(i == 2) {
          rect.name = 'Accent 1 Color';
        } else if(i == 3) {
          rect.name = 'Accent 2 Color';
        } else if(i == 4) {
          rect.name = 'Accent 3 Color';
        } else {
          rect.name = 'Additional Accent Color';

          if(!currentColorStyles[i]) {
            const colorStyle = figma.createPaintStyle();
            colorStyle.name = `accent ${i - 1}`;
            colorStyle.paints = [hex];
          }
        }

      } else {
        const colorStyle = figma.createPaintStyle();

        if(i == 0) {
          rect.name = 'Text Color';
          colorStyle.name = 'text';
          colorStyle.paints = [hex];
        } else if(i == 1) {
          rect.name = 'Background Color';
          colorStyle.name = 'background';
          colorStyle.paints = [hex];
        } else if(i == 2) {
          rect.name = 'Accent 1 Color';
          colorStyle.name = 'accent 1';
          colorStyle.paints = [hex];
        } else if(i == 3) {
          rect.name = 'Accent 2 Color';
          colorStyle.name = 'accent 2';
          colorStyle.paints = [hex];
        } else if(i == 4) {
          rect.name = 'Accent 3 Color';
          colorStyle.name = 'accent 3';
          colorStyle.paints = [hex];
        } else {
          rect.name = 'Additional Accent Color';
          colorStyle.name = `accent ${i - 1}`;
          colorStyle.paints = [hex];
        }
      }

      nodes.push(rect);
    }

    const frame = figma.createFrame();
    frame.name = 'Color Easily Palette';
    const lastNode = nodes[nodes.length - 1];
    frame.resizeWithoutConstraints(lastNode.x + lastNode.width + 50, lastNode.y + lastNode.height + 50);

    for(let i = 0; i < nodes.length; i++) {
      frame.appendChild(nodes[i]);
    }

    figma.currentPage.appendChild(frame);

    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
  }

  figma.closePlugin();
};

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.