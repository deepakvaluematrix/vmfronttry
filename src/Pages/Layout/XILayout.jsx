import React,{useEffect} from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Components
import { XIDashboardRoutes } from "../../routes";
import Navbar from "../../Components/XIDashboard/Navbar";
import Sidebar from "../../Components/XIDashboard/Sidebar.jsx";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
} from "../../service/api";
import jsCookie from "js-cookie";
import JobDetails from "../XIDashboard/JobDetails.jsx";
import PrintAbleUi from "../UserDashboard/PrintAbleUi.jsx";
import DetailForm from "../../Components/Dashbaord/DetailsForm.jsx";
import InterviewsDetails from "../../Pages/UserDashboard/InterviewDetails.jsx";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";

const XIDashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  let [user, setUser] = React.useState(null);
  const [detailForm, setDetailForm] = React.useState(false);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);



  
  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");

      // If Token is passed in the url
      if (term !== null && term !== undefined && term !== "null") {
        await ls.remove("access_token");
        access_token1 = term;
        await setAccessToken(term);
        await ls.set("access_token", term);

        await setAccessToken(access_token1);

        let user_id = await getUserIdFromToken({ access_token: access_token1 });
        let a = await getStorage("access_token");
        if (a === "null") {
          let u = JSON.parse(await getStorage("user"));
          await ls.set("access_token", u._id);
        }
        if (user_id) {
          let user = await getUserFromId(
            { id: user_id.data.user.user },
            access_token1
          );

          await setUser(user.data.user.user);
        
          if (user.invite) {
            window.location.href = "/setProfile" + user.resetPassId;
          }
          if (user.profileImg) {
            let image = await getProfileImage(
              { id: user_id.data.user.user },
              access_token1
            );
            setProfileImg(image.data.Image);
            await ls.set(
              "profileImg",
              JSON.stringify(image.data.Image)
            );
          }
          //console.log(user.data.user);
          if (
            user.data.user.access_valid === false ||
            user.data.user.user_type !== "XI" && user.data.user.user_type !== "SuperXI"
          )
            window.location.href = "/login";
          await ls.set("user", JSON.stringify(user.data.user));
          // window.history.pushState({ url: "/XI" }, "", "/XI");
          window.location.href = "/XI";
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = await getStorage("access_token");
        await setAccessToken(access_token);
        let user = JSON.parse(getStorage("user"));
        await setUser(user);

        if (user.access_valid === false || user.user_type !== "XI" && user.user_type !== "SuperXI") {
          window.location.href = "/login";
        }
      }
      let user = JSON.parse(getStorage("user"));
      let token = getStorage("access_token");
      if (user && !user.profileImg || user.tools.length === 0 || !user.linkedinurl) {
        setDetailForm(true);
      }else{
        setDetailForm(false);
  
      }
      if (!user || !token) {
        window.location.href = "/login";
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        // window.history.pushState({ path: "/XI" }, "", "/XI");
        window.location.href = "/XI";
      }
    };
    func();
  }, [access_token]);
  React.useEffect(() => {
   
    if (!component || component === "/undefined") {
      setComponent(
        XIDashboardRoutes.filter((route) => route.path === "/")[0].component
      );
    } else {
      let c = XIDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        //console.log(c1);
        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        else if (c1[1] === "evaluationreport") setComponent(<PrintAbleUi id={id} />);
        else if (c1[1] === "interviewDetails") setComponent(<InterviewsDetails id={id} />);
        else {
          let c = XIDashboardRoutes.filter(
            (route) => route.path === component.split("XI/")[1]
          );
          if (c.length >= 1 && c[0] && c[0] !== undefined) setComponent(c[0].component);
          else
            setComponent(
              XIDashboardRoutes.filter((route) => route.path === "/XI")[0]
                .component
            );
        }
      }
    }
  }, [component]);

  return (
    <div className="max-w-screen h-screen bg-slate-50">
      <div className="w-full bg-slate-50  fixed navbar">
        {" "}
        <Navbar user={user} />
      </div>
      {
        detailForm && (component !== '/editProfile' && component !== '/profile') && (
          <DetailForm isOpen={true} setModalIsOpen={setDetailForm} user={user} />
        )
      }
     
      <div className="flex w-full bg-slate-50">
        <Sidebar className="sidebarComponent"></Sidebar>
        <div className="justify-end ml-auto panel">{comp}</div>
      </div>
      {user?.acceptTC == false ? (
        <TermsAndConditions />
      ) : (
        <></>
      )}
    </div>
  );
};

export default XIDashboard;
