import React, { useState, Fragment } from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addSkills, getRoles, getSkills, updateSkills } from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { v4 as uuidv4 } from 'uuid';
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
const AddSkills = () => {
  //const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [prof, setProf] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState(['']);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [skillsset, setSkillsset] = React.useState([]);
  const sk = skillsset.map((ite) => ite.role);
  const [skillError, setSkillError] = React.useState(null);
  const [roles, setRoles] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState([]);
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [newSecondarySkill, setNewSecondarySkill] = React.useState('');
  const [edit, setEdit] = React.useState(null);
  const [showError, setShowError] = React.useState(true);
  const [showLsForm, setShowLsForm] = React.useState(false);
  const [lsinitialValues, setLsInitialValues] = React.useState({
    role: "",
    primarySkills: "",
    secondarySkills: "",
  });
  const [lserror, setLsFormError] = React.useState(false);

  const handleEditChange = (e) => setNewSecondarySkill(e.target.value)

  const handleAddSkill = () => {
    setEdit();
    setLsInitialValues();
    setShowLsForm(true);
  };

  const handleReset = () => {
    setEdit(null);
    setShowError(false);
    setShowLsForm(false);
    setLsInitialValues({
      role: null,
      primarySkills: null,
      secondarySkills: null
    });
  };

  const handleEdit = (skill, id) => {
    setEditingIndex(id);
    setNewSecondarySkill(skill);
  };
  const handleImport = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const updateSkill = (data) => {
    const newData = {
      "_id": data._id,
      "primarySkill": data.primarySkill,
      "secondarySkill": newSecondarySkill,
      "roles": data.role,
      "__v": data.__v,
      "proficiency": data.proficiency
    };
    const updatedSkills = skillsset.map(skill => {
      if (skill._id === editingIndex) {
        skill.secondarySkill = newSecondarySkill;
      }
      return skill;
    });
    setSkillsset(updatedSkills);
    setEditingIndex(null);
    setNewSecondarySkill('');
    updateskill(newData);

  };

  const changeHandler = async (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        let s = skills;
        // console.log("json");
        // console.log(json);        
        json.map((value,i) =>{
          let role="";
          let pSkill="";
          let sSkill="";
          if(value.Role){
            role = value.Role
          }
          if(value["Primary Skill"]){
            pSkill=value["Primary Skill"];
          }
          if(value['Secondary Skill']){
            sSkill=value['Secondary Skill'];
          }

          s.push({
            Role: role,
            PrimarySkill: pSkill,
            SecondarySkill: sSkill,
          });
        });
        //console.log("s");
        //console.log(s);
        /*for (let i = 0; i < json.length; i++) {
          let secSkills = json[i]["Secondary Skill"]
            .split("  ")[0]
            .split("\n");
          if (secSkills.length === 1) {
            secSkills = secSkills[0].split(",")
          }
          for (let j = 0; j < secSkills.length; j++) {
            const res = s.findIndex((el) => {
              return (
                el.Role.toLowerCase() === json[i].Role.toLowerCase() &&
                json[i]["Primary Skill"].toLowerCase() ===
                el.PrimarySkill.toLowerCase() &&
                secSkills[j].toLowerCase() === el.SecondarySkill.toLowerCase()
              );
            });
            const res2 = dbSkills.findIndex((el) => {
              return (
                el.Role.toLowerCase() === json[i].Role.toLowerCase() &&
                json[i]["Primary Skill"].toLowerCase() ===
                el.PrimarySkill.toLowerCase() &&
                secSkills[j].toLowerCase() === el.SecondarySkill.toLowerCase()
              );
            });
            if (res === -1 && res2 === -1) {
              s.push({
                Role: json[i].Role,
                PrimarySkill: json[i]["Primary Skill"],
                SecondarySkill: secSkills[j],
              });
            }
          }
        }*/
        await setSkills(s);

        // setSkills([...skills, "S"]);
        // setSkills(
        //   skills.filter((el) => {
        //     return el !== "S";
        //   })
        // );
        fileRef.current.value = "";
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
    //console.log("skills");
    //console.log(skills);
    if (skills) {
      handleUpload();
    }
  };

  const handleUpload = async () => {
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    let res = await addSkills({ user_id: user._id, skills: skills }, token);
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Skills Added Successfully",
        icon: "success",
        button: "Ok",
      });
    }
  };
  const updateskill = async (data) => {
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    let res = await updateSkills(data, token);
    setTimeout(() => {
      console.log('This will run after 1 second!')
    }, 5000);
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Skills Updated Successfully",
        icon: "success",
        button: "Ok",
      });
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    let user = JSON.parse(await getStorage("user"));

    let token = user.access_token;
    const { role, primarySkills, secondarySkills } = values;
    let skills = [{ Role: role, PrimarySkill: primarySkills, SecondarySkill: secondarySkills }];

    let res = await addSkills({ user_id: uuidv4(), skills: skills }, token);

    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Skills Added Successfully",
        icon: "success",
        button: "Ok",
      });
    }

    // Reset the form
    resetForm({});

    // Close the modal
    // onClose();
  };

  const currentRoles = async () => {
    let user = JSON.parse(await getStorage("user"));
    let token = user.access_token;
    let res = await getRoles(token);
    if (res && res.status == 200) {
      setRoles(res?.data[0]?.roles);
    }
  };

  const handleRoleSelect = async (e) => {
    setSelectedRole(e.target.value);
    // let roleStr = e.target.value;
    // let user = JSON.parse(await getStorage("user"));
    // let token = user.access_token;
    // if(roleStr){
    //   getSkillsByRole(roleStr,token);
    // }
  }
  const myComponent = {
    width: '100%',
    height: '500px',
    overflow: 'scroll'
  };
  const TableHeadStyle = {
    position: 'sticky',
    top: '0px',
    margin: '0 0 0 0',
  }

