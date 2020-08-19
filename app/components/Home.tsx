import React, { useState } from 'react';
import mermaid from 'mermaid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { Button, Space } from 'antd';

import styles from './Home.css';

export default function Home(): JSX.Element {
  const [mermaidSVG, setMermaidSVG] = useState();

  const renderMermaid = _.debounce((code: string) => {
    mermaid.mermaidAPI.render('mermaid', code, (svg: BlobPart) => {
      setMermaidSVG(svg);
    });
  }, 1000);

  const handleClickDownload = () => {
    const blob = new Blob([mermaidSVG], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'uml.svg');
  };

  return (
    <div className={styles.container} data-tid="container">
      <AceEditor
        mode="markdown"
        theme="monokai"
        onChange={renderMermaid}
        className={styles.editor}
        width="50vw"
        height="100vh"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin
        showGutter
        highlightActiveLine
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <div
        className={styles.mermaid}
        dangerouslySetInnerHTML={{ __html: mermaidSVG }}
      />
      <Space className={styles.operation}>
        <Button onClick={handleClickDownload}>下载</Button>
      </Space>
    </div>
  );
}
