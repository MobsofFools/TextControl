import React, { useEffect, useState, ChangeEvent, ClipboardEvent } from 'react';
import { IInputs } from "../generated/ManifestTypes";
export type IMainControlProps = {
    context?: ComponentFramework.Context<IInputs>;
    onChange?: (json: string | undefined) => void;
}

const MainControl = (props: IMainControlProps) => {
    const { context } = props;
    const [charCount, setCharCount] = useState<number>()
    const charLimit = context?.parameters.characterLimit.raw!
    const entityName = context?.parameters.entityName.raw!
    const [fieldValue, setFieldValue] = useState<string | undefined>(context?.parameters.entityField.raw!)
    const [focused, setFocused] = useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    useEffect(()=>{
        setCharCount(fieldValue?.length)
    },[])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.currentTarget.value.length);
        setFieldValue(e.currentTarget.value);
    }
    const handleGetAsString = (str:string,existingText:string,selectStart:number,selectEnd:number) => {
        const newString = existingText.substring(0,selectStart) + str + existingText.substring(selectEnd,existingText.length)
        if(newString.length>charLimit){
            alert(`${newString.length - charLimit} characters have been failed to paste due to the ${charLimit} character limit`)
        }
    }
    const handleClipboardEvent = (e: ClipboardEvent<HTMLTextAreaElement>) => {
        const existingText = e.currentTarget.value;
        const selectStart = e.currentTarget.selectionStart;
        const selectEnd = e.currentTarget.selectionEnd;
        e.clipboardData.items[0].getAsString((str)=> handleGetAsString(str,existingText,selectStart,selectEnd));
        
    }
    return (
        <div style={{ position: "relative" }}>
            <textarea onChange={handleChange} maxLength={charLimit} onPaste={handleClipboardEvent} style={{ minHeight: "3rem", boxSizing: "border-box", border: "none", width: "100%", padding: "8px" }} value={fieldValue} onBlur={onBlur} onFocus={onFocus} tabIndex={0} aria-label={entityName + "textinput"} />
            {charLimit && focused ?
                <div style={{ position: "absolute", bottom: "10px", right: "4px", fontSize: "10px", background: "rgba(255,255,255,0.7)" }}>{charCount}/{charLimit}</div>
                : null
            }

        </div>
    );
}
export default MainControl