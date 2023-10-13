import React, { useState, Fragment, useEffect } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  ListXIPanels,
  getXIUserList,
  getSkills,
  addXIPanels,
  updateXIPanels,
} from "../../service/api";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import plus from '../../assets/images/plus.svg'
import filter from '../../assets/images/filter.svg'
import SearchI from '../../assets/images/searchIcon.svg'
import { Modal } from "@material-ui/core";
import { Grid, Card, Badge, CardContent, Box, CardHeader, Avatar, AvatarGroup, IconButton, Button, TextField, InputAdornment, InputBase } from '@mui/material';
import XICards1 from "../../Components/AdminDashboard/XICards.jsx";
import XIPanelView from "../../Components/AdminDashboard/XIPanelView.jsx";
import CloseIcon from '../../assets/images/crossOne.png'
import Plus from '../../assets/images/plus.svg'
import { FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ProfileAvatar from '../../Components/AdminDashboard/Avatar.jsx';
import rightArrow from '../../assets/images/right-arrow.svg'
import swal from "sweetalert";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const style = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '14px 14px 14px 14px',
  margin: '10px',
  padding: '20px 0px'
};
const XIPanels = () => {
  const [userList, setUserList] = React.useState([]);
  // console.log(userList, 'panel details')
  const [page, setPage] = useState(1);
  const [age, setAge] = React.useState('');
  // const [values, setValues] = useState(['']);
  const [selectedValue, setSelectedValue] = useState(false);
  const [cardValue, setCardValue] = React.useState(['']);
  // console.log(cardValue, 'cardValues')
  const [showAvatar, setShowAvatar] = React.useState(-1);
  const [addpanel, setAddpanel] = useState(['']);
  const [value, setValue] = useState('');
  const [values, setValues] = useState([]);

  // const handleAdd = () => {
  //   if (value !== '') {
  //     setValues([...values, value]);
  //     setValue('');
  //   }
  // };

  const handleAdd = () => {
    if (value && !values.includes(value)) {
      setValues([...values, value]);
    }
  };


  const handleDelete = (index) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
  };

  const handleChange = (event) => {
    // setValue(event.target.value);
    setValues([...values ,event.target.value])
  };
  const [xiUsers, setXiUsers] = useState([''])
  console.log(xiUsers, 'xixUserss')
  const [userList1, setUserList1] = useState(['']);
  const [userList2, setUserList2] = useState(['']);
  // console.log(userList1, 'xiList ')
  const [skillsData, setSkillsData] = useState([''])
  const primarySkills = [...new Set(skillsData?.map(skill => skill?.primarySkill))];
  // console.log(primarySkills, 'primary skills')






  // const updatedData = cardValue?.users.map(panel => {
  //   const updatedUsers = panel?.users?.filter(user => {
  //     const foundUser = userList1?.find(xiUser => xiUser._id === user.xiId);
  //     return foundUser === undefined;
  //   });
  //   return { ...panel, users: updatedUsers };
  // });
  // console.log(updatedData, 'updated data')

  const handleCreateXI = async () => {
    const panelName = document.getElementById("panel-name").value;
    const skills = selectedSkills;
    const xiIds = values.filter(xi => xi.trim() !== '').map(xi => {
      const matchingUser = userList1.find(user => user.firstName === xi);
      // console.log(matchingUser?.firstName, matchingUser?._id);
      return matchingUser?._id;
    });

    const newXi = {
      panelName: panelName,
      skills: skills,
      xiIds: xiIds,
      permissions: ["View All Interviews", "Read and Write"]
    };
    console.log(newXi, 'newXi in add panel')

    let res = await addXIPanels(newXi);
    if (res.status === 200) {
      let updatedResponse = await ListXIPanels();
      if (updatedResponse && updatedResponse.status === 200) {
        setUserList(updatedResponse.data.panels);
      }
      swal({
        icon: "success",
        title: "Add XI",
        text: " Panel Created Succesfully",
        button: "Continue",
      }).then(() => {
        handleClose();
      })

    }


    // You can then use the `newXi` object to send it to your backend API or update the state of your component accordingly.
  };


  React.useEffect(() => {
    const initial = async () => {
      let token = await getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      let response = await getXIUserList({ user_id: user._id }, token);
      if (response && response.status === 200) {
        setUserList1(response.data);
      }
    };
    initial();
  }, []);
  React.useEffect(() => {
    const initial = async () => {
      let token = await getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      let response = await getSkills({ user_id: user._id }, token);
      if (response && response.status === 200) {
        setSkillsData(response.data);
      }
    };
    initial();
  }, []);

  const [selectedCardIndex, setSelectedCardIndex] = React.useState(-1);

  const handleCardClick = (index, item) => {
    setCardValue(item);
    setSelectedCardIndex(index);
    setShowAvatar((prevIndex) => (prevIndex === index ? prevIndex : index));

  };


  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // const handleSkillChange = (event) => {
  //   setSelectedSkills(event.target.value);

  // };
  const handleSkillChange = (event) => {
    const selectedPrimarySkills = event.target.value; // Get the selected primary skills from the event
    const filteredUsers = userList1.filter(user => { // Filter the users list based on the selected skills
      return user.tools.some(tool => selectedPrimarySkills.includes(tool.primarySkill));
    });
    setUserList2(filteredUsers); // Set the filtered users list to state
    setSelectedSkills(selectedPrimarySkills); // Set the selected skills to state
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredData = userList?.filter(item =>
    item?.panel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchQueryChange = event => {
    setSearchQuery(event.target.value);
  };

  const navigate = useNavigate();
  const handleSubmit = () => {

  }

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (res.data.user.permissions[0].admin_permissions.list_XI === false) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);

  React.useEffect(() => {
    const initial = async () => {
      let token = await getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      let response = await ListXIPanels();
      if (response && response.status === 200) {
        setUserList(response.data.panels);
      }
    };
    initial();
  }, []);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= userList.length; i++) {
      document.getElementById("AdminUserCrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("AdminUserCrd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  return (
    <div className="bg-white" >

      <div style={{ padding: '100px 10px 0px 19px' }}>
        <div style={{ borderRadius: '14px 14px 0px 0px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)' }}>
          <Card className="w-full h-full border border-gray-300 rounded-tl-3xl rounded-tr-3xl shadow-md" style={{ borderRadius: '14px 14px 0px 0px' }}>
            <CardContent className="flex justify-between">
              <Box>
                <Typography className="text-black-500 font-semibold text-sm">
                  Hey Admin - <span className="text-gray-400 text-xs">Here's what's happening today!</span>
                </Typography>
              </Box>
              <Box className="flex justify-start items-center">
                <IconButton onClick={handleOpen}>
                  <img src={plus} alt="plus" className="h-3 w-3" />
                </IconButton>
                <Typography onClick={handleOpen} sx={{ fontSize: '14px', color: '#228276', fontWeight: 500, cursor: 'pointer' }}>
                  Create a panel
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <h6 style={{
                    color: '#888888',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '12px',
                  }}>Create Panel</h6>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <IconButton onClick={handleClose}>
                    <img src={CloseIcon} alt="right arrow" height='15px' width='15px' />
                    <Typography sx={{
                      color: 'red',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '12px',
                    }}>
                      Close
                    </Typography>
                  </IconButton>
                </div>
              </div>
              <div style={{ padding: '10px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0px 5px 0px' }}>
                  <div style={{ display: 'flex', marginTop: '5px', marginBottom: '10px' }}>
                    <Typography sx={{
                      color: '#333333', fontFamily: 'SF Pro Display',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      border: 'none',
                      fontSize: '14px',
                      lineHeight: '12px'
                    }}>Panel Name</Typography>
                  </div>

                </div>
                <div>
                  <TextField
                    id="panel-name"
                    variant="outlined"
                    size="sx-small"
                    style={{ width: 320, height: '2px', marginBottom: '10px', borderRadius: '10px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormControl variant="outlined" style={{ marginTop: '50px', width: "250px" }}>
                    <InputLabel id="select-skills-label" shrink>Select Skills</InputLabel>
                    <Select
                      labelId="select-skills-label"
                      id="select-skills"
                      multiple
                      value={selectedSkills}
                      onChange={handleSkillChange}
                      label="Select Skills"
                      style={{ borderRadius: "10px", width: 320, height: 40 }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null,
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 200,
                            borderRadius: 10
                          }
                        }
                      }}
                    >
                      {primarySkills.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0px 5px 0px' }}>
                  <div>
                    <Typography sx={{
                      color: '#333333', fontFamily: 'SF Pro Display',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      border: 'none',
                      fontSize: '14px',
                      lineHeight: '12px'
                    }}>Add XI</Typography>
                  </div>
                  <div>
                    <Typography sx={{
                      color: '#333333', fontFamily: 'SF Pro Display',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '12px'
                    }}>Optional</Typography>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E3E3E3', borderRadius: '10px' }}>
                  <Select
                    id="xi-select"
                    value={value}
                    onChange={handleChange}
                    style={{
                      marginRight: '10px',
                      width: '100%',
                      fontSize: '14px',
                      border: 'none', // remove default input border
                      paddingLeft: '10px', // add left padding to compensate for removed border
                    }}
                  >
                    {userList2?.map((item) => (
                      <MenuItem key={item.firstName} value={item.firstName}>{item.firstName}</MenuItem>

                    ))}
                  </Select>
                  <div style={{ borderLeft: '1px solid #E3E3E3', height: '24px', margin: '0 10px' }}></div>
                  <IconButton aria-label="add" onClick={handleAdd}>
                    <img src={Plus} alt="right arrow" height='15px' width='15px' />
                  </IconButton>
                </div>

                <div>
                  {values?.map((value, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ marginRight: '200px' }}>{value}</Typography>
                      <IconButton aria-label="delete" onClick={() => handleDelete(index)}>
                        <img src={CloseIcon} alt="right arrow" height='15px' width='15px' />
                      </IconButton>
                    </div>
                  ))}
                </div>


                <div style={{
                  display: 'flex', justifyContent: 'flex-end', mt: 2, position: 'absolute',
                  right: 10,
                  bottom: 60,
                }}>
                  <Button variant="outlined" onClick={handleClose} color="error" sx={{ mr: 1 }}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateXI}
                    sx={{
                      marginRight: '10px',
                      color: 'black',
                      bgcolor: '#228276',
                      '&:hover': {
                        bgcolor: '#156b62', // set hover background color
                      }
                    }}
                  >
                    Create
                  </Button>

                </div>
              </div>

            </Box>
          </Modal>
        </div>
        <Grid container >
          <Grid item className="bg-white p-4 border-r border-gray-300 rounded-bl-lg" xs={6} sx={{ borderRadius: '10px' }}>
            <div className="mb-1">
              <TextField fullWidth size="small" placeholder="Search Panel"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <img src={SearchI} alt="search" className="h-3 w-4" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment>
                      <img src={filter} alt="search" className="h-3 w-4" />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div>
              {filteredData?.map((item, index) => (
                <Card
                  key={index}
                  className="border border-gray-300 mt-8 rounded-md"
                  style={{
                    borderRadius: "10px",
                    cursor: 'pointer',
                    backgroundColor:
                      selectedCardIndex === index ? "#228276" : "transparent",
                  }}
                  onClick={() => handleCardClick(index, item)}
                >
                  <CardContent className="flex justify-between items-center" >
                    <div>
                      <Typography className="font-medium-500 text-sm">
                        {item.panel}
                      </Typography>
                      <Typography className="text-gray-400 text-xs">
                        This panel contains {item?.panel} experts
                      </Typography>
                    </div>
                    <AvatarGroup key={index} max={2} className="w-12 h-8">
                      {/* {showAvatar === index ? (
                        <img src={rightArrow} alt="right arrow" className="h-3" />
                      ) : (
                        <ProfileAvatar data={item} />
                      )} */}
                      {item?.users?.map((item, index) => (
                        <ProfileAvatar key={index} data={item?.xiId} />
                      ))}
                    </AvatarGroup>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Grid>

          <Grid item className="bg-white" xs={6}>
            {cardValue ? (
              <XIPanelView data={cardValue} xiUsers={userList1} />
            ) : (
              ""
            )}
          </Grid>

        </Grid>

      </div>
    </div >
  );
};

export default XIPanels;