// Get the technical roles available in the db

  const initial = async () => {
    let user = JSON.parse(await getStorage("user"));
    let p = JSON.parse(await getStorage("prof"));
    let pr1 = JSON.parse(await getStorage("RolesProf"));
    let res = await getSkills({ user_id: user._id }, user.access_token);
    setSkillsset(res.data);
    let roles = new Set();
    const pSkills = [];
    const sSkills = [];
    const s = [];
    const ps = [];
    if (res && res.status === 200) {
      await res.data.map((el) => {
        el.proficiency = 0;
        roles.add(el.role);
        if (pSkills[el.role]) {
          pSkills[el.role].add(el.primarySkill);
        } else {
          pSkills[el.role] = new Set([el.primarySkill]);


        }
        if (sSkills[el.role]) {
          sSkills[el.role].add(el.secondarySkill);
          // ps.push(el.secondarySkill);

        } else {
          sSkills[el.role] = new Set([el.secondarySkill]);
        }
        return null;
      });
      setPrimarySkills(pSkills);
      setSecondarySkills(sSkills);
    }
  };
  React.useEffect(() => {
    
    currentRoles();
    initial();
  }, []);

  return (
    <div className="p-5 bg-slate-100 h-100" style={{ height: '100%' }}>
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100">
        <p className="font-bold text-2xl">Add Skills</p>
        <div className="my-4 flex items-center">
          <div className="my-4">
            <p className="font-semibold">Import Spreadsheet</p>
            <p className="text-xs">( Upload sheet with Skills as header )</p>
          </div>
          <label for="skillCSV">
            <p
              className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-2 py-1 text-white"
              onClick={handleImport}
            >
              Import
            </p>
          </label>
          <input
            type="File"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            name="skillCSV"
            ref={fileRef}
            className="hidden"
            onChange={changeHandler}
          />
          <button
            className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-2 py-1 text-white"

            onClick={handleAddSkill}
          >
            Add Skills
          </button>
          <div>
            <div className="my-3 px-4 flex items-center flex-wrap">
              {showLsForm && (
                <Transition
                  appear
                  show={showLsForm}
                  as={Fragment}
                  className="relative z-10000"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10000"
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

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                            <div
                              className={`${!showLsForm ? "hidden" : "block"}`}
                            >
                              <Formik
                                initialValues={{ role: "", primarySkill: "", secondarySkills: "" }}
                                onSubmit={handleSubmit}
                              >
                                {({ isSubmitting }) => (
                                  <Form className="w-full py-4">
                                    <div className="flex px-5 w-full justify-center text-center">
                                      <label className="font-semibold text-lg w-2/5 mx-2 align-middle">
                                        ADD Skills
                                      </label></div><br /><br />
                                    <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                                      <div className="md:flex w-full space-y-1">
                                        <Field name="role" placeholder="Role" required />
                                      </div>
                                      <div className="md:flex w-full space-y-1">
                                        <Field name="primarySkills" placeholder="Primary skills" required />
                                      </div>
                                      <div className="md:flex w-full space-y-1">
                                        <Field name="secondarySkills" placeholder="Secondary Skills" required />
                                      </div>
                                    </div><br /><br />
                                    <div className="flex px-5 w-full justify-center text-center">
                                      <button type="submit" disabled={isSubmitting} className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                        style={{ backgroundColor: "#034488" }}>
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        className=" border-[0.4px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-6"
                                        // ref={resetBtn}
                                        onClick={handleReset}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
            </div>

          </div>
        </div>
        <div>
          <p className="font-semibold">Select role</p>
          <select onChange={handleRoleSelect} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]">
            <option value={"0"} selected>Select role</option>
            {
              roles.map(data =>
                <option value={data} key={data}>{data}</option>
              )
            }
          </select>
        </div>

        <div className="p-5 bg-slate-100 h-100" style={{ height: '100%' }}>
          <div className="flex flex-col mx-10">
            <div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <div style={{ height: '300px' }}>
                    <div style={myComponent}>
                      <table className="w-full">
                        <thead className="bg-white border-b" style={TableHeadStyle}>
                          <tr>
                            <th
                              scope="col"
                              className="lg:text-sm md:text-xs sm:text-[10px] font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Id
                            </th>
                            <th
                              scope="col"
                              className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Role
                            </th>
                            <th
                              scope="col"
                              className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Primary Skills
                            </th>
                            <th
                              scope="col"
                              className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Secondary Skills
                            </th>
                            <th scope="col" className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left">Action</th>
                          </tr>
                        </thead>

                        <tbody style={{ height: '200px', overflowY: 'scroll' }}>
                          {skillsset.filter(skill => skill.role === selectedRole).map((skill, index) => (
                            <tr key={skill._id}>
                              <td>{index + 1}</td>
                              <td>{skill.id}</td>
                              <td className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left">{skill.role}</td>
                              <td className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left">{skill.primarySkill}</td>
                              <td className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left">
                                {editingIndex === skill._id ? (
                                  <input
                                    type="text"
                                    value={newSecondarySkill}
                                    onChange={handleEditChange}
                                  />
                                ) : (
                                  <div>{skill.secondarySkill}</div>
                                )}
                              </td>
                              <td scope="col" className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left">
                                {editingIndex === skill._id ? (
                                  <button className="px-2 py-1 bg-blue-500 text-white rounded-sm" onClick={() => updateSkill(skill)}>
                                    Update
                                  </button>
                                ) : (
                                  <button className="px-2 py-1 bg-blue-500 text-white rounded-sm" onClick={() => handleEdit(skill.secondarySkill, skill._id)}>
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
