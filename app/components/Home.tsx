import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import mermaid from 'mermaid';
import MonacoEditor from 'react-monaco-editor';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { Button, Space, Dropdown, Menu } from 'antd';
import { DownloadOutlined, BarsOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuInfo } from 'rc-menu/lib/interface';

import diagramTpl from './DiagramTpl';
import initEditor from './initEditor';

import './Home.css';

const { SubMenu } = Menu;

export default function Home(): JSX.Element {
  const [mermaidSVG, setMermaidSVG] = useState<string>('');
  const [text, setText] = useState<string>('');

  const renderMermaid = _.debounce((code: string) => {
    mermaid.mermaidAPI.render('mermaid', code, (svg) => {
      setText(code);
      setMermaidSVG(svg);
    });
  }, 1000);

  const handleClickDownload = () => {
    const blob = new Blob([mermaidSVG], {
      type: 'image/svg+xml;charset=utf-8',
    });
    saveAs(blob, 'uml.svg');
  };

  const handleClickHelperMenu = ({ key }: MenuInfo) => {
    if (key === 'helperDoc') {
      shell.openExternal(
        'https://mermaid-js.github.io/mermaid/#/?id=diagrams-that-mermaid-can-render'
      );
    } else {
      renderMermaid(diagramTpl[key]);
    }
  };

  const menu = (
    <Menu theme="dark" onClick={handleClickHelperMenu}>
      <SubMenu title="插入模板">
        <Menu.Item key="flowchart">Flowchart</Menu.Item>
        <Menu.Item key="sequenceDiagram">Sequence Diagram</Menu.Item>
        <Menu.Item key="classDiagram">Class Diagram</Menu.Item>
        <Menu.Item key="ganttDiagram">Gantt Diagram</Menu.Item>
        <Menu.Item key="gitGraph">Git Graph</Menu.Item>
        <Menu.Item key="entityRelationshipDiagram">
          Entity Relationship Diagram
        </Menu.Item>
        <Menu.Item key="userJourneyDiagram">User Journey Diagram</Menu.Item>
      </SubMenu>
      <Menu.Item key="helperDoc">帮助文档</Menu.Item>
    </Menu>
  );

  return (
    <div className="container" data-tid="container">
      <MonacoEditor
        width="512px"
        height="100vh"
        language="mermaid"
        theme="monokai"
        value={text}
        options={{
          minimap: {
            enabled: false,
          },
          tabSize: 2,
          fontSize: 14,
        }}
        onChange={renderMermaid}
        editorWillMount={initEditor}
      />
      <div className="panel" dangerouslySetInnerHTML={{ __html: mermaidSVG }} />
      <Space className="helper">
        <Dropdown overlay={menu} placement="topLeft" arrow>
          <Button icon={<BarsOutlined />} type="primary" />
        </Dropdown>
      </Space>
      <Space className="operation">
        <Button
          onClick={handleClickDownload}
          icon={<DownloadOutlined />}
          shape="circle"
        />
      </Space>
    </div>
  );
}
