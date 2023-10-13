import { useState,useEffect } from "react";
import getStorage from "../service/storageService";


export const SkillsView = () => {
    let user = JSON.parse(getStorage("user"));
    const [groupedData, setGroupedData] = useState({});
    const [roleAverages, setRoleAverages] = useState({});
    
    const processGroupData = async(data) =>{
          // Group the data by role
          const groupedByRole = data.reduce((acc, item) => {
            const { role, primarySkill, secondarySkill, proficiency } = item;
            if (!acc[role]) {
              acc[role] = {};
            }
          
            if (!acc[role][primarySkill]) {
              acc[role][primarySkill] = {};
              acc[role][primarySkill].proficiencies = [];
            }
          
            if (!acc[role][primarySkill][secondarySkill]) {
              acc[role][primarySkill][secondarySkill] = [];
            }
          
            acc[role][primarySkill][secondarySkill].push(proficiency);
            acc[role][primarySkill].proficiencies.push(proficiency);
          
            return acc;
          }, {});
          setGroupedData(groupedByRole);
          return groupedByRole;
    }

    const processRoleAverage = async(groupedByRole) =>{
        const roleAverages = {};
        Object.keys(groupedByRole).forEach((role) => {
          const primarySkills = groupedByRole[role];
          const roleProficiencies = [];
          Object.keys(primarySkills).forEach((primarySkill) => {
            const secondarySkills = primarySkills[primarySkill];
            roleProficiencies.push(...secondarySkills.proficiencies);
          });
          const averageProficiency =
            roleProficiencies.reduce((sum, proficiency) => sum + proficiency, 0) /
            roleProficiencies.length;
          roleAverages[role] = Math.round(averageProficiency);
        });
        return roleAverages;
    }

    const initialProcess = async() =>{
        try{
            if(user?.tools){
                processGroupData(user?.tools).then((groupedByRole) =>{
                    processRoleAverage(groupedByRole).then((roleAverages)=>{
                        setRoleAverages(roleAverages);
                    })
                })
            }
        }catch(err){}
    }

    useEffect(() => {
        initialProcess();
        
    },[]);

    return(
        <>
            <div className="border-b border-gray-200 pb-3  ml-3">
                <label className="font-semibold text-lg w-2/5 mx-2 ">
                    Technical skills
                </label>
                <br/>
                {Object.entries(groupedData).map(([role], index) => (
                    <div key={index}>
                        <br/>   
                        <div className="d-flex justify-between mr-5">
                            <p className="font-semibold text-lg w-2/5 mx-2">{role}</p>
                            <span className="bg-blue-100 inline-block text-blue-800 text-xs my-1 font-semibold mr-2 px-3 py-1.5 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                                style={{ color: "#262020", backgroundColor: "#b8f39e" }}><b>{roleAverages[role]}</b></span>
                        </div>
                        <br/>           
                        <div >
                            {Object.keys(groupedData[role]).map((value, index) => (
                            <span className="bg-blue-100 inline-block text-blue-800 text-xs my-1 font-semibold mr-2 px-3 py-1.5 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                            style={{ color: "#228276", backgroundColor: "rgba(34, 130, 118, 0.1)" }}>{value}</span>
                            ))}
                        </div>
                    </div>
                ))}
                <br/>   
            </div>
        </>
    );

}

export default SkillsView