import React, { useState } from "react";
import { getProfileImage } from "../../service/api";
import Avatar from "@mui/material/Avatar";
import Avatarr from '../../assets/images/UserAvatar.png'
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const ProfileAvatar = ({data}) => {
  console.log(data, 'printing data')
    const [profilePic, setProfilePic] = useState("");
    React.useEffect(() => {
        const initial = async () => {
          let user = JSON.parse(await getStorage("user"));
          if (data) {
            let image = await getProfileImage({ id: data }, user.access_token);
            await ls.set("profileImg", JSON.stringify(image));
            let base64string = btoa(
              String.fromCharCode(...new Uint8Array(image.data.Image.data))
            );
            let src = `data:image/png;base64,${base64string}`;
            await setProfilePic(src);
          }
        };
        initial();
      }, [data]);

  return (
    <Avatar
    src={
        data && profilePic
          ? profilePic
          : Avatarr
      }
      alt={profilePic}
    />
  );
};

export default ProfileAvatar;
