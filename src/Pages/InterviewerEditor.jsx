import React, { useEffect, useRef, useState } from 'react'
import Editor, { useMonaco } from "@monaco-editor/react";
import { useParams } from 'react-router-dom';

import { getlivestatus, savecode } from '../service/api';

export default function InterviewerEditor({ selectedlanguage }) {
    const MONACO_OPTIONS = {
        autoIndent: "full",
        automaticLayout: true,
        contextmenu: true,
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 24,
        hideCursorInOverviewRuler: true,
        matchBrackets: "always",
        minimap: {
            enabled: false,
        },
        readOnly: true,
        scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
        },
    };
    const monaco = useMonaco();
    const { id } = useParams();
    const editorRef = useRef(null);
    const [value, setValue] = useState("//Write your code here...");
    const [defaultValue, setDefaultValue] = useState("//Write your code here...");
    const [customInput, setCustomInput] = useState("");
    useEffect(() => {
        getCodeFromLiveStatus()
        setInterval(async () => {
            getCodeFromLiveStatus()
        }, 2000);
    }, [])
    // useEffect(() => {
    //     if (monaco) {
    //         console.log("here is the monaco instance:", monaco);
    //     }
    // }, [monaco]);
    function handleEditorDidMount(editor, monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        editorRef.current = editor;
    }
    const handleEditorChange = async (value) => {
        // setValue(value);
        await savecode(id, btoa(value), customInput, "");
    };

    const getCodeFromLiveStatus = async () => {
        let updatewb = await getlivestatus(id);
        if(updatewb?.data?.stats?.codearea){
            const code1 = atob(updatewb?.data?.stats?.codearea)
            editorRef.current && editorRef.current.setValue(code1);
            if (updatewb.status == 200 && value !== code1) {
                setValue(code1)
           }
        }
    }
    return (
        <Editor
            className="rounded-2xl"
            height="50vh"
            width={`100%`}
            language={selectedlanguage || "javascript"}
            value={value}
            theme="vs-dark"
            defaultValue={defaultValue}
            options={MONACO_OPTIONS}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            fontSize = "24px"
        />
    )
}
