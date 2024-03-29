import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Handle logout logic here, such as clearing localStorage and navigating to the login page
    localStorage.removeItem("token");
    navigateTo("/");
  };

  return (
    <div className="fixed top-0 bg-blue-primary h-screen w-2 text-white font-helvetica">
      <div className="flex items-center justify-center p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M20.8795 0H1.1219C0.502293 0 0 0.502293 0 1.1219V10.5297C0 11.1493 0.502293 11.6516 1.1219 11.6516H5.17558V20.8795C5.17522 21.1769 5.29311 21.4623 5.50329 21.6727C5.71347 21.8831 5.99869 22.0014 6.29611 22.0014H15.7039C16.3235 22.0014 16.8258 21.4991 16.8258 20.8795V11.6557H20.8795C21.1769 11.6557 21.4621 11.5375 21.6723 11.327C21.8825 11.1166 22.0004 10.8312 22 10.5338V1.1219C22.0004 0.824482 21.8825 0.539118 21.6723 0.328681C21.4621 0.118244 21.1769 0 20.8795 0ZM1.30042 1.30179H10.3498V10.3512H1.30042V1.30179ZM15.5254 20.701H6.476V11.6557H15.5254V20.701ZM20.6996 10.3512H11.6502V1.30179H20.6996V10.3512Z"
            fill="white"
          />
          <path
            d="M7.44825 7.32455C7.70451 7.56505 8.10542 7.55869 8.35392 7.31018C8.60243 7.06167 8.60879 6.66077 8.36829 6.40451L6.29064 4.32686C6.03588 4.07448 5.62536 4.07448 5.3706 4.32686L3.28746 6.40451C3.1143 6.56701 3.04339 6.81092 3.10242 7.04093C3.16145 7.27094 3.34106 7.45055 3.57108 7.50959C3.80109 7.56862 4.045 7.4977 4.2075 7.32455L5.82513 5.70692L7.44825 7.32455Z"
            fill="white"
          />
          <path
            d="M14.5573 7.32455L16.1749 5.70692L17.7926 7.32455C18.0488 7.56505 18.4497 7.55869 18.6982 7.31018C18.9468 7.06167 18.9531 6.66077 18.7126 6.40451L16.635 4.32686C16.3802 4.07448 15.9697 4.07448 15.7149 4.32686L13.6373 6.40451C13.3968 6.66077 13.4031 7.06167 13.6516 7.31018C13.9001 7.55869 14.3011 7.56505 14.5573 7.32455Z"
            fill="white"
          />
          <path
            d="M9.38158 14.6767C9.12496 14.4366 8.72405 14.4435 8.47591 14.6924C8.22776 14.9413 8.22201 15.3422 8.46291 15.5981L10.5406 17.6744C10.6624 17.7966 10.828 17.8654 11.0006 17.8654C11.1732 17.8654 11.3387 17.7966 11.4606 17.6744L13.5382 15.5981C13.7028 15.4338 13.7673 15.1941 13.7072 14.9694C13.6472 14.7446 13.4718 14.569 13.2472 14.5087C13.0226 14.4483 12.7828 14.5123 12.6182 14.6767L11.0006 16.2957L9.38158 14.6767Z"
            fill="white"
          />
        </svg>
        <h2 className="text-xl font-bold ml-4">Dashboard</h2>
      </div>
      <ul className="py-4 w-full px-4">
        <li
          className={`flex items-center px-4 py-2 ${
            location.pathname === "/dashboard"
              ? "bg-red-primary"
              : "hover:bg-gray-700"
          } rounded-lg cursor-pointer transition duration-100`}
          onClick={() => {
            navigateTo("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 ${
              location.pathname === "/dashboard"
                ? "bg-red-primary fill-white-primary"
                : "fill-red-primary bg-white"
            }  rounded-lg p-1`}
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clip-path="url(#clip0_1_660)">
              <path d="M8.08537 3.4676C8.04134 3.42588 7.98275 3.40259 7.92182 3.40259C7.86089 3.40259 7.80231 3.42588 7.75828 3.4676L2.31368 8.62004C2.29056 8.64195 2.27216 8.66828 2.25961 8.69744C2.24705 8.72659 2.2406 8.75797 2.24063 8.78967L2.23975 13.6254C2.23975 13.874 2.33945 14.1125 2.51693 14.2883C2.69441 14.4641 2.93512 14.5629 3.18612 14.5629H6.02819C6.15369 14.5629 6.27404 14.5135 6.36278 14.4256C6.45152 14.3377 6.50138 14.2185 6.50138 14.0942V10.1098C6.50138 10.0476 6.5263 9.98801 6.57067 9.94406C6.61504 9.9001 6.67522 9.87541 6.73797 9.87541H9.1039C9.16665 9.87541 9.22683 9.9001 9.2712 9.94406C9.31557 9.98801 9.34049 10.0476 9.34049 10.1098V14.0942C9.34049 14.2185 9.39035 14.3377 9.47909 14.4256C9.56783 14.5135 9.68818 14.5629 9.81368 14.5629H12.6546C12.9056 14.5629 13.1463 14.4641 13.3238 14.2883C13.5012 14.1125 13.6009 13.874 13.6009 13.6254V8.78967C13.601 8.75797 13.5945 8.72659 13.582 8.69744C13.5694 8.66828 13.551 8.64195 13.5279 8.62004L8.08537 3.4676Z" />
              <path d="M14.8685 7.65375L12.6564 5.55726V2.37592C12.6564 2.2516 12.6065 2.13237 12.5178 2.04446C12.4291 1.95655 12.3087 1.90717 12.1832 1.90717H10.7637C10.6382 1.90717 10.5178 1.95655 10.4291 2.04446C10.3403 2.13237 10.2905 2.2516 10.2905 2.37592V3.31342L8.57754 1.69095C8.41724 1.53041 8.17888 1.43842 7.92129 1.43842C7.66458 1.43842 7.42681 1.53041 7.26652 1.69125L0.9761 7.65316C0.792149 7.82894 0.769081 8.1181 0.936471 8.30853C0.978505 8.3566 1.02997 8.39569 1.08774 8.42343C1.14551 8.45116 1.20837 8.46697 1.2725 8.46987C1.33663 8.47278 1.40069 8.46272 1.46077 8.44033C1.52086 8.41793 1.57571 8.38365 1.622 8.33959L7.75863 2.5306C7.80266 2.48888 7.86124 2.46559 7.92217 2.46559C7.98311 2.46559 8.04169 2.48888 8.08572 2.5306L14.2229 8.33959C14.3133 8.42547 14.4344 8.47234 14.5597 8.46992C14.6849 8.46751 14.8041 8.416 14.891 8.3267C15.0726 8.14037 15.0575 7.83275 14.8685 7.65375Z" />
            </g>
            <defs>
              <clipPath id="clip0_1_660">
                <rect
                  width="15.142"
                  height="15"
                  fill="white"
                  transform="translate(0.349976 0.500061)"
                />
              </clipPath>
            </defs>
          </svg>
          <h4
            className={`ml-4 ${
              location.pathname === "/"
                ? "text-white-primary"
                : "text-blue-secondary"
            }`}
          >
            Home
          </h4>
        </li>
      </ul>
      <div className="py-4 w-full px-4 fixed inset-x-0 bottom-0">
        <div className="flex items-center px-4 py-2 mt-auto">
          {/* <svg
            fill="none"
            viewBox="0 0 50 50"
            data-name="Layer 1"
            className="h-8 fill-red-primary bg-white-primary rounded-lg p-1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title />
            <path d="M24,21A10,10,0,1,1,34,11,10,10,0,0,1,24,21ZM24,5a6,6,0,1,0,6,6A6,6,0,0,0,24,5Z" />
            <path d="M42,47H6a2,2,0,0,1-2-2V39A16,16,0,0,1,20,23h8A16,16,0,0,1,44,39v6A2,2,0,0,1,42,47ZM8,43H40V39A12,12,0,0,0,28,27H20A12,12,0,0,0,8,39Z" />
          </svg> */}
          <button onClick={handleLogout}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 fill-red-primary bg-white-primary rounded-lg p-1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <h4 className="ml-4 flex-shrink-0 w-1/6 overflow-hidden">
            Hi, {userData.name}
          </h4>{" "}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
