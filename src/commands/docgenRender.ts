import { ComponentDoc } from 'react-docgen-typescript';
import * as vscode from 'vscode';
import * as prettier from 'prettier';
// export const docgenRender = (componentDocs: ComponentDoc[]) => markdownRender(componentDocs, {
//   renderer: renderers.aliMaterialRenderer,
//   language: vscode.workspace.getConfiguration('vscode-react-docgen-typescript').get('renderLanguage')
// });

export const docgenRender =  (componentDocs: ComponentDoc[]) =>  {
  return commentToMarkDown(componentDocs);
};

// 把react-docgen提取的信息转换成markdown格式
function commentToMarkDown(componentInfo: { props: any; }[]) {
  let { props } = componentInfo[0];
  const markdownInfo = renderMarkDown(props);
  // 使用prettier美化格式
  const content = prettier.format(markdownInfo, {
    parser: 'markdown'
  });
  return content;
}
function renderMarkDown(props: { [x: string]: any; }) {
  const header = `
  ## API
  | 属性 | 描述 | 类型  | 默认值  |  
  | --- | --- | --- | --- | 
  `;
  const content = `${Object.keys(props).map((key) => renderProp(key, props[key])).join('')}`;
  return header + content;
}


// 渲染1行属性
function renderProp(
  name: string,
  props: { type?: { name: string; } | undefined; defaultValue?: { value: string; } | undefined; required: any; description: any; },
) {
  let { type = { name: '-' }, defaultValue = { value: '-' }, required, description } = props;
  const defaultV = defaultValue
    ? defaultValue.value.replace(
      /\|/g,
      '<span>|</span>'
    ) : '-';
  description = description.replace(/[\t\n\v\r\f]/g, '');

  return `| ${name} | ${description || '-'}  |  \`${getType(type)}\`  | ${defaultV}   | \n`;
}

function getType(type: { name: any; }) {
  // ?
  // const handler = {
  //   enum: (type) =>
  //     type.value.map((item) => item.value.replace(/'/g, '')).join(' \\| '),
  //   union: (type) => type.value.map((item) => item.name).join(' \\| ')
  // }
  // if (typeof handler[type.name] === 'function') {

  //   return handler[type.name](type).replace(/\|/g, '')
  // } else {
  //   return type.name.replace(/\|/g, '\\|')
  // }
  return type.name.replace(/\|/g, '\\|');
}




