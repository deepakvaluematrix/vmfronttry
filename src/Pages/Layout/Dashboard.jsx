import React from "react";
import { useParams } from "react-router-dom";
import OneSignal from "react-onesignal";

// Components

import JobDetails from "../UserDashboard/JobDetail.jsx";
import InterviewDetails from "../UserDashboard/InterviewDetails.jsx";
import CandidateResumeForm from "../../Components/Dashbaord/CandidateForm.jsx";
import { dashboardRoutes } from "../../routes";
import HorizontalNav from "../../Components/Dashbaord/Navbar";
import SidebarComponent from "../../Components/Dashbaord/sidebar";
import DetailForm from "../../Components/Dashbaord/DetailsForm.jsx";
import {
  getProfileImage,
  getUserFromId,
  getUserIdFromToken,
} from "../../service/api";
import { Link } from "react-router-dom";
import "../../assets/stylesheet/layout.scss";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  let [access_token, setAccessToken] = React.useState(null);
  let [user, setUser] = React.useState(null);
  let [profileImg, setProfileImg] = React.useState(null);
  let [userCheck, setUserCheck] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  // Form to get User details
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [detailForm, setDetailForm] = React.useState(false);
  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a",
      safari_web_id: "web.onesignal.auto.2cee7bb2-7604-4e25-b1d2-cbd521c730a5",
      notifyButton: {
        enable: true,
      },
    });
  }, []);

  // Set Access_Token And User to the Session Storage

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
            window.location.href = "/setProfile/" + user.resetPassId;
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
          if (
            user.data.user.access_valid === false ||
            user.data.user.user_type !== "User"
          )
            window.location.href = "/login";
          await ls.set("user", JSON.stringify(user.data.user));
          // window.history.pushState({ url: "/user" }, "", "/user");
          window.location.href = "/user";
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = await getStorage("access_token");
        await setAccessToken(access_token);
        let user = JSON.parse(getStorage("user"));
        if (user.invite) {
          window.location.href = "/setProfile/" + user.resetPassId;
        }
        await setUser(user);

        if (user.access_valid === false || user.user_type !== "User") {
          window.location.href = "/login";
        }
      }
      let user = JSON.parse(getStorage("user"));
      let token = getStorage("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }
      if (!user.profileImg || user.tools.length === 0 || !user.linkedInId) {
        setDetailForm(true);
      } else {
        if (
          user.tools.length > 0 &&
          user.education &&
          user.education.length > 0 &&
          user.association != [] &&
          user.asscoiation &&
          user.association.length > 0 &&
          user.experience != [] &&
          user.experience &&
          user.experience.length > 0
        ) {
          setModalIsOpen(false);
          ls.set("modalOnce", false);
        } else if (
          user.tools.length === 0 ||
          user.education === [] ||
          !user.education ||
          user.education.length === 0 ||
          user.association === [] ||
          !user.asscoiation ||
          user.association.length === 0 ||
          user.experience === [] ||
          !user.experience ||
          user.experience.length === 0
        ) {
          // ls.set("modalOnce" ,true);

          let modalOnce = await getStorage("modalOnce");
          if (modalOnce === "null" || modalOnce === null) {
            setModalIsOpen(true);
          }
        } else {
          setModalIsOpen(false);
          ls.set("modalOnce", false);
        }
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      // if (term) {
      //   // window.history.pushState({ path: "/user" }, "", "/user");
      //   //window.location.href = "/user";
      // }
    };
    func();
  }, [access_token]);

  // Get Component To Render from the URL Parameter
  React.useEffect(() => {
    if (component === null) {
      let c = dashboardRoutes.filter((route) => route.path === "");
      setComponent(c[0].component);
    } else {
      let c = dashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        if (c1[1] === "interviewDetails")
          setComponent(<InterviewDetails id={id} />);
        else {
          let c = dashboardRoutes.filter(
            (route) => route.path === component.split("/")[1]
          );
          if (c[0]) setComponent(c[0].component);
          else
            setComponent(
              dashboardRoutes.filter((route) => route.path === "")[0].component
            );
        }
      }
    }
  }, [component]);

  return (
    <div className="max-w-screen bg-slate-50 h-screen">
      {modalIsOpen && component !== "/editProfile" && (
        <div>
          <CandidateResumeForm isOpen={true} setModalIsOpen={setModalIsOpen} />
        </div>
      )}
      <div
        className="w-full grid-flow-row fixed navbar"
        style={{ background: "#FAFAFA" }}
      >
        {" "}
        <HorizontalNav user={user} />
      </div>
      <div className="flex grid-flow-row w-full">
        <SidebarComponent className="sidebarComponent"></SidebarComponent>
        <div className="justify-end ml-auto panel">{comp}</div>
      </div>
      {user?.acceptTC === false ? (
        <TermsAndConditions />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
