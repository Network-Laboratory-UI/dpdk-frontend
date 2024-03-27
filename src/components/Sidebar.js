import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hidden, setHidden] = useState(true);

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
    <div
      className="sticky top-0 bg-blue-primary h-screen text-white flex flex-col font-helvetica"
      onMouseEnter={() =>
        setTimeout(() => {
          setHidden(false);
        }, 20)
      }
      onMouseLeave={() => setHidden(true)}
    >
      <div className="h-[10%] flex items-center justify-center p-4">
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
        <div className={`${hidden ? "hidden" : "block"}`}>
          <h2 className="transition ease-in-out duration-200 text-xl font-bold ml-4">
            Dashboard
          </h2>
        </div>
      </div>
      <div className="h-[80%] py-2 w-full px-3">
        <ul className="">
          <li
            className={`flex items-center group-hover:justify-start px-2 py-2 ${
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
            <div
              className={`transition-all duration-150 ${
                hidden ? "hidden" : "block"
              }`}
            >
              <h4 className={"ml-4 text-white-primary"}>Home</h4>
            </div>
          </li>
          <li
            className={`flex items-center group-hover:justify-start px-2 py-2 ${
              location.pathname.startsWith("/dashboard/npb")
                ? "bg-red-primary"
                : "hover:bg-gray-700"
            } rounded-lg cursor-pointer transition duration-100 overflow-hidden`}
            onClick={() => {
              navigateTo("/");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 ${
                location.pathname.startsWith("/dashboard/npb")
                  ? "bg-red-primary fill-white-primary"
                  : "fill-red-primary bg-white"
              }  rounded-lg p-1`}
              viewBox="0 0 26 26"
              fill="none"
            >
              <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM9.70376 18H16.2963C15.625 20.2925 14.5 22.3587 13 23.9862C11.5 22.3587 10.375 20.2925 9.70376 18ZM9.25001 16C8.91834 14.0138 8.91834 11.9862 9.25001 10H16.75C17.0817 11.9862 17.0817 14.0138 16.75 16H9.25001ZM2.00001 13C1.99914 11.9855 2.13923 10.9759 2.41626 10H7.22376C6.92542 11.9889 6.92542 14.0111 7.22376 16H2.41626C2.13923 15.0241 1.99914 14.0145 2.00001 13ZM16.2963 8H9.70376C10.375 5.7075 11.5 3.64125 13 2.01375C14.5 3.64125 15.625 5.7075 16.2963 8ZM18.7763 10H23.5838C24.1388 11.9615 24.1388 14.0385 23.5838 16H18.7763C19.0746 14.0111 19.0746 11.9889 18.7763 10ZM22.7963 8H18.3675C17.8572 5.99189 17.0001 4.0883 15.835 2.375C17.3236 2.77503 18.7119 3.48215 19.9108 4.45091C21.1097 5.41967 22.0926 6.62861 22.7963 8ZM10.165 2.375C8.99987 4.0883 8.14284 5.99189 7.63251 8H3.20376C3.90741 6.62861 4.89029 5.41967 6.08918 4.45091C7.28808 3.48215 8.67644 2.77503 10.165 2.375ZM3.20376 18H7.63251C8.14284 20.0081 8.99987 21.9117 10.165 23.625C8.67644 23.225 7.28808 22.5178 6.08918 21.5491C4.89029 20.5803 3.90741 19.3714 3.20376 18ZM15.835 23.625C17.0001 21.9117 17.8572 20.0081 18.3675 18H22.7963C22.0926 19.3714 21.1097 20.5803 19.9108 21.5491C18.7119 22.5178 17.3236 23.225 15.835 23.625Z" />
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
            <div
              className={`transition-all duration-150 ${
                hidden ? "hidden" : "block"
              }`}
            >
              <h4 className={"ml-4 text-white-primary"}>NPB</h4>
            </div>
          </li>
          <li
            className={`flex items-center group-hover:justify-start px-2 py-2 ${
              location.pathname.startsWith("/dashboard/ps")
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
                location.pathname.startsWith("/dashboard/ps")
                  ? "bg-red-primary fill-white-primary"
                  : "fill-red-primary bg-white"
              }  rounded-lg p-1 justify-center align-middle`}
              viewBox="0 0 27 27"
              fill="none"
            >
              <path d="M6.76902 13.0874C6.77617 15.7105 6.17005 18.2989 4.99902 20.6462C4.94312 20.7678 4.86335 20.8771 4.76444 20.9674C4.66553 21.0576 4.5495 21.1271 4.42322 21.1717C4.29694 21.2163 4.163 21.2351 4.02933 21.2269C3.89566 21.2187 3.765 21.1838 3.64508 21.1242C3.52517 21.0646 3.41846 20.9815 3.33127 20.8798C3.24408 20.7782 3.1782 20.66 3.13753 20.5325C3.09686 20.4049 3.08223 20.2704 3.09451 20.137C3.10679 20.0037 3.14573 19.8742 3.20902 19.7562C4.24152 17.6851 4.77572 15.4015 4.76902 13.0874C4.76667 11.738 5.06895 10.4054 5.65332 9.18902C6.23769 7.97267 7.08908 6.9039 8.14402 6.0624C8.35105 5.89664 8.61546 5.81991 8.87906 5.8491C9.14267 5.87829 9.38388 6.01099 9.54964 6.21803C9.7154 6.42506 9.79213 6.68946 9.76295 6.95307C9.73376 7.21668 9.60105 7.45789 9.39402 7.62365C8.57332 8.27795 7.911 9.10916 7.45647 10.0552C7.00194 11.0013 6.76694 12.0378 6.76902 13.0874ZM13.769 12.0874C13.5038 12.0874 13.2494 12.1928 13.0619 12.3803C12.8744 12.5678 12.769 12.8222 12.769 13.0874C12.7688 16.9834 11.7796 20.8156 9.89402 24.2249C9.76539 24.457 9.73421 24.7306 9.80735 24.9857C9.88049 25.2407 10.052 25.4563 10.284 25.5849C10.5161 25.7135 10.7897 25.7447 11.0448 25.6716C11.2998 25.5984 11.5154 25.427 11.644 25.1949C13.6935 21.4886 14.7687 17.3227 14.769 13.0874C14.769 12.8222 14.6637 12.5678 14.4761 12.3803C14.2886 12.1928 14.0342 12.0874 13.769 12.0874ZM13.769 8.0874C12.4429 8.0874 11.1712 8.61419 10.2335 9.55187C9.2958 10.4896 8.76902 11.7613 8.76902 13.0874C8.76902 13.3526 8.87438 13.607 9.06191 13.7945C9.24945 13.982 9.5038 14.0874 9.76902 14.0874C10.0342 14.0874 10.2886 13.982 10.4761 13.7945C10.6637 13.607 10.769 13.3526 10.769 13.0874C10.769 12.2918 11.0851 11.5287 11.6477 10.9661C12.2103 10.4035 12.9734 10.0874 13.769 10.0874C14.5647 10.0874 15.3277 10.4035 15.8903 10.9661C16.4529 11.5287 16.769 12.2918 16.769 13.0874C16.7794 17.0636 15.9036 20.9921 14.2053 24.5874C14.1492 24.7065 14.1172 24.8355 14.1109 24.9669C14.1047 25.0984 14.1245 25.2298 14.169 25.3537C14.2136 25.4775 14.2821 25.5914 14.3707 25.6888C14.4593 25.7861 14.5662 25.8651 14.6853 25.9212C14.8044 25.9772 14.9333 26.0093 15.0648 26.0155C15.1963 26.0217 15.3277 26.002 15.4516 25.9574C15.5754 25.9128 15.6893 25.8443 15.7866 25.7557C15.884 25.6671 15.963 25.5602 16.019 25.4412C17.8419 21.5786 18.7814 17.3585 18.769 13.0874C18.769 11.7613 18.2422 10.4896 17.3046 9.55187C16.3669 8.61419 15.0951 8.0874 13.769 8.0874ZM13.769 0.0874023C10.3223 0.0910421 7.01783 1.46185 4.58065 3.89903C2.14347 6.33622 0.772658 9.64071 0.769018 13.0874C0.770874 14.3362 0.559503 15.576 0.144018 16.7537C0.0556678 17.0038 0.0703008 17.2788 0.184698 17.5181C0.299095 17.7575 0.503886 17.9416 0.754018 18.0299C1.00415 18.1183 1.27913 18.1036 1.51848 17.9892C1.75782 17.8748 1.94192 17.67 2.03027 17.4199C2.52086 16.0282 2.77069 14.5631 2.76902 13.0874C2.76902 10.17 3.92794 7.37213 5.99084 5.30923C8.05374 3.24633 10.8516 2.0874 13.769 2.0874C16.6864 2.0874 19.4843 3.24633 21.5472 5.30923C23.6101 7.37213 24.769 10.17 24.769 13.0874C24.7695 15.3722 24.5481 17.6517 24.1078 19.8937C24.0823 20.0225 24.0825 20.1551 24.1083 20.2839C24.1341 20.4127 24.185 20.5352 24.2581 20.6443C24.3312 20.7534 24.4251 20.847 24.5345 20.9199C24.6438 20.9927 24.7664 21.0432 24.8953 21.0687C24.9591 21.081 25.024 21.0873 25.089 21.0874C25.3204 21.0872 25.5446 21.0067 25.7233 20.8596C25.902 20.7126 26.0242 20.5082 26.069 20.2812C26.5347 17.9116 26.7691 15.5023 26.769 13.0874C26.765 9.64081 25.3941 6.33651 22.957 3.8994C20.5199 1.46229 17.2156 0.0913723 13.769 0.0874023ZM9.56902 16.1087C9.30967 16.0571 9.04044 16.1103 8.82023 16.2567C8.60003 16.4031 8.44678 16.6308 8.39402 16.8899C7.98826 18.887 7.26177 20.8051 6.24277 22.5699C6.11016 22.7996 6.07425 23.0727 6.14293 23.3289C6.21162 23.5851 6.37927 23.8035 6.60902 23.9362C6.83876 24.0688 7.11177 24.1047 7.368 24.036C7.62422 23.9673 7.84266 23.7996 7.97527 23.5699C9.10138 21.6184 9.90347 19.4971 10.3503 17.2887C10.3765 17.1599 10.3772 17.0272 10.3521 16.8981C10.3271 16.7691 10.2768 16.6463 10.2043 16.5367C10.1317 16.4271 10.0383 16.3329 9.92925 16.2594C9.82025 16.186 9.69784 16.1348 9.56902 16.1087ZM13.769 4.0874C13.3929 4.08748 13.0172 4.11086 12.644 4.1574C12.3858 4.19617 12.153 4.3344 11.9953 4.54256C11.8377 4.75072 11.7677 5.01228 11.8003 5.27136C11.833 5.53043 11.9657 5.76645 12.17 5.92899C12.3744 6.09152 12.6342 6.16767 12.894 6.14115C13.8792 6.01865 14.8791 6.10679 15.8276 6.39974C16.7762 6.69269 17.6516 7.18377 18.3961 7.84046C19.1406 8.49715 19.7372 9.30449 20.1462 10.209C20.5553 11.1136 20.7676 12.0947 20.769 13.0874C20.7687 14.3828 20.6886 15.6769 20.529 16.9624C20.5115 17.0931 20.52 17.226 20.554 17.3535C20.5881 17.4809 20.647 17.6004 20.7274 17.7049C20.8078 17.8095 20.9081 17.8971 21.0225 17.9628C21.1369 18.0284 21.2632 18.0708 21.394 18.0874C21.4355 18.0924 21.4772 18.0949 21.519 18.0949C21.7622 18.0944 21.9969 18.0052 22.1791 17.8442C22.3613 17.6831 22.4786 17.4612 22.509 17.2199C22.6776 15.8514 22.7611 14.4738 22.759 13.0949C22.7584 10.7092 21.8115 8.42113 20.1262 6.73255C18.4409 5.04396 16.1547 4.0927 13.769 4.0874ZM21.0103 20.1187C20.883 20.0858 20.7506 20.0783 20.6205 20.0966C20.4904 20.1149 20.3651 20.1587 20.2519 20.2254C20.1387 20.2922 20.0398 20.3806 19.9608 20.4856C19.8818 20.5906 19.8243 20.7102 19.7915 20.8374C19.609 21.5487 19.3978 22.2624 19.1665 22.9624C19.0819 23.2132 19.1002 23.4873 19.2173 23.7247C19.3345 23.9621 19.541 24.1433 19.7915 24.2287C19.8942 24.2636 20.0019 24.2813 20.1103 24.2812C20.3198 24.281 20.524 24.215 20.694 24.0926C20.864 23.9701 20.9912 23.7973 21.0578 23.5987C21.3078 22.8587 21.5315 22.0987 21.7265 21.3424C21.76 21.2152 21.7681 21.0826 21.7503 20.9522C21.7325 20.8219 21.6891 20.6963 21.6227 20.5828C21.5563 20.4692 21.4681 20.3699 21.3632 20.2904C21.2584 20.211 21.1388 20.1531 21.0115 20.1199L21.0103 20.1187Z" />

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
            <div className={`${hidden ? "hidden" : "block"}`}>
              <h4 className={"ml-4 text-white-primary"}>PS</h4>
            </div>
          </li>
        </ul>
      </div>
      <div className="h-[10%] py-4 w-full px-3 content-end">
        <div className="flex items-center group-hover:justify-start px-2 py-2 mt-auto">
          <button onClick={handleLogout}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 fill-red-primary bg-white-primary rounded-lg p-1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.3354 23.4932C10.3354 23.7584 10.2301 24.0127 10.0426 24.2003C9.85502 24.3878 9.60067 24.4932 9.33545 24.4932H2.33545C1.80502 24.4932 1.29631 24.2824 0.921236 23.9074C0.546163 23.5323 0.335449 23.0236 0.335449 22.4932V2.49316C0.335449 1.96273 0.546163 1.45402 0.921236 1.07895C1.29631 0.703878 1.80502 0.493164 2.33545 0.493164H9.33545C9.60067 0.493164 9.85502 0.598521 10.0426 0.786057C10.2301 0.973594 10.3354 1.22795 10.3354 1.49316C10.3354 1.75838 10.2301 2.01273 10.0426 2.20027C9.85502 2.38781 9.60067 2.49316 9.33545 2.49316H2.33545V22.4932H9.33545C9.60067 22.4932 9.85502 22.5985 10.0426 22.7861C10.2301 22.9736 10.3354 23.2279 10.3354 23.4932ZM24.0429 11.7857L19.0429 6.78566C18.8553 6.59802 18.6008 6.49261 18.3354 6.49261C18.0701 6.49261 17.8156 6.59802 17.6279 6.78566C17.4403 6.9733 17.3349 7.2278 17.3349 7.49316C17.3349 7.75853 17.4403 8.01302 17.6279 8.20066L20.9217 11.4932H9.33545C9.07023 11.4932 8.81588 11.5985 8.62834 11.7861C8.44081 11.9736 8.33545 12.2279 8.33545 12.4932C8.33545 12.7584 8.44081 13.0127 8.62834 13.2003C8.81588 13.3878 9.07023 13.4932 9.33545 13.4932H20.9217L17.6279 16.7857C17.4403 16.9733 17.3349 17.2278 17.3349 17.4932C17.3349 17.7585 17.4403 18.013 17.6279 18.2007C17.8156 18.3883 18.0701 18.4937 18.3354 18.4937C18.6008 18.4937 18.8553 18.3883 19.0429 18.2007L24.0429 13.2007C24.1359 13.1078 24.2097 12.9975 24.26 12.8761C24.3103 12.7547 24.3362 12.6246 24.3362 12.4932C24.3362 12.3617 24.3103 12.2316 24.26 12.1102C24.2097 11.9888 24.1359 11.8785 24.0429 11.7857Z" />
            </svg>
          </button>
          <div className={`${hidden ? "hidden" : "block"}`}>
            <h4 className="pl-4 flex-shrink-0">Hi, {userData.name}</h4>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
