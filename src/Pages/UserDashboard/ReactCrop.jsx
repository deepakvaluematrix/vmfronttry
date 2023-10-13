import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { updateProfileImage, getProfileImage } from "../../service/api";
import { getCroppedImg, getRotatedImage } from "./canvasUtils.js";
import { ReactSession } from "react-client-session";
import { url } from "../../service/api";
import axios from "axios";
import { BlockList } from "net";
import swal from "sweetalert";
import Loader from "../../assets/images/loader.gif";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const ReactCropper = (props) => {
  const [imageSrc, setImageSrc] = React.useState(props.upImg);
  const [crop, setCrop] = useState({ x: 0, y: 1 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = React.useState(false);

  let user1 = ReactSession.get("user");
  const [user, setUser] = React.useState(user1);
  const btnRef = React.useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    let filenameExt = e.target.files[0].name.split('.').pop();
    filenameExt = filenameExt?.toLowerCase()
    if(filenameExt === 'png' || filenameExt === 'jpg' || filenameExt === 'jpeg'){

      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        let imageDataUrl = await readFile(file);
  
        setImageSrc(imageDataUrl);
      }
    }
    else{
      swal({
        icon: "error",
        title: "Please enter a valid Logo",
        button: "Ok",
      }).then(()=>{
        window.location.reload()
      });
    }

  };

  const showCroppedImage = useCallback(async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      let userS = getStorage("user");
      let user = JSON.parse(userS);
      let access_token1 = getStorage("access_token");
      await setCroppedImage(croppedImage);

      const formData = new FormData();
      let blob = await fetch(croppedImage).then(r => r.blob());
      blob.originalname = user._id + "-profile";
      formData.append("user_id", user._id);
      formData.append("file", blob);

      let res = await updateProfileImage(formData, props.user, access_token1);
      if (res.status === 200 && res.data.Success === true) {
        setLoading(false)
        let image = await getProfileImage(
          { id: user._id },
          access_token1
        );
        user.profileImg = user._id + "-profile";
        await ls.set("user", JSON.stringify(user));
        await ls.set("profileImg", JSON.stringify(image.data.Image));


        window.location.reload();
      }
      else {
        setLoading(false)
        if (res.status === 200 && res.data.Message !== undefined) {
          swal({
            icon: "error",
            title: "Oops",
            text: res.data.Message,
            button: "Continue",
          });
        } else {

          swal({
            icon: "error",
            title: "Oops",
            text: "Something Went Wrong",
            button: "Continue",
          });

        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <div>
      {imageSrc ? (
        <div className="block">
          <div className="block">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
              style={{
                containerStyle: { height: "40vh", backgroundColor: "black" },
                cropAreaStyle: { width: "100px" },
              }}
              objectFit="auto-cover"
              zoomWithScroll={true}
            />
          </div>
        </div>
      ) : (
        <label>
          <p className="hover:bg-blue-700 text-white font-bold py-2.5 px-8 mx-3 md:mx-4 text-xs rounded"
            style={{ backgroundColor: "#228276" }}>
            Upload
          </p>         
          <input
            type="file"
            onChange={onFileChange}
            accept="image/png , image/jpeg, image/jpg , image/JPG , image/JPEG"
            className="hidden"
          />
        </label>
      )}
      <div
        className={`flex justify-content-end  ${imageSrc ? "mt-[43vh]" : "mt-3"
          }`}
      >
        {props.Modal.current && imageSrc &&  (
          <button
          className=" border-[0.5px] border-red-400 text-red-400 rounded-sm px-4 py-1 cursor-pointer w-fit ml-auto"
          onClick={() => {
            setLoading(false);
            setCroppedImage(null);
            setImageSrc(null);
            props.Modal.current.click();
          }}
        >
          Cancel
        </button>
        )}
        {imageSrc && (
          <button
            onClick={() => showCroppedImage()}
            className="rounded-sm text-white px-4 py-1 cursor-pointer w-fit ml-3"
            style={{ backgroundColor: "#034488" }}
          >
            {loading ? (
              <img src={Loader} className="h-7" alt="loader" />
            ) : (
              "Upload"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default ReactCropper;