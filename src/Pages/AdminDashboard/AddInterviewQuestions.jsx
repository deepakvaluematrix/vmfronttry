import React, { useEffect } from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addInterviewQuestion, addQuestion, fetchInterviewQuestion, updateInterviewQuestion } from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import "../../assets/stylesheet/editor.scss";

import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Fragment } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { useState } from "react";


const AddQuestions = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [modal, setModal] = React.useState(null);

  const [showPbForm,setPbForm] = useState(false)

  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);
  let [challenges,setChallenges] = React.useState([]);

  const [showProblembasedQuestion,setShowProblembasedQuestion] = React.useState(false)


  const [inputQue, setInputQue] = React.useState();
  const [inputDesc,setInputDesc] = useState();
  const [inputTopic,setInputTopic] = useState()
  const [inputHint,setInputHint] = useState()
  const [inputWrench,setInputWrench] = useState()
  const [convertedQuestion, setConvertedQuestion] = React.useState(null);
  const [convertedDescription,setConvertedDescription] = useState(null)
  const [convertedTopic,setConvertedTopic] = useState(null)
  const [convertedHint,setConvertedHint] = useState(null)
  const [convertedWrench,setConvertedWrench] = useState(null)


  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
    level: "",
    description: "",
    topic:"",
    instructions:[],
    wrench:"",
    hints:"",
    variations:[]
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [quesList, setQuesList] = React.useState(false);
  const [importQues, setimportQues] = React.useState([]);


  // Add options
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddValue = () => {
    if (inputValue.trim() !== '') {
      setOptions([...options, inputValue]);
      setInputValue('');
    }
  };

  const handleDeleteValue = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Add instructions

  const [instructions, setInstructions] = useState([]);
  const [inputInstruction, setInputInstruction] = useState('');

  const handleInputInstructionChange = (event) => {
    setInputInstruction(event.target.value);
  };

  const handleAddInstruction = () => {
    if (inputInstruction.trim() !== '') {
      setInstructions([...instructions, inputInstruction]);
      setInputInstruction('');
    }
  };

  const handleDeleteInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  // Add variations
  const [variations, setVariations] = useState([]);
  const [inputVarationValue, setInputVariationValue] = useState('');

  const handleInputVariationChange = (event) => {
    setInputVariationValue(event.target.value);
  };

  const handleAddVariation = () => {
    if (inputVarationValue.trim() !== '') {
      setVariations([...variations, inputVarationValue]);
      setInputVariationValue('');
    }
  };

  const handleDeleteVariation = (index) => {
    const newVariations = [...variations];
    newVariations.splice(index, 1);
    setVariations(newVariations);
  };


  useEffect(() => {

    getQuestionList();

  }, [])
  const getQuestionList = async () => {
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    const QuesList = await fetchInterviewQuestion(token);
    // //console.log(QuesList);
    setQuesList(QuesList.data.ques)
  }

  const sbProcessor = async (json,challge)=>{
    json.forEach((item) => {
      let quest = {};
      let type="SB";
      let difficulty;
      let description;
      let question;
      let solution=[];
      let input1;
      let input2;
      let output1;
      let output2;
      let skill;
      let topic;
      if (item["Description"] && item["Description"] !== "") {
        description = item["Description"];
      }

      if (item["Difficulty"] && item["Difficulty"] !== "") {
        difficulty = item["Difficulty"];
      }

      if (item["Input1"] && item["Input1"] !== "") {
        input1 = item["Input1"];
      }
      if (item["Input2"] && item["Input2"] !== "") {
        input2 = item["Input2"];
      }

      if (item["Output1"] && item["Output1"] !== "") {
        output1 = item["Output1"];
      }

      if (item["Output2"] && item["Output2"] !== "") {
        output2 = item["Output2"];
      }

      if (item["Question"] && item["Question"] !== "") {
        question = item["Question"];
      }
      if (item["Skill"] && item["Skill"] !== "") {
        skill = item["Skill"];
      }

      if (item["Solution"] && item["Solution"] !== "") {
        solution.push(item["Solution"]);
      }
      if (item["Solution_1"] && item["Solution_1"] !== "") {
        solution.push(item["Solution_1"]);
      }
      if (item["Solution_2"] && item["Solution_2"] !== "") {
        solution.push(item["Solution_2"]);
      }
      if (item["Topic"] && item["Topic"] !== "") {
        topic=item["Topic"];
      }
      quest={
        type:type,
        difficulty:difficulty,
        description:description,
        question:question,
        solution:solution,
        input1:input1,
        input2:input2,
        output1:output1,
        output2:output2,
        skill:skill,
        topic:topic
        }
        challge.push(quest);
    });
  }

  const pbProcessor = async (json,challge)=>{
    json.forEach((item) => {
      let quest = {};
      let question;
      let type = "PB";
      let instructions;
      let hints;
      let wrench=[];
      let solution=[];
      let input1;
      let input2;
      let input3;
      let input4;
      let input5;
      let output1;
      let output2;
      let output3;
      let output4;
      let output5;
      let topic;
      if (item.Question && item.Question !== "") {
        question=item.Question;
      }
      if (item.Instructions && item.Instructions !== "") {
        instructions = item.Instructions;
      }
      if (item["Topic"] && item["Topic"] !== "") {
        topic = item["Topic"];
      }
      if(item["Hints"] && item["Hints"] !== ""){
        hints = item["Hints"];
      }if(item["Wrench"] && item["Wrench"] !== ""){
        wrench.push(item["Wrench"]);
      }
      if(item["Wrench_1"] && item["Wrench_1"] !== ""){
        wrench.push(item["Wrench_1"]);
      }
      
      if(item["Wrench_2"] && item["Wrench_2"] !== ""){
        wrench.push(item["Wrench_2"]);
      }
      
      if(item["Wrench_3"] && item["Wrench_3"] !== ""){
        wrench.push(item["Wrench_3"]);
      }

      if(item["Wrench_4"] && item["Wrench_4"] !== ""){
        wrench.push(item["Wrench_4"]);
      }

      if(item["Wrench_5"] && item["Wrench_5"] !== ""){
        wrench.push(item["Wrench_5"]);
      }
      
      if(item["Solution"] && item["Solution"] !== ""){
        solution.push(item["Solution"]);
      }

      if(item["Solution_1"] && item["Solution_1"] !== ""){
        solution.push(item["Solution_1"]);
      }
      
      if(item["Solution_2"] && item["Solution_2"] !== ""){
        solution.push(item["Solution_2"]);
      }
      
      if(item["Solution_3"] && item["Solution_3"] !== ""){
        solution.push(item["Solution_3"]);
      }
      
      if(item["Solution_4"] && item["Solution_4"] !== ""){
        solution.push(item["Solution_4"]);
      }

      if(item["Solution_5"] && item["Solution_5"] !== ""){
        solution.push(item["Solution_5"]);
      }

      if(item["Input1"] && item["Input1"] !== ""){
        input1 = item["Input1"];
      }
      if(item["Input2"] && item["Input2"] !== ""){
        input2 = item["Input2"];
      }if(item["Input3"] && item["Input3"] !== ""){
        input3 = item["Input3"];
      }if(item["Input4"] && item["Input4"] !== ""){
        input4 = item["Input4"];
      } if(item["Input5"] && item["Input5"] !== ""){
        input5 = item["Input5"];
      }if(item["Output1"] && item["Output1"] !== ""){
        output1 = item["Output1"];
      } if(item["Output2"] && item["Output2"] !== ""){
        output2 = item["Output2"];
      } if(item["Output3"] && item["Output3"] !== ""){
        output3 = item["Output3"];
      } if(item["Output4"] && item["Output4"] !== ""){
        output4 = item["Output4"];
      } if(item["Output5"] && item["Output5"] !== ""){
        output5 = item["Output5"];
      }
      quest={
        question:question,
        instructions:instructions,
        hints:hints,
        wrench:wrench,
        solution:solution,
        input1:input1,
        input2:input2,
        input3:input3,
        input4:input4,
        input5:input5,
        output1:output1,
        output2:output2,
        output3:output3,
        output4:output4,
        output5:output5,
        type:type,
        topic:topic
      }
      challge.push(quest);
    });    
  }

  const changeHandler = async (e) => {
    e.preventDefault();
    if (e.target.files) {
      //console.log("1", e);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });


        let challge=[];
        if(workbook.SheetNames){
          workbook.SheetNames.forEach((sheet)=>{
            console.log(sheet);
            if(sheet && sheet==='PB'){
              const worksheet = workbook.Sheets[sheet];
              const json = xlsx.utils.sheet_to_json(worksheet);
              pbProcessor(json,challge);
            }

            if(sheet && sheet==='SB'){
              const worksheet = workbook.Sheets[sheet];
              const json = xlsx.utils.sheet_to_json(worksheet);
              sbProcessor(json,challge);
            }
          });
        }
        setChallenges(challge);
        console.log(challenges);
        fileRef.current.value = "";
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  //Perks Editor
  const onQuestionEditorStateChange = (state) => {
   
    setInputQue(state);
    convertQuestionToHTML();
  };

  const convertQuestionToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputQue.getCurrentContent());
    setConvertedQuestion(currentContentAsHTML);


  };

  const onDescriptionEditorStateChange = (state) => {
    
    setInputDesc(state);
    convertDescriptionToHTML();
  };

  const convertDescriptionToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputDesc.getCurrentContent());
    setConvertedDescription(currentContentAsHTML);


  };

  const onTopicEditorStateChange = (state) => {
    setInputTopic(state);
    convertTopicToHTML();
  };

  const convertTopicToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputTopic.getCurrentContent());
    setConvertedTopic(currentContentAsHTML);


  };

  const onHintEditorStateChange = (state) => {
    setInputHint(state);
    convertHintToHTML();
  };

  const convertHintToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputHint.getCurrentContent());
    setConvertedHint(currentContentAsHTML);
  };

  const onWrenchEditorStateChange = (state) => {
    setInputWrench(state);
    convertWrenchToHTML();
  };

  const convertWrenchToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputWrench.getCurrentContent());
    setConvertedWrench(currentContentAsHTML);
  };


  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };


  const handleUpload = async () => {
    setLoading(true);
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    let res = await addInterviewQuestion(
      { user_id: user._id, challenges: challenges },
      token
    );
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Questions Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setLoading(false);
      setTimeout(() => {
        getQuestionList()
      }, 1000);
    }
    else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
      setLoading(false);
    }
  };
  const handleImportUpload = async () => {
    setLoading(true);
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    importQues.forEach((item) => {
      item.question = "<p>" + item.question + "</p>"
    })
    let res = await addInterviewQuestion(
      { user_id: user._id, questions: importQues },
      token
    );
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Questions Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setLoading(false);
      setTimeout(() => {
        getQuestionList()
      }, 1000);
      setChallenges([])
    }
    else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
      setLoading(false);
    }

  };

  const handleSubmitForm = async values => {
    setLoading(true);
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    const data = {
      user_id: user._id,
      questions: [{ question: convertedQuestion, answer: values.answer, type: values.type, level: values.level, experience: values.experience, category: values.category }]
    }
    const res = await addInterviewQuestion(data, token)
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Questions Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setLoading(false);
      setShowQuestionForm(false);
      setInputQue(null);
      setConvertedQuestion(null);
      setInitialQuestion({
        question: "",
        answer: "",
        type: "",
        level: "",
        experience: "",
        category: "",
      });
      setTimeout(() => {
        getQuestionList()
      }, 1000);
    }
    else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
      setLoading(false);
    }
    console.log("response==>", res)
    // setModal(false)
    // window.location.reload();
    // }
  }

  const handleAddQuestion = async(values)=>{
    let res = await addQuestion(values)
    if (res && res?.data?.status == 200) {
      swal({
        title: "Success",
        text: "Questions Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setLoading(false);
      setShowQuestionForm(false);
      setInputQue(null);
      setInputDesc(null)
      setInputTopic(null)
      setConvertedQuestion(null);
      setConvertedDescription(null)
      setConvertedTopic(null)
      setInitialQuestion({
        question: "",
        answer: "",
        type: "",
        level: "",
        experience: "",
        category: "",
      });
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
      setLoading(false);
    }
   //  console.log('RES--------------', res)
  }


  return (
    <div className="p-5 bg-slate-100 h-full" style={{ minHeight: "90vh" }}>
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100">
        <p className="font-bold text-2xl">Add Interview Questions</p>
        {/* <div className="my-4 flex items-center"> */}
        {/* <div className="my-4">
            <p className="font-semibold">Import Spreadsheet</p>
            <p className="text-xs">
              ( Upload sheet with Questions, Answer as header )
            </p>
          </div>
          <label for="questionCSV">
            <p
              className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-4 py-1 text-white"
              style={{ backgroundColor: "#034488" }}
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.click();
                }
              }}
            >
              Import
            </p>
          </label>
          <input
            type="File"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            name="questionCSV"
            ref={fileRef}
            className="hidden"
            onChange={changeHandler}
          />
        </div> */}

        <div className="my-5">
          {showQuestionForm && (
            <Formik
              initialValues={initialQuestion}
              validate={(values) => {
                const errors = {};
                if (!convertedQuestion || convertedQuestion === null || convertedQuestion === "<p></p>") {
                  errors.question = "Required";
                }
                return errors;
              }}
              onSubmit={(values) => {
                if (!values.question || values.question == null || values.question.trim() == ""){
                  values.question = convertedQuestion
                }
                if (!values.description || values.description == null || values.description.trim() == ""){
                  values.description = convertedDescription
                }
                if (!values.topic || values.topic == null || values.topic.trim() == ""){
                  values.topic = convertedTopic
                }
              // console.log('optos------------', options)
              values.options = options
              values.type="sb"
               console.log('VALUES--------------', values)
               //  handleAddQuestion(values)
               // handleSubmitForm(values);
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Question</label>
                    <Editor
                      editorState={inputQue}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onQuestionEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Ideal Answer1</label>
                    <Field
                      name="answer"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="answer"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="my-6">
                    <label className="font-semibold">Options</label>
                    <br />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Enter a value"
                      className=" border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                    />
                    <button onClick={()=>handleAddValue()} className="m-1  p-2 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
							      style={{ backgroundColor: "#034488" }}>Add</button>
                   
                  </div>
                  <div>
                    <ul style={{display:"flex",}}>
                      {options.map((value, index) => (
                        <li key={index} className="m-2" style={{backgroundColor:"#baffba",padding:"2px", width:"12%"}}>
                          {value}
                          <span
                            style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                            onClick={() => handleDeleteValue(index)}
                          >
                            &#x2715; 
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="my-6">
                    <label className="font-semibold">Description</label>
                    <Editor
                      editorState={inputDesc}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onDescriptionEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="flex my-6 gap-x-3">
                    {/* <div className="md:w-2/4">
                      <label className="font-semibold">Type</label>
                      <Field
                        component="select"
                        id="type"
                        name="type"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Question Type</option>
                        <option value="Problem Statement">Problem Statement</option>
                        <option value="General Question">General Question</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="type"
                        className="text-red-600 text-sm"
                      />
                    </div> */}
                    
                    <div className="md:w-1/4">
                    <label className="font-semibold">Skills</label>
                      <Field
                        component="select"
                        id="category"
                        name="skill"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Skill Category</option>
                        <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                        <option value="Front End Developer">Front End Developer</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Angular Developer">Angular Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Java Developer">Java Developer</option>
                        <option value="Android Developer">Android Developer</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="category"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="md:w-4/4">
                      <label className="font-semibold">Difficulty</label>
                      <Field
                        component="select"
                        id="level"
                        name="level"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="level"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    {/* <div className="md:w-1/4">
                      <label className="font-semibold">Experience</label>
                      <Field
                        component="select"
                        id="experience"
                        name="experience"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Experience</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                        <option value="Professional">Professional</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="experience"
                        className="text-red-600 text-sm"
                      />
                    </div> */}
                    
                  </div>
                  {/* <div className="flex my-6 gap-x-3">
                    <div className="md:w-full">
                      <label className="font-semibold">Skills</label>
                      <Field
                        component="select"
                        id="category"
                        name="category"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Skill Category</option>
                        <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                        <option value="Front End Developer">Front End Developer</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Angular Developer">Angular Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Java Developer">Java Developer</option>
                        <option value="Android Developer">Android Developer</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="category"
                        className="text-red-600 text-sm"
                      />
                    </div>
                  </div> */}
                  <div className="my-6">
                    <label className="font-semibold">Topic</label>
                    <Editor
                      editorState={inputTopic}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onTopicEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                      onClick={()=>{
                        values.options = options
                        values.type="sb"
                        handleAddQuestion(values)
                        setOptions([])
                      } }
                    >
                      {questionEditIndex === null
                        ? "Add Question"
                        : " Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
                          type: "",
                          level: "",
                          description: "",
                          topic:"",
                          
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {showProblembasedQuestion && (
            <Formik
              initialValues={initialQuestion}
              validate={(values) => {
                const errors = {};
                if (!convertedQuestion || convertedQuestion === null || convertedQuestion === "<p></p>") {
                  errors.question = "Required";
                }
                return errors;
              }}
              onSubmit={(values) => {
                if (!values.question || values.question == null || values.question.trim() == ""){
                  values.question = convertedQuestion
                }
                if (!values.hints || values.hints == null || values.hints.trim() == ""){
                  values.hints = convertedHint
                }
                if (!values.wrench || values.wrench == null || values.wrench.trim() == ""){
                  values.wrench = convertedWrench
                }
                if (!values.topic || values.topic == null || values.topic.trim() == ""){
                  values.wrench = convertedTopic
                }
                values.instructions = instructions
                values.variations = variations
              //   handleAddQuestion(values)
              //  handleSubmitForm(values);
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Problem Statement</label>
                    <Editor
                      editorState={inputQue}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onQuestionEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Topic</label>
                    <Editor
                      editorState={inputTopic}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onTopicEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div>
                    <div className="my-6">
                      <label className="font-semibold">Instructions</label>
                      <br />
                      <input
                        type="text"
                        value={inputInstruction}
                        onChange={handleInputInstructionChange}
                        placeholder="Enter a value"
                        className=" border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      />
                      <button onClick={()=>handleAddInstruction()} className="m-1  p-2 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
                      style={{ backgroundColor: "#034488" }}>Add</button>
                    
                    </div>
                    <div>
                      <ul style={{display:"flex",}}>
                        {instructions.length > 0 && instructions.map((value, index) => (
                          <li key={index} className="m-2" style={{backgroundColor:"#baffba",padding:"2px", width:"12%"}}>
                            {value}
                            <span
                              style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                              onClick={() => handleDeleteInstruction(index)}
                            >
                              &#x2715; 
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Hints</label>
                    <Editor
                      editorState={inputHint}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onHintEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div>
                    <div className="my-6">
                      <label className="font-semibold">Variations</label>
                      <br />
                      <input
                        type="text"
                        value={inputVarationValue}
                        onChange={handleInputVariationChange}
                        placeholder="Enter a value"
                        className=" border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      />
                      <button onClick={()=>handleAddVariation()} className="m-1  p-2 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
                      style={{ backgroundColor: "#034488" }}>Add</button>
                    
                    </div>
                    <div>
                      <ul style={{display:"flex",}}>
                        {variations.map((value, index) => (
                          <li key={index} className="m-2" style={{backgroundColor:"#baffba",padding:"2px", width:"12%"}}>
                            {value}
                            <span
                              style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                              onClick={() => handleDeleteVariation(index)}
                            >
                              &#x2715; 
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Wrenches</label>
                    <Editor
                      editorState={inputWrench}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onWrenchEditorStateChange}
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      onClick={()=>{
                        values.options = options
                        values.type="pb"
                        handleAddQuestion(values)
                        setOptions([])
                        setInstructions([])
                        setVariations([])
                        setInputWrench(null)
                        setInputHint(null)
                      } }
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                    >
                      {questionEditIndex === null
                        ? "Add Question"
                        : " Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                      onClick={() => {
                        setShowProblembasedQuestion(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
                          level: "",
                          description: "",
                          topic:"",
                          instructions:[],
                          wrench:"",
                          hints:"",
                          variations:[]
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          <div className="my-3">
            {questions && questions.map((question, index) => {
              // //console.log(question)
              return (
                <div className="my-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      Question {index + 1} :{" "}
                      <span className="font-normal">{question.question}</span>
                    </p>
                    <div className="flex space-x-3">
                      {/* <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setInitialQuestion(question);
                          setQuestionEditIndex(index);
                          setShowQuestionForm(true);
                        }}
                      /> */}
                      <AiOutlineDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          setQuestions(
                            questions.filter(
                              (item) => item.question !== question.question
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  {question.answer && (
                    <p className="text-gray-600 font-semibold">
                      Answer :{" "}
                      <span className="font-normal">{question.answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex">
            {!showQuestionForm && (
              <div>
                <button
                  className="bg-[#034488] rounded-sm px-4 py-1 text-white m-2"
                  style={{ backgroundColor: "#034488" }}
                  onClick={() => {
                    setShowQuestionForm(true);
                  }}
                >
                  Add skill based questions
                </button>
                
              </div>
            )}
            <button
                  className="bg-[#034488] rounded-sm px-4 py-1 text-white m-2"
                  style={{ backgroundColor: "#034488" }}
                  onClick={() => {
                    setShowProblembasedQuestion(true);
                  }}
                >
                  Add Problem based question
                </button>
            {challenges.length > 0 && (
              <div className="">
                <button
                  onClick={handleUpload}
                  className="px-4 py-1 rounded-sm text-white mx-3"
                  style={{ backgroundColor: "#034488" }}>
                  {!loading ? (
                    "Upload"
                  ) : (
                    <img src={Loader} alt="loader" className="h-9 mx-auto" />
                  )}
                </button>
              </div>
            )}


          </div>
          <div className="my-4 flex items-center">
            <div className="my-4">
              <p className="font-semibold">Import Spreadsheet</p>
              <p className="text-xs">
                ( Upload sheet with Questions, Answer as header )
              </p>
            </div>
            <label for="questionCSV">
              <p
                className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-4 py-1 text-white"
                style={{ backgroundColor: "#034488" }}
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.click();
                  }
                }}
              >
                Import
              </p>
            </label>
            <input
              type="File"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              name="questionCSV"
              ref={fileRef}
              className="hidden"
              onChange={changeHandler}
            />
          </div>
          <div className="my-3">
            {importQues && importQues.map((question, index) => {
              // //console.log(question)
              return (
                <div className="my-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      Question {index + 1} :{" "}
                      <span className="font-normal">{question.question}</span>
                    </p>
                    <div className="flex space-x-3">
                      {/* <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setInitialQuestion(question);
                          setQuestionEditIndex(index);
                          setShowQuestionForm(true);
                        }}
                      /> */}
                      <AiOutlineDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          setimportQues(
                            importQues.filter(
                              (item) => item.question !== question.question
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  {question.answer && (
                    <p className="text-gray-600 font-semibold">
                      Answer :{" "}
                      <span className="font-normal">{question.answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {importQues.length > 0 && (
            <div className="">
              <button
                onClick={handleImportUpload}
                className="px-4 py-1 rounded-sm text-white mx-3"
                style={{ backgroundColor: "#034488" }}
              >
                {!loading ? (
                  "Upload"
                ) : (
                  <img src={Loader} alt="loader" className="h-9 mx-auto" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-1050 w-full"
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-1050 w-5/6"
            onClose={() => { }}
            static={true}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className={`${!modal ? "hidden" : "block"}`}>
                      <div className="w-full">
                        <div className="w-full">
                          <div className="my-5">

                            <Formik
                              initialValues={initialQuestion}
                              validate={(values) => {
                                const errors = {};
                                if (!convertedQuestion || convertedQuestion === null || convertedQuestion === "<p></p>") {
                                  errors.question = "Required";
                                }
                                return errors;
                              }}
                              onSubmit={async (values) => {
                                if (questionEditIndex !== null) {
                                  let update = await updateInterviewQuestion({ id: questionEditIndex._id, updates: { question: convertedQuestion, answer: values.answer, type: values.type, level: values.level, experience: values.experience, category: values.category } })
                                  if (update.status == 200) {
                                    // //console.log("updated")
                                    setModal(false)
                                    getQuestionList()
                                  }

                                  setQuestionEditIndex(null);
                                  setInputQue(null);
                                  setInitialQuestion({
                                    question: "",
                                    answer: "",
                                    type: "",
                                    level: "",
                                    experience: "",
                                    category: "",
                                  });
                                }
                              }}
                            >
                              {({ values }) => (
                                <Form>
                                  <div className="my-6">
                                    <label className="font-semibold">Question</label>
                                    <Editor
                                      editorState={inputQue}
                                      toolbarClassName="toolbarClassName"
                                      wrapperClassName="wrapperClassName"
                                      editorClassName="editorClassName"
                                      wrapperStyle={{
                                        width: "100%",
                                        border: "1px solid rgb(156 163 175 / 1)",
                                        borderRadius: "5px",
                                      }}
                                      editorStyle={{
                                        minHeight: "200px",
                                        paddingLeft: "1rem",
                                      }}
                                      onEditorStateChange={onQuestionEditorStateChange}
                                    />
                                    <ErrorMessage
                                      component="div"
                                      name="question"
                                      className="text-red-600 text-sm"
                                    />
                                  </div>
                                  <div className="my-6">
                                    <label className="font-semibold">Ideal Answer</label>
                                    <Field
                                      name="answer"
                                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                                      type="text"
                                    />
                                    <ErrorMessage
                                      component="div"
                                      name="answer"
                                      className="text-red-600 text-sm"
                                    />
                                  </div>
                                  <div className="flex my-6 gap-x-3">
                                    <div className="md:w-2/4">
                                      <label className="font-semibold">Type</label>
                                      <Field
                                        component="select"
                                        id="type"
                                        name="type"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                                        multiple={false}
                                      >
                                        <option value="" selected disabled>Select Question Type</option>
                                        <option value="Problem Statement">Problem Statement</option>
                                        <option value="General Question">General Question</option>
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        name="type"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                    <div className="md:w-1/4">
                                      <label className="font-semibold">Level</label>
                                      <Field
                                        component="select"
                                        id="level"
                                        name="level"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                                        multiple={false}
                                      >
                                        <option value="" selected disabled>Select Level</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Hard">Hard</option>
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        name="level"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                    <div className="md:w-1/4">
                                      <label className="font-semibold">Experience</label>
                                      <Field
                                        component="select"
                                        id="experience"
                                        name="experience"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                                        multiple={false}
                                      >
                                        <option value="" selected disabled>Select Experience</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advance">Advance</option>
                                        <option value="Professional">Professional</option>
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        name="experience"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex my-6 gap-x-3">
                                    <div className="md:w-full">
                                      <label className="font-semibold">Category</label>
                                      <Field
                                        component="select"
                                        id="category"
                                        name="category"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                                        multiple={false}
                                      >
                                        <option value="" selected disabled>Select Skill Category</option>
                                        <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                                        <option value="Front End Developer">Front End Developer</option>
                                        <option value="React Developer">React Developer</option>
                                        <option value="Angular Developer">Angular Developer</option>
                                        <option value="Backend Developer">Backend Developer</option>
                                        <option value="Python Developer">Python Developer</option>
                                        <option value="Java Developer">Java Developer</option>
                                        <option value="Android Developer">Android Developer</option>
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        name="category"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex space-x-4">
                                    <button
                                      type="submit"
                                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                                      style={{ backgroundColor: "#034488" }}
                                    >
                                      {questionEditIndex === null
                                        ? "Add Question"
                                        : " Save Changes"}
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                                      onClick={() => {
                                        setModal(false);
                                        setInitialQuestion({
                                          question: "",
                                          answer: "",
                                          type: "",
                                          level: "",
                                          experience: "",
                                          category: "",
                                        });
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>


                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100 my-3"><p className="font-bold text-xl">Uploaded Questions</p>
        <div className="my-3">
          {quesList && quesList.map((question, index) => {
            return (
              <div className="my-5">
                <div className="flex justify-between">
                  <p className="font-semibold">
                    Question {index + 1} :{" "}
                    <span className="font-normal" dangerouslySetInnerHTML={createMarkup(question.question)}></span>
                  </p>
                  <div className="flex space-x-3">
                    <RiEditBoxLine
                      className="cursor-pointer text-blue-500"
                      onClick={() => {
                        const blocksFromHtml = htmlToDraft(question.question);
                        const { contentBlocks, entityMap } = blocksFromHtml;
                        const contentState = ContentState.createFromBlockArray(
                          contentBlocks,
                          entityMap
                        );
                        const editorState = EditorState.createWithContent(contentState);
                        setInputQue(editorState);
                        setModal(true)
                        setInitialQuestion({ answer: question.answer });
                        setQuestionEditIndex(question);
                      }}
                    />
                    <AiOutlineDelete
                      className="cursor-pointer text-red-600"
                      onClick={async () => {
                        let update = await updateInterviewQuestion({ id: questionEditIndex._id, updates: { isDeleted: true } })
                        if (update.status == 200) {
                          // //console.log("updated")
                          setModal(false)
                          getQuestionList()
                        }
                      }}
                    />
                  </div>
                </div>
                {question.answer && (
                  <p className="text-gray-600 font-semibold">
                    Answer :{" "}
                    <span className="font-normal">{question.answer}</span>
                  </p>
                )}
                <p className="text-gray-600 font-semibold">
                  Type :{" "}
                  <span className="font-normal">{question.type}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Level :{" "}
                  <span className="font-normal">{question.level}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Experience :{" "}
                  <span className="font-normal">{question.experience}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Category :{" "}
                  <span className="font-normal">{question.category}</span>
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
};

export default AddQuestions;
