import { axiosCallee, MS_APP_INSTANCE } from "./api";

const metadata = [
  {
    root: "mission",
    instance: MS_APP_INSTANCE,
    child: [
      {
        method: axiosCallee("get"),
        uri: "mission",
        name: "get-all",
      },
      {
        method: axiosCallee("post"),
        uri: "mission",
        name: "create",
      },
      {
        method: axiosCallee("get"),
        uri: "mission/assets",
        name: "get-mission-assets-by-type",
      },
      {
        method: axiosCallee("post"),
        uri: "mission/assets",
        name: "create-mission-assets",
      },
    ],
  },
];

export default metadata;