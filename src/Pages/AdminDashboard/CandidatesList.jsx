import React from "react";
import { getUserList, updateLinkedInProfile,getUserListFirstLetter } from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import * as xlsx from "xlsx/xlsx.mjs";

const CandiadateList = () => {
  const [userList, setUserList] = React.useState([]);
  const [selectedLetter, setSelectedLetter] = React.useState('A');
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    const initial = async () => {
      let token = await getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      setUser(user);
      //let response = await getUserList({ user_id: user._id }, token);
      let response = await getUserListFirstLetter({ user_id: user._id }, selectedLetter);
      if (response && response?.status === 200) {
        setUserList(response?.data?.user);
      }
    };
    initial();
  }, [selectedLetter]);

  const updateSelectedLetter = async (letter) =>{
    setSelectedLetter(letter);
    setUserList([]);
  }

  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      const req = [];
      jsonData.forEach((item) => {
        req.push(item[0]);
      });
        updateLinkedInProfile(req).then((value)=>{
        });
    };
    
    reader.readAsArrayBuffer(file);
  };

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let res =await  getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.list_candidates === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();  
  }, []);


  return (
    <div className="p-5">
      <p className="text-2xl font-semibold mx-10">Candidates List</p>
      <div className="mt-3">
        <div className="flex flex-col mx-10">
          <div className="overflow-x-auto w-[90%] sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div className="flex space-x-10 my-3">
                  {/* <label htmlFor="csvFile" className="text-sm font-medium text-gray-900">
                   Update LinkedinUrl
                  </label> */}
                  {/* <input type="file" id="csvFile" accept=".csv" onChange={handleFileUpload} className="ml-2" /> */}
 {/* Render buttons for each letter from A to Z */}
            {Array.from(Array(26), (_, index) => String.fromCharCode(65 + index)).map(
                  (letter) => (
                    <button key={letter} onClick={() => updateSelectedLetter(letter)}>
                      {letter}
                    </button>
                  )
                )}                  
              </div>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        View Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => {
                      return (
                        <tr
                          className={`${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } border-b`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.username}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.firstName}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/AdminUserProfile/${user._id}`}>View Detail</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div><SkillsUpload/></div> */}
    </div>
  );
};

export default CandiadateList;
