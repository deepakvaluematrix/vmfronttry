import getStorage from "../../service/storageService";
import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import ls from 'localstorage-slim';
import { getSkills, updateUserLanguageDetails, updateUserSkill, updateUserSkillDetails } from "../../service/api"
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export const Skill = () => {
  let user = JSON.parse(getStorage("user"));
  const [groupedData, setGroupedData] = useState({});
  const [roleProficiency, setRoleProficiency] = useState({});
  // Set access-token
  const [access_token , setAccessToken] = useState(null)
  // Role value
  const [roleValue, setRoleValue] = useState(0);
  const [checkboxStates, setCheckboxStates] = useState({}); // Track checkbox states
  // Skill Search
  const [searchQuery, setSearchQuery] = useState("");
  const [proficiencyMap, setProficiencyMap] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [dbSkills, setDbSkills] = useState(null);
  const navigate = useNavigate();


  const processProficiencyMap = async() =>{
    // Create a map of proficiency values from  user?.tools based on role and primarySkill
    // This is skills which are from database, which user already has selected
    // Map is an empty object
    const proficiencyMap = user?.tools?.reduce((map, item) => {
      const { role, primarySkill } = item;
      // THis is role + primary skill
      const key = `${role}_${primarySkill}`;
      if(item.proficiency){
        map[key] = item.proficiency;
      }else{
        map[key] = 0;
      }
      // Map {key : item.proficiency}
      return map;
    }, {});
    setProficiencyMap(proficiencyMap);
    return proficiencyMap;
  }

  const processUpdatedData = async(proficiencyMap) =>{
    // Update the proficiency values in data based on the proficiencyMap
    //  We are getting db skills from the backend
    let access_token = getStorage("access_token");
    let res = await getSkills({ user_id: user._id }, access_token);
    if(res && res?.data){
      setDbSkills(res?.data);
      const updatedData = res?.data.map((item) => {
        const { role, primarySkill } = item;
        const key = `${role}_${primarySkill}`;
        const updatedProficiency = proficiencyMap[key];
        return {
          ...item,
          proficiency: updatedProficiency || (item.proficiency?item.proficiency:0),
        };
      });
      setUpdatedData(updatedData);
      return updatedData;
    }
  }

  const processGroupData = async(updatedData) =>{
    // Group the updated data by "role", "primarySkill", and "secondarySkill" using reduce
    // One by one db skill will go inside reduce function and item will be pushed inside result object(initially {})
      let groupedData = updatedData.reduce((result, item) => {
        const { role, primarySkill, secondarySkill } = item;
        if (!result[role]) {
          result[role] = {};
        }
        if (!result[role][primarySkill]) {
          result[role][primarySkill] = [];
        }
        result[role][primarySkill].push({
          secondarySkill,
          proficiency: item.proficiency,
        });
        return result;
      }, {})
      setGroupedData(groupedData);
      return groupedData;
  }

  const processRoleAverage = async(groupedData) =>{
    let roleAverageProficiency = {};
    // Assuming you have the groupedData created in the useEffect
    Object.keys(groupedData).forEach((role) => {
      let totalProficiency = 0;
      let numSkills = 0;
      Object.keys(groupedData[role]).forEach((primarySkill) => {
        const skillArray = groupedData[role][primarySkill];
        skillArray.forEach((skill) => {
          if(skill.proficiency){
            totalProficiency += parseInt(skill.proficiency, 10);
          }else{
            totalProficiency += parseInt(0, 10);
          }
          numSkills++;
        });
      });
      const averageProficiency = (numSkills === 0 ? 0 : totalProficiency / numSkills);
      roleAverageProficiency[role] = Math.round(averageProficiency);
    });
    return roleAverageProficiency;
  }

  const initialProcess = async() =>{
    try{
      processProficiencyMap().then((proficiencyMap)=>{
          processUpdatedData(proficiencyMap).then((updatedData)=>{
            processGroupData(updatedData).then((groupedData)=>{
              processRoleAverage(groupedData).then((roleProficiency)=>{
                setRoleProficiency(roleProficiency);
              })
            });
          });
      });
    }catch(err){}
  }

  useEffect(()=>{
    initialProcess();
  } , [])

  // Update Skill
  // const updateUserSkill = async (values)=>{
  const updateSkill = async (role, proficiency, primarySkills) => {
    let access_token = getStorage("access_token");
    let tools = [];
    Object.keys(roleProficiency).forEach((role)=>{
      if(roleProficiency[role]>0){
        let filteredSkill = dbSkills.filter(item => item.role === role);
        if(filteredSkill && filteredSkill.length>0){
          const updatedSkill = filteredSkill.map(({ _id, __v, ...rest }) => {
            return { ...rest, proficiency: roleProficiency[role] };
          });
          tools.push(...updatedSkill);
        }
      }
    });
    let res = await updateUserSkillDetails
    (
      { user_id: user._id, updates: { data:{tools}} },
      { access_token: access_token }
    ).then((res)=>{
      if(res && res?.data?.user){
        ls.remove("user");
        ls.set("user", JSON.stringify(res?.data?.user));
        swal({
          title: "Skills update",
          text: "Technical Skills updated successfully",
          icon: "success",
          button: "Ok",
        }).then(()=>{
          if(user.user_type==='XI'){
            navigate("/XI/profile");
          }else if(user.user_type==='User'){
            navigate("/user/profile");
          }
        })
      }
    });
  };

  useEffect(() => {
    const initialCheckboxStates = {};
    Object.keys(roleProficiency).forEach((role) => {
      initialCheckboxStates[role] = roleProficiency[role] > 0;
    });
    setCheckboxStates(initialCheckboxStates);
  }, [roleProficiency]);

 

  return (
    <div>
      <label className="font-semibold text-lg w-2/5 mx-2">Technical skills</label>
      <div className="my-3 px-4 flex items-center flex-wrap">
        <input
          type="text"
          className="w-3/4 text-600 border-[0.5px] border-[#6b7280] p-2"
          placeholder="Search skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 mx-auto py-3 px-7 flex justify-center text-white rounded-lg my-5"
          style={{ backgroundColor: "#034488" }}
          onClick={() => {
              updateSkill();
          }}
        >
          Save skill
        </button>
        <b>Please make necessary changes and click on save skill</b>
      </div>
      
      <div className="md:w-10/3 flex w-full space-y-1 my-15 my-3 px-4 flex items-center flex-wrap">
        <div
          className="w-full rounded-[20px]"
          style={{
            border: "1px solid #bcbcbc",
            outlineStyle: "outset",
            outlineColor: "#E3E3E3",
          }}
        >
          <div className="w-full h-96 overflow-y-auto scrollbar scrollbar-thumb-blue-500 scrollbar-track-blue-100">
            {Object.entries(groupedData)
              .filter(([role]) =>
                role?.toLowerCase().includes(searchQuery?.toLowerCase())
              )
              .map(([role, primarySkills], index) => (
                <Disclosure>
                  <Disclosure.Button
                    className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 }`}
                  >
                    <span className="text-base">
                      <b>{role}</b>
                    </span>
                    <div className="ml-auto mr-5 flex items-center space-x-2">
                      <p>0</p>
                      <input type="range" min="0" max="5" default={0} value={roleProficiency[role]}
                        onChange={(e) => {
                          let value = parseInt(e.target.value, 10);
                          value = Math.round(value)
                          
                          setRoleProficiency((prevState) => ({
                            ...prevState,
                            [role]: value,
                          }));
                          // Update proficiency for all primary skills inside the role
                          const updatedPrimarySkills = Object.entries(
                            groupedData[role]
                          ).reduce((acc, [primarySkill, secondarySkills]) => {
                            acc[primarySkill] = value;
                            return acc;
                          }, {});

                          setRoleProficiency((prevState) => ({
                            ...prevState,
                            [role]: value,
                            ...updatedPrimarySkills,
                          }));

                          // Update checkbox states for all primary skills inside the role
                          const updatedCheckboxStates = Object.entries(
                            checkboxStates
                          ).reduce((acc, [key, isChecked]) => {
                            acc[key] = key === role ? value > 0 : isChecked;
                            return acc;
                          }, {});
                          setCheckboxStates(updatedCheckboxStates);
                        }}
                      />
                      <p>5</p>
                    </div>
                    <div className="mr-5 flex items-right space-x-2 bubble h-[22px] w-[22px] rounded-full bg-blue-400 justify-center align-middle text-body-medium text-white font-bold">
                      <b>{roleProficiency[role]}</b>
                    </div>

                    <ChevronUpIcon
                      className={`${true ? "rotate-180 transform" : ""} h-5 w-5 text-blue-500`}
                    />
                  </Disclosure.Button>
                  {Object.entries(primarySkills).map(
                    ([primarySkill, secondarySkills]) => (
                      <Disclosure.Panel
                        className=" bg-stone-50"
                        key={primarySkill}
                      >
                        <div>
                          <Disclosure>
                            <div className={`${false ? "shadow-md" : ""}`}>
                              <Disclosure.Button
                                className={`flex w-full justify-between rounded-lg  px-4 py-3 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 ${
                                  false ? "shadow-lg" : ""
                                } `}
                              >
                                <span className="uppercase w-96">
                                  {primarySkill}
                                </span>
                                <div className="ml-auto mr-10 flex items-right space-x-2">
                                  {/* <input type="checkbox"
                                                checked={secondarySkills[0]?.proficiency>0?true:false}
                                                onChange={(e) => {
                                                    // Update the proficiency for the secondary skill
                                                }}/> */}
                                  {/* {console.log(
                                    "CJECK***********",
                                    primarySkill
                                  )} */}
                                  {/* <input
                                    type="checkbox"
                                    value={primarySkill}
                                    checked={checkboxStates[role]}
                                    onChange={(e) => {
                                      // Update the corresponding checkbox state and proficiency slider value
                                      const checked = e.target.checked;
                                      setCheckboxStates((prevState) => ({
                                        ...prevState,
                                        [primarySkill]: checked,
                                      }));
                                    }}
                                  /> */}
                                </div>
                                <div className="flex items-center space-x-2 primary-skill-slider ml-auto"></div>
                              </Disclosure.Button>
                            </div>
                          </Disclosure>
                        </div>
                      </Disclosure.Panel>
                    )
                  )}
                </Disclosure>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;