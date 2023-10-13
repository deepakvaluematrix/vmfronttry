import React, { useState, useEffect } from "react";
import Avatarr from '../../assets/images/UserAvatar.png'
import close from '../../assets/images/close.png'
import down from '../../assets/images/down.svg'
import edit from '../../assets/images/edit.svg'
import delete1 from '../../assets/images/delet.png'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { deleteSkillFromPanel, getUserFromId } from "../../service/api";
import { Typography, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { deleteXidFromPanel, updateXIPanels, updateSkillPanel } from "../../service/api";
import swal from "sweetalert";
import { getXIUserList } from "../../service/api";
import { UserList } from "twilio/lib/rest/conversations/v1/user";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";


const XIPanelView = ({ data, xiUsers }) => {
    const [item, setItem] = React.useState(data);
    const [userData, setUserData] = React.useState(xiUsers);
    const [checked, setChecked] = React.useState([]);
    const [selectAllChecked, setSelectAllChecked] = React.useState(false);
    const [addxi, setAddxi] = React.useState(false);
    const [alignment, setAlignment] = React.useState('xi');
    const [addskill, setAddskill] = React.useState(false);

    useEffect(() => {
        setItem(data);
        setUserData(xiUsers);
    }, [data, xiUsers]);

    const handleChange = (e) => {

        setAlignment(e.target.value);

    };

    const handleSelectAllToggle = () => {
        setSelectAllChecked(!selectAllChecked);
        setChecked(selectAllChecked ? [] : [0, 1, 2, 3]);
    };

    const handleToggle = (labelId, xiId, xidata) => () => {
        const currentIndex = checked.indexOf(labelId);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(labelId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        // setSelectAllChecked(newChecked.length === 4);

        // pass required data arg to handleSaveXI

        handleSaveXI(data._id, xiId,xidata)
    };

    const handleSkillToggle = (labelId, dataId, xiId) => () => {
        const currentIndex = checked.indexOf(labelId);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(labelId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        // setSelectAllChecked(newChecked.length === 4);

        // pass required data arg to handleSaveXI

        handleSaveSkill(data._id, xiId)
    };

    const handleAddXI = () => {
        setAddxi(true);
    };

    const handleSaveXI = async (dataId, xiId, xidata) => {
        let res = await updateXIPanels({ _id: dataId, xiIds: xiId });
        if (res.status === 200) {
            // Remove selected XI user from userData
            const updatedUserData = userData.filter(user => user._id !== xiId);
            setUserData(updatedUserData);

            // Add selected XI user to item.users
            const updatedItem = { ...item };
            // console.log(updatedItem, 'printing updated data and', xidata, 'xiId')
            updatedItem.users.push({ _id: xidata._id, firstName: xidata.firstName });
            setItem(updatedItem);
            swal({
                icon: "success",
                title: "Add XI",
                text: " Added Succesfully",
                button: "Continue",
            }).then(() => {
                setAddxi(false);
            })

        }
        setAddxi(false);
    };

    const handleSaveSkill = async (dataId, xiId) => {
        // console.log(dataId, 'dataId', xiId, 'xiId in handleSaveeeee');
        let token = await getStorage("access_token");
        let res = await updateSkillPanel({ _id: dataId, xiIds: xiId }, token);
        // console.log('res from backend : ', res ? res : 'no res')
        if (res.status === 200) {
            // const updatedUserData = userData.filter(item => console.log(item, 'item in updateUserData'));
            
            // setUserData(updatedUserData);
            // setUserData(userData => userData.filter(item => item._id !== xiId));
            const updatedItem = { ...item };
            // console.log(updatedItem, 'printing updated data and', xidata, 'xiId')
            updatedItem.skills.push(xiId);
            swal({
                icon: "success",
                title: "Add Skill",
                text: " Skill Added Succesfully",
                button: "Continue",
            }).then(() => {
                // setAddxi(false);
            })

        }
        setAddxi(false);
    }

    const handleCancelXI = () => {
        setAddxi(false);
    };



    const handleDeleteXI = async (panelId, xiId) => {
        // console.log('hai delete XI', panelId, ':panelId', xiId, 'xiId');
        try {
            const res = await deleteXidFromPanel({ panelId, xid: xiId });
            if (res.status === 200) {
                swal({
                    icon: "success",
                    title: "Delete XI",
                    text: " XI Deleted Succesfully",
                    button: "Continue",
                }).then(() => {
                    // console.log('a');
                    // update the list (item)
                    const updatedList = item?.users?.filter(user => user.xiId !== xiId);
                    setItem(prevState => ({ ...prevState, users: updatedList }));
                });
            }
        } catch (error) {
            // console.log(error);
        }
    };

    // To delete Skill from existing xiSkills
    const handleDeleteSkill = async (panelId, item) => {
        // console.log('hai delete Skill')
        try {
            const res = await deleteSkillFromPanel({ panelId, skills: item });
            if (res.status === 200) {
                setItem(prevState => {
                    const updatedSkills = prevState.skills.filter(s => s !== item);
                    return { ...prevState, skills: updatedSkills };
                });
                swal({
                    icon: "success",
                    title: "Delete Skill",
                    text: " Skill deleted Succesfully",
                    button: "Continue",
                }).then(() => {
                    // console.log('a');
                });
            }
        } catch (error) {
            // console.log('Error deleting user from panel:', error);
        }

    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={close} alt="right arrow" className="h-3" />
                    <h6 style={{ fontSize: '14px', fontWeight: 600 }}>{data.panel} Panel</h6>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={down} alt="right arrow" className="h-3" />
                    <img src={edit} alt="right arrow" className="h-3" />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={(e) => { handleChange(e) }}
                        aria-label="Platform"
                    >
                        <ToggleButton value="xi">XI</ToggleButton>
                        <ToggleButton value="skill">Skill</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            {alignment === 'xi' ?
                (
                    <>
                        {addxi === false ? (
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectAllChecked}
                                            tabIndex={-1}
                                            onChange={handleSelectAllToggle}
                                            disableRipple
                                            sx={{ display: 'none' }}
                                        />
                                    </ListItemIcon>
                                    <Typography
                                        sx={{
                                            width: "100%",
                                            maxWidth: "300px",
                                            mt: "10px",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "5px",
                                            p: "5px",
                                            fontSize: "13",
                                        }}
                                    >
                                        XI names
                                    </Typography>
                                    <div onClick={handleAddXI} >
                                        <Button
                                            sx={{
                                                paddingLeft: "40px",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                color: "#228276",
                                            }}
                                        >
                                            Add XI
                                        </Button>
                                    </div>

                                </ListItem>
                                {item?.users?.map((item, index) => {
                                    const labelId = `checkbox-list-label-${index}`;
                                    return (
                                        <ListItem key={labelId}>
                                            <ListItemButton role={undefined} onClick={handleToggle(labelId)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.indexOf(labelId) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                        sx={{ display: 'none' }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={item?.firstName} />
                                                {/* {console.log(item, 'items in xi view')} */}
                                                <div onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteXI(data._id, item.xiId);
                                                }}>
                                                    <img src={delete1} alt={delete1} />
                                                </div>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>

                        ) :
                            (
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectAllChecked}
                                                tabIndex={-1}
                                                onChange={handleSelectAllToggle}
                                                disableRipple
                                                sx={{ display: 'none' }}
                                            />
                                        </ListItemIcon>
                                        <Typography
                                            sx={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                mt: "10px",
                                                backgroundColor: "#F3F3F3",
                                                borderRadius: "5px",
                                                p: "5px",
                                                fontSize: "13",
                                            }}
                                        >
                                            XI names
                                        </Typography>
                                        <div >
                                            <Button onClick={handleSaveXI}
                                                sx={{
                                                    paddingLeft: "40px",
                                                    fontSize: "13px",
                                                    fontWeight: 700,
                                                    color: "#228276",
                                                }}
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={handleCancelXI}
                                                sx={{
                                                    paddingLeft: "40px",
                                                    fontSize: "13px",
                                                    fontWeight: 700,
                                                    color: "#228276",
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>

                                    </ListItem>
                                    {/* {console.log(data, 'printing data in XI panelviews')} */}
                                    {userData?.filter((item) => {
                                        // Check if the _id of the current item exists in the xiId values of data.users
                                        return !data?.users?.some((user) => user.xiId === item._id);
                                    }).map((item, index) => {
                                        const labelId = `checkbox-list-label-${index}`;
                                        return (
                                            <ListItem key={labelId}>
                                                <ListItemButton role={undefined} onClick={handleToggle(labelId, item._id,item)} dense>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={checked.indexOf(labelId) !== -1}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText id={labelId} primary={item?.firstName} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}

                                </List>
                            )}

                    </>
                )
                :

                (
                    <>
                        {addxi === false ? (
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectAllChecked}
                                            tabIndex={-1}
                                            onChange={handleSelectAllToggle}
                                            disableRipple
                                            sx={{ display: 'none' }}
                                        />
                                    </ListItemIcon>
                                    <Typography
                                        sx={{
                                            width: "100%",
                                            maxWidth: "300px",
                                            mt: "10px",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "5px",
                                            p: "5px",
                                            fontSize: "13",
                                        }}
                                    >
                                        Skill names
                                    </Typography>
                                    <div onClick={handleAddXI} >
                                        <Button
                                            sx={{
                                                paddingLeft: "40px",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                color: "#228276",
                                            }}
                                        >
                                            Add Skill
                                        </Button>
                                    </div>

                                </ListItem>
                                {item?.skills?.map((item, index) => {
                                    const labelId = `checkbox-list-label-${index}`;
                                    return (
                                        <ListItem key={labelId}>
                                            <ListItemButton role={undefined} onClick={handleToggle(labelId)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.indexOf(labelId) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                        sx={{ display: 'none' }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={item ? item : ''} />
                                                {/* {console.log(item, 'items in xi view')} */}
                                                <div onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSkill(data._id, item);
                                                }}>
                                                    <img src={delete1} alt={delete1} />
                                                </div>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>

                        ) :
                            (
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectAllChecked}
                                                tabIndex={-1}
                                                onChange={handleSelectAllToggle}
                                                disableRipple
                                                sx={{ display: 'none' }}
                                            />
                                        </ListItemIcon>
                                        <Typography
                                            sx={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                mt: "10px",
                                                backgroundColor: "#F3F3F3",
                                                borderRadius: "5px",
                                                p: "5px",
                                                fontSize: "13",
                                            }}
                                        >
                                            XI names
                                        </Typography>
                                        <div >
                                            <Button onClick={handleSaveXI}
                                                sx={{
                                                    paddingLeft: "40px",
                                                    fontSize: "13px",
                                                    fontWeight: 700,
                                                    color: "#228276",
                                                }}
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={handleCancelXI}
                                                sx={{
                                                    paddingLeft: "40px",
                                                    fontSize: "13px",
                                                    fontWeight: 700,
                                                    color: "#228276",
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>

                                    </ListItem>

                                    {userData?.filter((item) => {
                                        // Check if the _id of the current item exists in the xiId values of data.users
                                        return data?.users?.some((user) => user.xiId === item._id);
                                    }).flatMap((item, index) => {
                                        const tools = item.tools;
                                        const uniqueTools = tools.filter((v, i, a) => a.findIndex(t => (t.primarySkill === v.primarySkill)) === i);
                                        return uniqueTools.map((tool, toolIndex) => {
                                            const labelId = `checkbox-list-label-${index}-${toolIndex}`;
                                            return (
                                                <ListItem key={labelId}>
                                                    <ListItemButton role={undefined} onClick={handleSkillToggle(labelId, data._id, tool.primarySkill)} dense>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={checked.indexOf(labelId) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            id={labelId}
                                                            primary={tool ? tool.primarySkill : ''}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        });
                                    })}




                                </List>
                            )}

                    </>
                )

            }


        </div>
    );
}

export default XIPanelView;
